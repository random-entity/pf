# Architecture

How this site works under the hood. For authoring content, see the
[README](README.md); this document is for people changing the code.

## TL;DR

It's a **static single-page app**. Every artwork is a Markdown file with YAML
frontmatter. At build time Vite inlines all of them; at runtime the app parses
the frontmatter, **derives a filter/sort schema from whatever keys it finds**,
and renders an Obsidian-like sidebar over it. There is no server, database, or
config file describing the fields — the UI is a function of the content.

```
Markdown files ──glob──▶ parse frontmatter ──▶ normalize ──▶ artworks[]
                                                                │
                                       ┌────────────────────────┼─────────────────────┐
                                       ▼                        ▼                     ▼
                                 derive schema           Properties block        Home / pages
                                 (properties.js)          (per artwork)
                                       │
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
| `src/i18n.jsx` | Language context, UI strings, and the localized-value helpers `loc` / `isLocalized`. |
| `src/filters.jsx` | `FilterProvider` — the entire sort/filter selection state, lifted above the router. Includes `requestExpand` / `expandPath` for cross-page accordion expansion. |
| `src/lib/content.js` | Loads & parses every Markdown file; normalizes dimensions; exports `artworks`, `bySlug`, `titleOf`, `resolveSlug`. |
| `src/lib/properties.js` | **Schema engine** — classifies frontmatter keys into facets; value helpers (dates, durations, enums, units, releases). |
| `src/lib/markdown.js` | Language fences, `[[wikilinks]]`, heading-outline extraction, `pickLanguage`, `plainText`. |
| `src/lib/search.js` | Body search: exact case-insensitive substring match with snippet extraction, occurrence ranking, and cross-language deduplication. |
| `src/lib/remarkGallery.js` | remark plugin: wraps 2+ consecutive image paragraphs in a `div.gallery` (horizontal scroll); single images stay full-width. |
| `src/components/Sidebar.jsx` | Top-bar with the site-title link + `LangSwitch`, then `DatabaseBrowser`. |
| `src/components/LangSwitch.jsx` | Always-visible en/ko/ja selector wired to `useLang()`. |
| `src/components/DatabaseBrowser.jsx` | The sidebar: search box, `FilterTree`, group-by, reset, and the results list. Owns the filter/sort/group **pipeline** and the `exactMetaMatch` function for title/enum/event search. |
| `src/components/FilterTree.jsx` | Renders one accordion row per facet with the controls its type supports + active markers. |
| `src/components/Properties.jsx` | Obsidian-style properties block for one artwork. Enum values are clickable `EnumPill` components; plain strings render with `InlineMarkdown` (links, wikilinks, bold, etc.). |
| `src/components/Markdown.jsx` | `react-markdown` with remark plugins `remark-gfm`, `remark-math`, `remarkGallery` and rehype plugins `rehypeMathDisplay` (local), `rehype-katex`, `rehype-raw` (raw HTML passes through, enabling `<canvas>` and other inline HTML), `rehype-slug`; YouTube/image/canvas custom components; collapsible headings/lists injected via DOM in a `useEffect`. |
| `src/pages/Home.jsx`, `src/pages/ArtworkPage.jsx` | The two routes. |
| `scripts/rename-value.mjs` | CLI to rename an enum value across all Markdown files. |

## Content pipeline (`content.js`)

1. `import.meta.glob('../content/{personal-works,group-works,modules}/**/*.md', { eager: true, query: '?raw' })`
   pulls every file in as a raw string at build time.
2. Frontmatter is split with a regex and parsed with `js-yaml`. A parse error is
   caught and logged, never thrown — malformed frontmatter degrades, it doesn't
   blank the page.
3. `dimensions` is normalized to **meters** (`dimensionsToMeters`) and its `unit`
   is dropped, so width/height are comparable numbers downstream.
4. The result is `artworks[]` — `{ slug, name, dirs, data, body }` — plus a
   `bySlug` index. `slug` comes from the file path; the folder structure is only
   used for the slug, not for navigation. `bySlug` also registers a
   backward-compatible alias for each item (`works/<name>` or `modules/<name>`
   based on `type`) so routes from the pre-refactor structure still resolve.

## Localization (`i18n.jsx`)

A value may be a plain scalar or a **localized object** `{ en, ko, ja }`.
`loc(value, lang)` resolves it and is deliberately crash-proof: current language
→ English → first scalar → `''`. `isLocalized()` returns true only when every
key is a known language code, which is how the schema tells a "localized string"
apart from a generic nested object. UI strings live in `UI[lang]`; `propLabel`
translates known frontmatter keys.

## The schema engine (`properties.js`) — the core idea

There is **no field configuration**. The schema is computed once from the data:

### Step 1 — classify each key

For every top-level key, all of its non-null values across all artworks are
collected and passed to `classify()`. First match wins, in this order:

| Condition (over the key's values) | Kind | Resulting controls |
|---|---|---|
| any is an **array** of categoricals (string/localized); the rest categorical | `stringList` | multi-select (OR/AND) |
| every value is a **Date** | `date` | sort + range |
| every value is a **number** | `numeric` | sort + range |
| every value is a **string / number / bool / localized object** | `enumSingle` | multi-select (OR/AND) |
| every value is an **`{hours?,minutes?,seconds?}`** object | `duration` | sort + range, formatted `HH:MM:SS` |
| every value is a **plain object** (not Date/array) | `nested` | expands into child facets (recurse) |
| anything else (e.g. a list mixing objects + numbers) | — | **skipped** |

Order matters: a duration object isn't localized so it falls past `enumSingle`;
a generic object falls to `nested`.

Two keys are handled specially, before the generic classifier:

- **`dimensions`** is pre-normalized to meters in `content.js`, so it classifies
  as a `nested` object of numeric children (`width`, `height`).
- **`releases`** is intercepted entirely: it becomes a `releases` facet with
  date behavior (Min = all release **start** dates, Max = all **end** dates) and
  enum behavior (the event names become filterable values).

`title` is excluded from the schema and re-added by `FilterTree` as a synthetic
sort-only facet (`kind: 'text'`).

### Step 2 — keep only facets that carry variation

A numeric/date facet needs **>1 distinct value** (no point ranging a constant);
enum facets need ≥1 value; nested facets need at least one usable child.

### Step 3 — exports

`schema` is the facet tree; `facetByPath` is a flat lookup (including nested
children) used by the filter pipeline. Helpers: `canonicalOf` (language-stable
identity for an enum value), `labelOf` (localized display), `getValueAtPath`,
`idsAtPath`, `valuesCanCoexist`, `releaseEvents` / `releaseSortValue`,
`durationSeconds` / `formatDuration`, `formatDate`, `unitForPath`.

## Releases (`properties.js` — `parseRelease`, `normalizeEvent`)

The `releases` field uses a structured object format:

```yaml
releases:
  - event: "Seoul Performing Arts Festival (SPAF)"
    date: "2024-11-01 ~ 2024-11-05"
    venue: "Arko Arts Theater"
    version: "v2"
```

The `event` field accepts a plain string, a localized object `{ en, ko, ja }`,
or the YAML block-sequence form (`- en: "..." / - ko: "..."`) which YAML parses
as an array of single-key objects. `normalizeEvent()` merges the array form into
a single `{ en, ko, ja }` object so the rest of the system can treat all three
cases uniformly.

`facetsFrom()` deduplicates events by **canonical ID** (the English name via
`canonicalOf`) while keeping the raw localized value for display. This means the
sidebar filter pills show the current language's event name, while filter state
tracks the canonical ID. `releaseNamesOf()` returns canonical strings so
`idsAtPath()` and the filter pipeline's `includes()` check work regardless of
the underlying value type.

The old single-key object format (`{ "Event name": "YYYY-MM-DD" }`) is still
parsed as a fallback.

## Filter/sort state (`filters.jsx`)

`FilterProvider` is mounted **above the router**, so selections survive
navigation and the artwork page's Properties pills can feed the same state. It
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
     languages), enum label values (via `labelOf` for all languages), and release
     event names (all language variants). Any hit keeps the artwork.
   - *Body match* (`bodyMatchAll` from `search.js`): exact substring match in the
     stripped body text for all languages; yields positioned snippets with
     occurrence rank so the jump target in the article is precise. Snippets from
     different languages that share identical text are deduplicated, with the
     current language kept.
2. **Per-key constraints** — for each key that is *in use* (has a multi-select,
   a range, **or** is the active sort key):
   - if the artwork has **no value** for the key: keep it only if
     `showMissing[path]` is true, else drop it;
   - else apply the multi-select (`every` for AND, `some` for OR) and/or the
     range (numeric in `[min,max]`; for releases, any release interval overlapping
     `[min,max]`).
3. **Sort** — by the single sort key (`releaseSortValue` for releases, `titleOf` for
   title, the numeric value otherwise); missing values sort last.
4. **Group-by** — optional, over a categorical key; a multi-valued artwork lands
   in each of its groups.

## The tree UI (`FilterTree.jsx`)

One accordion row per facet. The body renders the controls the kind allows:

| Kind | Sort | Range | Multi-select | "Show without value" |
|---|---|---|---|---|
| `text` (Title) | ✓ | | | |
| `numeric` / `date` | ✓ | ✓ | | ✓ |
| `releases` | ✓ | ✓ | ✓ | ✓ |
| `stringList` / `enumSingle` | | | ✓ | ✓ |
| `nested` | | | | (expands to children) |

- **OR/AND** is a borderless radio control (distinct from the bordered value
  pills). AND strikes through when the selected values can't co-occur on any one
  artwork (`valuesCanCoexist`) — so single-valued keys read clearly.
- **Markers** on each row reflect what's *active*: `↑/↓` sort, `↔` range,
  `✓` multi-select, `∅` including empties (aggregated from descendants).
- Open/closed state is lifted into `FilterTree`. The component also listens to
  `expandPath` from `FilterProvider`: when set, it opens the corresponding
  accordion (and any ancestors for nested paths) — this is triggered when a user
  clicks an enum pill in a Properties block on the artwork page.

## Properties block (`Properties.jsx`)

### Unified value rendering rules

All frontmatter values — at any depth — follow one consistent pipeline in the
`Value` component. The rules are applied in priority order:

| Condition | Rendering |
|---|---|
| `releases` path | `ReleasesValue` — `DATE : EVENT @VENUE (VERSION)` |
| Enum facet path | `EnumPill` — clickable filter button (see below) |
| `Date` object | `formatDate` |
| `{hours?,minutes?,seconds?}` (duration) | `formatDuration` |
| **Localized object** `{en,ko,ja}` | Pick current-language value → re-enter pipeline |
| **Array** | `<ul>` — each item re-enters the pipeline |
| **Nested object** | Key/value grid — each value re-enters the pipeline |
| **String** (final rule) | `InlineMarkdown` (see below) |

**Key principle**: every string value, anywhere in the tree (including inside
localized objects, arrays, nested objects, and `ReleasesValue` sub-fields like
`venue` and `version`), is always rendered through `InlineMarkdown`. This means
`[text](url)` links, wikilinks, and emphasis work uniformly everywhere.

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
`github-slugger` algorithm, and `ArtworkPage` scrolls to the hash on change.

**Footnotes** are authored as named GFM footnotes (`[^label]`, `[^label]: …`),
but their displayed numbers are *not* GFM's. `remark-gfm` still renders the
definition list (so definition markdown works), and footnote references in
frontmatter property values are emitted by `Properties.jsx`'s `InlineMarkdown` as
`<sup data-fn-ref>` markers. A single `useLayoutEffect` in `ArtworkPage` then
takes over: it walks every reference in **document order** (the Properties block
precedes `.article`, so frontmatter citations come first), renumbers each
reference by first appearance, reorders the definition `<li>`s to match, and
rebuilds each definition's `↩` backlinks in appearance order (assigning unique
`fnback-<label>-<n>` ids). This is why `InlineMarkdown`'s components live at
module scope — stable identities let that DOM mutation survive re-renders instead
of being remounted away.

`footnotePlan()` in `ArtworkPage` reconciles two gaps before the body is
rendered. First, `remark-gfm` only emits a definition that is referenced *in the
body*, so a footnote cited only in the frontmatter would be dropped — for those
labels it appends a hidden "seed" reference (the footnote effect then hides the
seed and keeps the frontmatter citation as the real backlink target). Second,
definitions live inside `::: lang` sections, so once `pickLanguage` strips the
other fences a footnote defined only in (say) the English section has no
definition in Korean/Japanese; `footnotePlan()` scans the *raw* body for a
definition in any fence and injects it as a fallback when the current language
lacks one. A definition written in the current language always wins over the
fallback.

Collapsible headings and list nesting are injected by `Markdown.jsx` via a DOM
`useEffect` that prepends toggle buttons after each render. Clicking a search
snippet in the sidebar uses `router.navigate` state (`jumpTo`, `jumpOcc`,
`jumpLang`) to scroll `ArtworkPage` to the precise occurrence and highlight it
with a brief CSS animation.

## Routing & deploy

`HashRouter` keeps client routing working on GitHub Pages with no server
rewrites. `vite.config.js` sets `base: './'` so the build works under any path.
The included Actions workflow builds and publishes on push to `main`.
