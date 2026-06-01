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
| `src/main.jsx` | Mounts providers (`LanguageProvider` → `FilterProvider`) and the `HashRouter` routes. |
| `src/App.jsx` | Layout shell: sidebar + resizer + topbar + `<Outlet/>`. Owns the resizable-sidebar logic. |
| `src/i18n.jsx` | Language context, UI strings, and the localized-value helpers `loc` / `isLocalized`. |
| `src/filters.jsx` | `FilterProvider` — the entire sort/filter selection state, lifted above the router. |
| `src/lib/content.js` | Loads & parses every Markdown file; normalizes dimensions; exports `artworks`, `bySlug`, `titleOf`, `resolveSlug`. |
| `src/lib/properties.js` | **Schema engine** — classifies frontmatter keys into facets; value helpers (dates, durations, enums, units). |
| `src/lib/markdown.js` | Language fences, `[[wikilinks]]`, and heading-outline extraction. |
| `src/lib/fuzzy.js` | Dependency-free fuzzy match for the search box. |
| `src/components/Sidebar.jsx` | Thin wrapper that renders `DatabaseBrowser`. |
| `src/components/DatabaseBrowser.jsx` | The sidebar: search box, `FilterTree`, group-by, reset, and the results list (accordion rows with heading outlines). Owns the filter/sort/group **pipeline**. |
| `src/components/FilterTree.jsx` | Renders one accordion row per facet with the controls its type supports + active markers. |
| `src/components/Properties.jsx` | Obsidian-style properties block for one artwork; enum values are clickable filters. |
| `src/components/Markdown.jsx` | `react-markdown` + `remark-gfm` + `rehype-slug` (heading ids for deep-links). |
| `src/pages/Home.jsx`, `src/pages/ArtworkPage.jsx` | The two routes. |
| `scripts/rename-value.mjs` | CLI to rename an enum value across all Markdown files. |

## Content pipeline (`content.js`)

1. `import.meta.glob('../content/artworks/**/*.md', { eager: true, query: '?raw' })`
   pulls every file in as a raw string at build time.
2. Frontmatter is split with a regex and parsed with `js-yaml`. A parse error is
   caught and logged, never thrown — malformed frontmatter degrades, it doesn't
   blank the page.
3. `dimensions` is normalized to **meters** (`dimensionsToMeters`) and its `unit`
   is dropped, so width/height are comparable numbers downstream.
4. The result is `artworks[]` — `{ slug, name, dirs, data, body }` — plus a
   `bySlug` index. `slug` comes from the file path; the folder structure is only
   used for the slug, not for navigation.

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
- **`date`** is intercepted entirely: it becomes a `dateEvents` facet (Min = all
  event **start** dates, Max = all **end** dates), and the event *names* are spun
  off into a synthetic **Events** facet (`stringList`). A plain single date is
  just an event with `start === end` and no name.

`title` is excluded from the schema and re-added by `FilterTree` as a synthetic
sort-only facet (`kind: 'text'`).

### Step 2 — keep only facets that carry variation

A numeric/date facet needs **>1 distinct value** (no point ranging a constant);
enum facets need ≥1 value; nested facets need at least one usable child.

### Step 3 — exports

`schema` is the facet tree; `facetByPath` is a flat lookup (including nested
children) used by the filter pipeline. Helpers: `canonicalOf` (language-stable
identity for an enum value), `labelOf` (localized display), `getValueAtPath`,
`idsAtPath`, `valuesCanCoexist`, `dateEvents` / `dateSortValue` / `eventNamesOf`,
`durationSeconds` / `formatDuration`, `formatDate`, `unitForPath`.

## Filter/sort state (`filters.jsx`)

`FilterProvider` is mounted **above the router**, so selections survive
navigation and the artwork page's Properties pills can feed the same state. It
holds:

- `enums`: `path → { ids: string[], mode: 'any' | 'all' }`
- `ranges`: `path → { min, max }`
- `showMissing`: `path → true` to *include* items lacking the value (default off)
- `sort`: `{ path, dir }` — a **single** active sort key

…plus the actions to mutate them and `reset()`.

## The pipeline (`DatabaseBrowser.jsx`)

For the current state, results are computed (memoized) as:

1. **Fuzzy search** — `fuzzyScore(query, haystack)` over title, slug, and every
   enum value label + event names; score 0 ⇒ filtered out.
2. **Per-key constraints** — for each key that is *in use* (has a multi-select,
   a range, **or** is the active sort key):
   - if the artwork has **no value** for the key: keep it only if
     `showMissing[path]` is true, else drop it;
   - else apply the multi-select (`every` for AND, `some` for OR) and/or the
     range (numeric in `[min,max]`; for events, any event interval overlapping
     `[min,max]`).
3. **Sort** — by the single sort key (`dateSortValue` for events, `titleOf` for
   title, the numeric value otherwise); missing values sort last.
4. **Group-by** — optional, over a categorical key; a multi-valued artwork lands
   in each of its groups.

## The tree UI (`FilterTree.jsx`)

One accordion row per facet. The body renders the controls the kind allows:

| Kind | Sort | Range | Multi-select | "Show without value" |
|---|---|---|---|---|
| `text` (Title) | ✓ | | | |
| `numeric` / `date` / `dateEvents` | ✓ | ✓ | | ✓ |
| `stringList` / `enumSingle` | | | ✓ | ✓ |
| `nested` | | | | (expands to children) |

- **OR/AND** is a borderless radio control (distinct from the bordered value
  pills). AND strikes through when the selected values can't co-occur on any one
  artwork (`valuesCanCoexist`) — so single-valued keys read clearly.
- **Markers** on each row reflect what's *active*: `↑/↓` sort, `↔` range,
  `✓` multi-select, `∅` including empties (aggregated from descendants).
- Open/closed state is lifted into `FilterTree` so the header button can collapse
  every row and then revert to the previous expansion.

## Markdown, headings & deep-links

`prepare(body, lang)` runs `pickLanguage` (keeps only the active `::: lang`
fence) then `wikiLinks` (rewrites `[[slug]]` to hash routes). `Markdown.jsx`
renders it with `rehype-slug`, which stamps an `id` on each heading. The sidebar
outline (`extractHeadings` + `buildHeadingTree`) links to those ids using the
same `github-slugger` algorithm, and `ArtworkPage` scrolls to the hash on change.

## Routing & deploy

`HashRouter` keeps client routing working on GitHub Pages with no server
rewrites. `vite.config.js` sets `base: './'` so the build works under any path.
The included Actions workflow builds and publishes on push to `main`.
