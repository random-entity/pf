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
| `src/lib/search.js` | Body search: exact case-insensitive substring match with snippet extraction, occurrence ranking, and cross-language deduplication. |
| `src/lib/remarkGallery.js` | remark plugin: wraps 2+ consecutive image paragraphs in a `div.gallery` (horizontal scroll); single images stay full-width. |
| `src/components/Sidebar.jsx` | Top-bar with the site-title link + `LangSwitch`, then `DatabaseBrowser`. |
| `src/components/LangSwitch.jsx` | Always-visible en/ko/ja selector wired to `useLang()`. |
| `src/components/DatabaseBrowser.jsx` | The sidebar: search box, `FilterTree`, group-by, reset, and the results list. Owns the filter/sort/group **pipeline** and the `exactMetaMatch` function for title/enum/event search. |
| `src/components/FilterTree.jsx` | Renders one accordion row per facet with the controls its type supports + active markers. |
| `src/components/Properties.jsx` | Obsidian-style properties block for one work. Enum values are clickable `EnumPill` components; plain strings render with `InlineMarkdown` (links, wikilinks, bold, etc.). |
| `src/components/Markdown.jsx` | `react-markdown` with remark plugins `remark-gfm`, `remark-math`, `remarkGallery` and rehype plugins `rehypeMathDisplay` (local), `rehype-katex`, `rehype-raw` (raw HTML passes through, enabling `<canvas>` and other inline HTML), `rehype-slug`; YouTube/image/canvas custom components; collapsible headings/lists injected via DOM in a `useEffect`. |
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

`schema` is the facet tree; `facetByPath` is a flat lookup (including nested
children) used by the pipeline.

## Releases

`releases` is just a `group` of typed sub-fields — no bespoke parser or renderer:

```yaml
releases:
  - event: "Seoul Performing Arts Festival (SPAF)"   # releases.event → enum
    date: "2024-11-01 ~ 2024-11-05"                   # releases.date  → date
    venue: "Arko Arts Theater"                        # releases.venue → text
    version: "v2"                                      # releases.version → text
```

So the sidebar gets a **Releases** group containing a **Date** sub-facet (sort +
range; the default sort is `releases.date` descending) and an **Event** sub-facet
(filter + group). The Properties block renders each release generically as a
nested grid (Event pill, formatted Date, Venue/Version text). Event names may be
plain strings or localized objects `{en,ko,ja}`; `canonicalOf` gives the
language-stable id used for filtering while pills display the current language.

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

1. **Search** — Two independent search passes:
   - *Meta match* (`exactMetaMatch`): case-insensitive substring over title (all
     languages) and every **enum** facet's values (via `labelOf` for all
     languages, which covers release event names). Any hit keeps the work.
   - *Body match* (`bodyMatchAll` from `search.js`): exact substring match in the
     stripped body text for all languages; yields positioned snippets with
     occurrence rank so the jump target in the article is precise. Snippets from
     different languages that share identical text are deduplicated, with the
     current language kept.
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
| `nested` (group, e.g. Releases) | | | | (expands to children) |

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
| type `date` | `formatDate` / `start → end` |
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
  `Value`, skipping `enum`/`date`/`number`/`duration` paths since only `text`
  leaves render footnote refs) wrapped in a `div.fn-seeds`
  (`display:none`). Because the seeds come first, remark numbers and orders the
  footnotes frontmatter-first, emits the definitions (so a frontmatter-only
  footnote isn't dropped), and gives each seed a backref.

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
`useEffect` that prepends toggle buttons after each render. Clicking a search
snippet in the sidebar uses `router.navigate` state (`jumpTo`, `jumpOcc`,
`jumpLang`) to scroll `WorkPage` to the precise occurrence and highlight it
with a brief CSS animation.

## Routing & deploy

`HashRouter` keeps client routing working on GitHub Pages with no server
rewrites. `vite.config.js` sets `base: './'` so the build works under any path.
The included Actions workflow builds and publishes on push to `main`.
