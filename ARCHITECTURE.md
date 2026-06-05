# Architecture

How this site works under the hood. For authoring content, see the
[README](README.md); this document is for people changing the code.

## TL;DR

It's a **static single-page app**. Every **work** (an artwork, a module, a toy,
… — whatever the portfolio holds) is a Markdown file with YAML frontmatter. A
work's kind is its `type` frontmatter property, **not** its folder: the
subdirectories under `src/content/` are just loose authoring buckets, so the
loader globs all of them. At build time Vite inlines all of them; at runtime the
app parses the frontmatter and renders an Obsidian-like sidebar over it. How each
property behaves — plain text, filter pills, date sort, … — is declared
**explicitly** in one config file (`src/lib/schema.js`); the facet engine and the
renderers are a pure function of that config plus the content. There is no server
or database.

```
Markdown files ──glob──▶ parse frontmatter ──▶ normalize ──▶ works[]
                                                                │
   src/lib/schema.js ─ property types + labels ─┐              │
                                                ▼              │
                                       ┌─────── build facets ──┼─────────────────────┐
                                       ▼     (properties.js)   ▼                     ▼
                                 facet tree              Properties block        Home / pages
                                       │                  (per work)
                                       ▼
                            FilterTree  +  FilterProvider state
                                       │
                                       ▼
                              filtered / sorted results
```

## File map

| File | Responsibility |
|---|---|
| `src/main.jsx` | Mounts providers (`LanguageProvider` → `FilterProvider`) and the `HashRouter` routes. A legacy `artwork/*` route redirects to the bare path, preserving hash + state. |
| `src/App.jsx` | Layout shell: sidebar + resizer + topbar + `<Outlet/>`. Owns the resizable-sidebar logic. |
| `src/i18n.jsx` | Language context, UI-chrome strings, and the localized-value helpers `loc` / `isLocalized`. `propLabel` delegates to `schema.js`. |
| `src/lib/schema.js` | **Property schema** — the single source of truth for each property's `type` (root + nested dotted paths) and its editable en/ko/ja `label`. Exports `PROPERTY_SCHEMA`, `typeForPath`, `labelForPath`. |
| `src/filters.jsx` | `FilterProvider` — the entire sort/filter selection state, lifted above the router. Includes `requestExpand` / `expandPath` for cross-page accordion expansion. |
| `src/lib/content.js` | Loads & parses every Markdown file; normalizes dimensions; exports `works`, `bySlug`, `titleOf`, `resolveSlug`. |
| `src/lib/properties.js` | **Facet engine** — builds the facet tree from `schema.js` + content; value helpers (dates, durations, enums, units) and path-typed collectors (`valuesAtPath`, `idsAtPath`, `sortValueForFacet`, `rangeMatchesFacet`). |
| `src/lib/markdown.js` | Language fences, `[[wikilinks]]`, heading-outline extraction, `pickLanguage`, `plainText`. |
| `src/lib/search.js` | Search over **body** and **frontmatter property** text: exact case-insensitive substring match (`bodyMatchAll` / `propMatchAll`) with snippet extraction, occurrence ranking, and cross-language deduplication. `propMatchAll` flattens every property value — descending arrays and nested objects, picking localized strings, and including nested key labels (e.g. `credits` roles). |
| `src/lib/remarkGallery.js` | remark plugin: wraps 2+ consecutive image paragraphs in a `div.gallery` (horizontal scroll); single images stay full-width. |
| `src/lib/jump.js` | Shared jump machinery: constant-**time** smooth scroll (fixed duration via rAF, instant fallback when the tab is hidden / reduced-motion), persistent jump highlights (element class + Custom Highlight API for text ranges) that clear on an empty-area click, and footnote forward/return jumps. |
| `src/lib/glossary.js` | **Global footnotes / glossary**: parses the shared definitions in `glossary/glossary.md` (per-language via `pickLanguage`) and exports `hasGlobalFootnote(label)` + `globalFootnoteDef(label, lang)` (current lang → English → any). |
| `glossary/glossary.md` | The dedicated glossary source — footnote `[^label]: …` AND URL-map `(^label): url` definitions with `::: en/ko/ja` fences. A separate top-level dir so it can later become a git submodule pointing at a real external repo. |
| `src/lib/urlmap.js` | **URL map** for the `[text](^label)` link syntax: `buildUrlResolver(body, lang)` (page-local `(^label): url` defs → glossary), `stripUrlDefs`, `resolveUrlRefs`. |
| `src/components/Sidebar.jsx` | Top-bar with the site-title link + `LangSwitch`, then `DatabaseBrowser`. |
| `src/components/LangSwitch.jsx` | Always-visible en/ko/ja selector wired to `useLang()`. |
| `src/components/DatabaseBrowser.jsx` | The sidebar: search box, `FilterTree`, group-by, reset, and the results list. Owns the filter/sort/group **pipeline** and the `exactMetaMatch` function for title/enum/event search. |
| `src/components/FilterTree.jsx` | Renders one accordion row per facet with the controls its type supports + active markers. |
| `src/components/Properties.jsx` | Obsidian-style properties block for one work. Enum values are clickable `EnumPill` components; plain strings render with `InlineMarkdown` (links, wikilinks, bold, etc.). |
| `src/components/Markdown.jsx` | `react-markdown` with remark plugins `remark-gfm`, `remark-math`, `remarkGallery` and rehype plugins `rehypeMathDisplay` (local), `rehype-katex`, `rehype-raw` (raw HTML passes through, enabling `<canvas>` and other inline HTML), `rehype-slug`; YouTube/image/canvas custom components; collapsible headings/lists injected via DOM in a `useEffect`; footnote/anchor click delegation routed through `jump.js`. |
| `src/components/FootnotePreview.jsx` | Mounted once (in `main.jsx`); a hover popup that previews a footnote's definition near the cursor when any footnote ref is hovered. Rendered via a portal at `document.body`, dynamically sized and flipped to stay on-screen. |
| `src/pages/Home.jsx`, `src/pages/WorkPage.jsx` | The two routes. |
| `scripts/rename-value.mjs` | CLI to rename an enum value across all Markdown files. |

## Content pipeline (`content.js`)

1. `import.meta.glob(['../content/**/*.md', '!../content/home.md'], { eager: true, query: '?raw' })`
   pulls every work's file in as a raw string at build time — at any depth and in
   any subfolder, since the folder is not the source of truth (`type` is). Only
   `home.md` (the site intro, not a work) is excluded.
2. Frontmatter is split with a regex and parsed with `js-yaml`. A parse error is
   caught and logged, never thrown — malformed frontmatter degrades, it doesn't
   blank the page.
3. `dimensions` is normalized to **meters** (`dimensionsToMeters`) and its `unit`
   is dropped, so width/height are comparable numbers downstream.
4. The result is `works[]` — `{ slug, name, dirs, data, body }` — plus a
   `bySlug` index. `slug` comes from the file path; the folder structure is only
   used for the slug, not for navigation. `bySlug` also registers a
   backward-compatible alias for each item (`works/<name>` or `modules/<name>`
   based on `type`) so routes from the pre-refactor structure still resolve.

## Localization (`i18n.jsx`)

A value may be a plain scalar or a **localized object** `{ en, ko, ja }`.
`loc(value, lang)` resolves it and is deliberately crash-proof: current language
→ English → first scalar → `''`. `isLocalized()` returns true only when every
key is a known language code, which is how the app tells a "localized string"
apart from a generic nested object. UI-chrome strings live in `UI[lang]`;
`propLabel(path)` resolves a frontmatter property's display label via
`labelForPath` in `schema.js`.

## The property schema (`schema.js`) — the core idea

Property behavior is **declared, not inferred**. `PROPERTY_SCHEMA` maps a
property **path** to `{ type, label?, unit? }`:

- **Paths** are bare keys (`tags`) or dotted nested paths (`releases.event`).
  Array traversal is implicit: `releases` is a list of objects, so
  `releases.event` means "the event of every release".
- **`type`** drives both rendering and facet behavior:

| `type` | renders as | facet |
|---|---|---|
| `text` | inline markdown (links/bold/footnotes) | none — search only |
| `enum` | filter pill(s) | filter + group |
| `date` | formatted date / `start → end` | sort + range |
| `number` | number (+ optional `unit`) | sort + range |
| `duration` | `HH:MM:SS` | sort + range |
| `group` | nested key/value grid (recurse) | container only |

- **`label`** is the editable en/ko/ja display label (root keys and any nested
  key whose label should be localized, e.g. `releases.venue`).
- Any path **not listed** defaults to `text` (covers dynamic nested keys such as
  credit roles). Raw YAML `Date` values always render formatted.

Container shapes are handled **structurally, independent of type**: a localized
object `{en,ko,ja}` is picked for the current language; an array renders/collects
each element (enum ⇒ one pill each); a plain object becomes a nested grid.

`schema.js` also exports two ordering arrays, the single place to reorder the UI:
`FACET_ORDER` (sidebar filter/sort/group rows, with `'title'` denoting the
synthetic Title row) and `FRONTMATTER_ORDER` (Properties block rows). Paths not
listed sort after the listed ones, alphabetically — applied by both `FilterTree`
and `Properties` via the same `indexOf`/`Infinity`/`localeCompare` comparator.

## The facet engine (`properties.js`)

`properties.js` turns the schema into a usable facet tree:

1. **Build** (`buildFacet`, run once into `schema`): for each schema path it
   scans all works via `valuesAtPath` (the array-aware path collector) and
   produces a facet — `enum` (distinct values + counts), `date`/`number`/
   `duration` (option/min/max), or `group` (a `nested` node whose children are
   the facet-bearing sub-paths). Facets carrying no variation are dropped
   (date/number need >1 option). `title` is excluded — `FilterTree` re-adds it as
   a synthetic sort-only row.
2. **Query helpers**, all path-typed and array-aware:
   - `valuesAtPath` / `idsAtPath` — raw values / canonical ids at a path.
   - `sortValueForFacet` — date: earliest start; number/duration: minimum.
   - `rangeMatchesFacet` — date: any interval overlaps `[min,max]`; numeric: any
     value in `[min,max]`.
   - `hasValueAtPath`, `valuesCanCoexist`.
   - `canonicalOf` (language-stable id), `labelOf` (localized display, strips
     `[text](url)`), `parseDateRange`, `formatDate`, `durationSeconds` /
     `formatDuration`, `unitForPath`.

   `parseDateRange` accepts a YAML `Date`, a `YYYY-MM-DD` string, a `a ~ b`
   range, **or a wildcard** date that masks a trailing run of **digits** with
   `x`/`X` across the year/month/day (`2022-XX-XX`, `2022-06-XX`, `205x-XX-XX`,
   `20XX-XX-XX`). It returns `{ start, end, display }`: `start`/`end` span the
   full window the value could represent (`205x-XX-XX` → 2050-01-01 … 2059-12-31,
   so a wildcard sorts by its earliest date, overlaps the range filter across its
   whole span, and the Min/Max lists pick up both bounds), while `display` is the
   masked human form (`205?-??-??`) the Properties block renders. Wildcards must
   be a trailing run of the `yyyymmdd` digit sequence (a masked digit before a
   concrete one — `2022-XX-06`, `20x4-XX-XX` — is rejected and falls back to text).

`schema` is the facet tree; `facetByPath` is a flat lookup (including nested
children) used by the pipeline.

## Releases

`releases` is just a `group` of typed sub-fields — no bespoke parser or renderer:

```yaml
releases:
  - event: "Seoul Performing Arts Festival (SPAF)"   # releases.event   → enum
    date: "2024-11-01 ~ 2024-11-05"                   # releases.date    → date
    venue: "Arko Arts Theater"                        # releases.venue   → enum
    version: "v2"                                      # releases.version → text
```

So `releases` contributes a **Date** facet (sort + range; the default sort is
`releases.date` descending), an **Event** facet (filter + group), and a **Venue**
facet (filter + group). `FilterTree` **hoists these sub-facets to the sidebar
root** — there is no "Releases" wrapper row; Date/Event/Venue appear at the top
level (then ordered by `FACET_ORDER`). The Properties block still renders each
release generically as a nested grid (Event pill, formatted Date, Venue pill,
Version text). Event/venue names may be plain strings or localized objects
`{en,ko,ja}`; `canonicalOf` gives the language-stable id used for filtering while
pills display the current language.

> The legacy single-key shape `{ "Event name": "YYYY-MM-DD" }` and the bare
> date-string shape are **no longer supported** — all content has been migrated
> to the `{ event, date, … }` object form.

## Filter/sort state (`filters.jsx`)

`FilterProvider` is mounted **above the router**, so selections survive
navigation and the work page's Properties pills can feed the same state. It
holds:

- `enums`: `path → { ids: string[], mode: 'any' | 'all' }`
- `ranges`: `path → { min, max }`
- `showMissing`: `path → true` to *include* items lacking the value (default off)
- `sort`: `{ path, dir }` — a **single** active sort key
- `expandPath` / `requestExpand(path)`: one-shot signal that causes `FilterTree`
  to open the accordion for `path` on the next render, then clears itself

…plus the actions to mutate them and `reset()`.

## The pipeline (`DatabaseBrowser.jsx`)

For the current state, results are computed (memoized) as:

1. **Search** — three independent passes (a work is kept if any matches):
   - *Meta match* (`exactMetaMatch`): case-insensitive substring over title (all
     languages) and every **enum** facet's values (via `labelOf` for all
     languages, which covers release event/venue names).
   - *Body match* (`bodyMatchAll` from `search.js`): exact substring match in the
     stripped body text for all languages; yields positioned snippets with
     occurrence rank so the jump target in the article is precise.
   - *Property match* (`propMatchAll` from `search.js`): the same substring +
     snippet machinery over the flattened frontmatter property text — it descends
     arrays and nested objects, picks localized strings, and includes nested key
     labels (so `credits` names *and* roles are searchable). Snippets carry an
     occurrence rank used to jump into the rendered Properties block.

   Snippets from different languages that share identical text are deduplicated,
   keeping the current language.
2. **Per-key constraints** — for each key that is *in use* (has a multi-select,
   a range, **or** is the active sort key):
   - if the work has **no value** for the key: keep it only if
     `showMissing[path]` is true, else drop it;
   - else apply the multi-select (`idsAtPath` + `every` for AND / `some` for OR)
     and/or the range (`rangeMatchesFacet`: numeric in `[min,max]`; date facets
     match when any interval overlaps `[min,max]`).
3. **Sort** — by the single sort key (`titleOf` for title, else
   `sortValueForFacet`); missing values sort last.
4. **Group-by** — optional, over a categorical key; a multi-valued work lands
   in each of its groups.

## The tree UI (`FilterTree.jsx`)

One accordion row per facet. The body renders the controls the kind allows:

| Kind | Sort | Range | Multi-select | "Show without value" |
|---|---|---|---|---|
| `text` (Title row only) | ✓ | | | |
| `date` / `number` / `duration` | ✓ | ✓ | | ✓ |
| `enum` | | | ✓ | ✓ |
| `nested` (group) | | | | (expands to children) |

(`date` and `enum` facets also expose a **group-by** icon; date facets group by
year.)

- **Row order & hoisting.** The flat list is built from `[Title, …schema]`, with
  the `releases` group's children **hoisted to the root** (no wrapper row), then
  sorted by `FACET_ORDER` (`schema.js`). A `nested` row is still rendered for any
  other group, expanding to its children in place.
- **OR/AND** is a borderless radio control (distinct from the bordered value
  pills). AND strikes through when the selected values can't co-occur on any one
  work (`valuesCanCoexist`) — so single-valued keys read clearly.
- **Markers** on each row reflect what's *active*: `↑/↓` sort, `↔` range,
  `✓` multi-select, `∅` including empties (aggregated from descendants).
- Open/closed state is lifted into `FilterTree`. The component also listens to
  `expandPath` from `FilterProvider`: when set, it opens the corresponding
  accordion (and any ancestors for nested paths) — this is triggered when a user
  clicks an enum pill in a Properties block on the work page.

## Properties block (`Properties.jsx`)

### Unified value rendering rules

All frontmatter values — at any depth — follow one consistent pipeline in the
`Value` component, driven by the declared `typeForPath(path)`. The rules are
applied in priority order:

| Condition | Rendering |
|---|---|
| **Localized object** `{en,ko,ja}` | Pick current-language value → re-enter pipeline (same path) |
| type `enum` | `EnumPill`(s) — clickable filter button(s) (see below) |
| type `date` | `parseDateRange(value).display` — formatted date, `start → end`, or masked wildcard (`2022-??-??`) |
| **Array** (non-enum) | `<ul>` — each item re-enters the pipeline with the **same** path |
| `Date` object | `formatDate` |
| type `duration` (or a duration object) | `formatDuration` |
| `number` | value + optional `unit` |
| **Plain object** | Key/value grid — each value re-enters with the extended path; keys use `labelForPath` |
| **String** / default (`text`) | `InlineMarkdown` (see below) |

**Key principle**: every `text` value, anywhere in the tree (including inside
localized objects, arrays, nested objects, and release sub-fields like `venue`
and `version`), is rendered through `InlineMarkdown`. This means `[text](url)`
links, wikilinks, and emphasis work uniformly everywhere. Arrays keep their
path as they recurse, so nested typed fields (e.g. each `releases.event` /
`releases.date`) pick up their own declared type.

**`InlineMarkdown`** renders a string with:
- `[text](url)` → external link (new tab); `[[slug]]` → internal hash-route link
- `[text](url1)(url2)` (multi-link) → plain text + one `↗` per URL
- `**bold**`, `*italic*`, `` `code` `` → inline formatting

**`EnumPill`**: a `<button>` whose click toggles the filter and expands the
sidebar accordion. The label is the display text (markdown link syntax is
stripped). If the value is `[text](url)` or `[text](url1)(url2)`, a vertical
separator and one `↗` icon per URL are appended. Localized enum values (`{en,
ko, ja}` where each language string may itself be a markdown link) are supported:
the label and URLs are resolved from the current language's string.
Selection is indicated by stroke highlight (`border-color: var(--fg)`).

## Markdown, headings & deep-links

`prepare(body, lang)` runs `pickLanguage` (keeps only the active `::: lang`
fence) then `wikiLinks` (rewrites `[[slug]]` to hash routes). `Markdown.jsx`
renders it through this plugin chain (order matters):

- **remark**: `remark-gfm` (tables, footnotes), `remark-math` ( `$…$` / `$$…$$`),
  `remarkGallery` (groups 2+ consecutive image paragraphs into a `div.gallery`).
- **rehype**: `rehypeMathDisplay` (a local plugin that promotes a standalone
  `$$…$$` paragraph to display mode — `remark-math` v6 otherwise treats a
  single-line `$$…$$` as inline), `rehype-katex` (renders the math), `rehype-raw`
  (raw HTML in Markdown is allowed; `<canvas id="...">` tags are intercepted by a
  custom component that runs animation logic in a `useEffect`), `rehype-slug`
  (stamps an `id` on each heading).

Custom `components` also turn a YouTube-link paragraph into a responsive embed and
rewrite image `src` against `import.meta.env.BASE_URL`. The sidebar outline
(`extractHeadings` + `buildHeadingTree`) links to the heading ids using the same
`github-slugger` algorithm, and `WorkPage` scrolls to the hash on change.

**Footnotes** are authored as named GFM footnotes (`[^label]`, `[^label]: …`),
but they are renumbered by **order of appearance, frontmatter-first** rather than
by GFM's own scheme. The trick is to feed `remark-gfm` the right input rather than
to rewrite its output — earlier attempts that reordered the definition `<li>`s and
rebuilt the `↩` anchors in a layout effect corrupted React's tree and crashed
(`removeChild … not a child of this node`) on the next render/unmount. **Never
structurally mutate React-rendered DOM; only attributes are safe.**

`footnotePlan()` in `WorkPage` rewrites the body markdown before it is
rendered:

- **Cross-language definitions.** Definitions live inside `::: lang` sections, so
  once `pickLanguage` strips the other fences a footnote defined only in (say) the
  English section has no definition in Korean/Japanese. `footnotePlan()` scans the
  *raw* body for a definition in any fence and injects it as a fallback when the
  current language lacks one (a current-language definition always wins).
- **Appearance order + frontmatter backlinks.** `remark-gfm` numbers and orders
  footnotes by first reference in the body and emits one `↩` per reference. So
  `footnotePlan()` **prepends one hidden seed reference per frontmatter citation**
  (in the order `Properties` renders them — `collectFrontmatterRefs` mirrors
  `Value`: it collects refs from `text` leaves **and** `enum` pill values
  (`collectEnumRefs`, picking the current-language string), but skips
  `date`/`number`/`duration` paths) wrapped in a `div.fn-seeds`
  (`display:none`). Because the seeds come first, remark numbers and orders the
  footnotes frontmatter-first, emits the definitions (so a frontmatter-only
  footnote isn't dropped), and gives each seed a backref.
- **Global glossary fallback.** There is no special reference syntax: a normal
  `[^label]` (body, frontmatter `text`, or enum pill) falls back to the shared
  glossary `glossary/glossary.md` (see `glossary.js`). **Resolution is
  local-first**: `footnotePlan` computes `globalLabels` = every referenced label
  (frontmatter + body) that the page does **not** define locally in any fence
  (`!allDefs.has`) but the glossary does (`hasGlobalFootnote`) — so a local
  `[^label]:` definition always overrides. For each such label the glossary
  definition (`globalFootnoteDef`, current-language with fallback to English then
  any) is injected as an ordinary `[^label]: …` def, after which it's
  indistinguishable from a local footnote — same numbering, seeds, list, jumps,
  and hover preview. A label defined neither locally nor in the glossary stays an
  unresolved literal. The decision is text-only (pre-render), so no React DOM is
  mutated.

The `useLayoutEffect` in `WorkPage` then makes only **attribute** changes:
it reads each definition's list position as its number, writes that number onto
the frontmatter `<sup data-fn-ref>` (emitted by `Properties.jsx`'s
`InlineMarkdown`) and gives it an `fnref-fm-<label>-<n>` id, then retargets each
definition's leading backrefs (the seeds, emitted first) at those ids. Forward
jumps from the body and the retargeted backlinks are handled by `Markdown.jsx`'s
existing `#`-anchor click delegation (`getElementById` is global, so it finds the
frontmatter `<sup>` even though it lives outside the markdown root); frontmatter
`<sup>`s carry their own `onClick` to scroll to the definition.

Collapsible headings and list nesting are injected by `Markdown.jsx` via a DOM
`useEffect` that prepends toggle buttons after each render.

### URL map (`urlmap.js`)

`[text](^label)` is a **reference link**: the target is resolved by `label`,
**page-local first then the glossary** (`buildUrlResolver`). Because
`expandMultiLinks` only rewrites 2+ consecutive `(…)` groups and preserves each
`(^label)` token (a lone `[text](^x)` is left intact; a multi-link becomes
`[↗](^x) …`), resolution runs as a pure **post-step** on already-prepared text —
so `prepare`/`markdown.js` are untouched (avoids an import cycle). `WorkPage`
applies `resolveUrlRefs(stripUrlDefs(plan.body), urlResolve)` to the body (drop
the `(^label): url` definition lines, swap refs for real URLs), and passes the
same resolver to `Properties` via a context so `InlineMarkdown` / `EnumPill`
resolve refs in frontmatter values too. After resolution a ref is an ordinary
`<a>` — no marker, no list entry. Unresolved labels are left as `(^label)` (a
visibly broken link). Definitions may sit in `::: lang` fences for
language-specific URLs; the glossary is the cross-page fallback (`globalUrl`).

### Jumping & highlighting (`jump.js`)

All in-page navigation funnels through `jump.js` so behavior is uniform:

- **Constant-*time* scroll.** `scrollToElement` animates over a fixed duration
  (rAF + easing) regardless of distance, so short and long jumps feel the same.
  It falls back to an instant jump when the tab is hidden (rAF is paused there)
  or under `prefers-reduced-motion`.
- **Persistent highlights.** A jump highlights its target — an element via a
  class, or a precise text match via the Custom Highlight API (no DOM mutation) —
  and the highlight **persists until the user clicks an empty area** (a global
  click listener that ignores clicks on links).
- **Footnotes.** A forward jump (`jumpToFootnoteDef`) scrolls to the definition
  and highlights both it and the specific return arrow that points back to where
  you came from; a return jump (`jumpToRef`) scrolls back and highlights the
  original reference's index. Return arrows are unified to a single glyph via CSS.
- **Search snippets.** Clicking a snippet uses `router.navigate` state — `jumpTo`
  / `jumpOcc` for the body, `jumpPropTo` / `jumpPropOcc` for the Properties block,
  plus `jumpLang` — and `WorkPage` builds a DOM `Range` over the `occ`-th
  occurrence (`buildRange`, concatenating text nodes so a match spanning element
  boundaries is still found) and highlights it via the Custom Highlight API.

`FootnotePreview.jsx` (mounted once in `main.jsx`) additionally shows a small
hover popup previewing a footnote's definition when any footnote ref is hovered.

### WorkPage rendering specifics

- **Lead images.** `splitLeadImages` pulls any image appearing before the first
  body heading out of the body and renders it in a separate `.lead-media` block
  **above the Properties table** (so a work can open with a banner). Heading-less
  bodies hoist nothing. The body-jump selector is scoped to `.article:not(.lead-media)`.
- **Image remount.** The body `<Markdown>` is keyed by `slug|lang`, forcing fresh
  `<img>` nodes on navigation. Without this, React reuses the same `<img>` and
  only swaps `src`, so the previous page's image stays painted until the new one
  finishes downloading — very visible over the network on GitHub Pages.

## Routing & deploy

`HashRouter` keeps client routing working on GitHub Pages with no server
rewrites. `vite.config.js` sets `base: './'` so the build works under any path.
The included Actions workflow builds and publishes on push to `main`.
