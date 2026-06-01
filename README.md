# Artist Portfolio

A minimal, Obsidian-like portfolio site. React + Vite, deployable to GitHub
Pages. Content is plain Markdown with YAML frontmatter — no CMS, no database.

## Features

- **Minimal, monochrome UI** with automatic light/dark mode. No ornamentation.
- **Three languages** (English / 한국어 / 日本語) via an always-visible switcher.
- **Two navigators**: a file-browser **tree** mirroring the folder structure,
  and a searchable **database** (search text, sort by date/title, group by genre,
  filter by tag).
- **Properties block** (like Obsidian) rendered from frontmatter, supporting
  scalars, localized values, lists, and nested JSON objects.
- **Markdown** with GFM, footnotes, and `[[wikilinks]]` between artworks.

## Develop

```sh
npm install
npm run dev
```

Requires [Node.js](https://nodejs.org) (LTS / v20+). Open the printed local URL.

## Add or edit an artwork

Create a Markdown file anywhere under `src/content/artworks/`. The folder path
becomes the tree structure; the file name (minus `.md`) becomes the slug used by
`[[wikilinks]]`.

```markdown
---
title: { en: Sunset Study, ko: 노을 습작, ja: 夕焼けの習作 }
date: 2023-09-14
genre: { en: Painting, ko: 회화, ja: 絵画 }
dimensions: { width: 60, height: 90, unit: cm }   # nested JSON shows as key/value
tags: [oil, landscape]                            # arrays show as a list / tag pills
---
::: en
English prose. Footnotes[^1] and links to [[still-life-pears]] work.
[^1]: A footnote.
:::
::: ko
한국어 본문.
:::
::: ja
日本語の本文。
:::
```

### Frontmatter / Properties

- Any key is shown in the Properties block. Known keys (`title`, `date`, `genre`,
  `medium`, `dimensions`, `tags`, …) get translated labels; unknown keys show the
  raw key name (add labels in `src/i18n.jsx`).
- A value may be a plain string/number, a **localized object** `{ en, ko, ja }`,
  a **list** `[a, b]`, or a **nested object** `{ k: v }` — all render automatically.
- `title` is used as the page heading and is not repeated in the block.
- **Quote values containing `,` or `:`** inside inline `{ ... }` objects, e.g.
  `{ en: "Harbour, Fog" }` — an unquoted comma is read by YAML as a separator.
- `date` is used for sorting and is always shown as `YYYY-MM-DD`. It may be a
  single date, **or a list of events** — each a date or date range plus an
  optional name (quote the whole string, since it contains `:`):

  ```yaml
  date:
    - "2024-08-31 : Premiere online"
    - "2024-11-01 ~ 2024-11-05 : Seoul Performing Arts Festival"
  ```

  Event names are collected into an **Events** filter, and the Properties block
  links each date to its event. In the Date range filter, **Min** lists all
  start dates and **Max** all end dates; the match is an inclusive overlap.
- Enum-like values (`tags`, `tools`, `genre`, …) become clickable filters.
- A `{ hours, minutes, seconds }` object is treated as a single duration value
  (sorted/ranged as one number, shown as `HH:MM:SS`).

### Filtering & sorting

The sidebar builds a **filter/sort tree** automatically from your frontmatter —
every property is scanned and classified, no configuration needed:

- **Numbers & dates** (incl. nested ones like `dimensions.width`, `duration.minutes`)
  get an ascending/descending **sort** and a **min/max range** selector. Sorting is
  single-key: picking a sort replaces the previous one.
- **Lists of strings** (`tags`, `tools`) get a multi-select filter with an
  **Any / All** (OR / AND) toggle.
- **Single categorical values** (`genre`, `medium`, `status`) get a multi-select
  (OR) filter.
- **Nested objects** expand into their sub-properties.

Each key has a **"Show items without a value"** toggle (off by default). When a
key is being filtered, artworks lacking that value are dropped unless this is
checked — checking it keeps them and shows an `∅` marker on the row.

A fuzzy search box (typo- and gap-tolerant) sits on top, plus group-by and a
reset. Clicking a value in an artwork's Properties block toggles that filter.

### Renaming an enum value

Enum values live inline in the Markdown files. To rename one everywhere at once:

```sh
node scripts/rename-value.mjs <key> <oldValue> <newValue> [--dry]
# e.g.
node scripts/rename-value.mjs tags oil "oil paint"
node scripts/rename-value.mjs tools Csound Faust --dry
```

It only touches files that actually carry the value, scopes the edit to that key
(preserving the rest of your formatting), and skips localized objects like
`genre` (edit those by hand). Use `--dry` to preview.

### Language sections (`:::`)

In the body, wrap language-specific prose in fences. Text outside any fence is
shared across all languages. If a file has no fences, its whole body is shown for
every language.

### Wikilinks

`[[slug]]` or `[[slug|Custom label]]` links to another artwork. Targets resolve by
slug, trailing path segment, or file basename. Unresolved links render as plain
text.

### Images

Put images in `public/` and reference them by relative path, e.g.
`![](images/sunset.jpg)` for `public/images/sunset.jpg`. The site's base path is
applied automatically.

The home page intro lives in `src/content/home.md` (also supports `:::` fences).

## Deploy to GitHub Pages

1. Push to a GitHub repo (default branch `main`).
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and publishes on
   every push to `main`.

`vite.config.js` uses `base: './'`, so the site works under any Pages path
(`user.github.io/repo/`) without extra configuration.
