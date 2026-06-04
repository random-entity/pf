# Artist Portfolio

A minimal, Obsidian-like portfolio site. React + Vite, deployable to GitHub
Pages. Content is plain Markdown with YAML frontmatter — no CMS, no database.

## Features

- **Minimal, monochrome UI** with automatic light/dark mode. No ornamentation.
- **Three languages** (English / 한국어 / 日本語) via an always-visible switcher.
- **Schema-driven sidebar**: the filter/sort tree is built automatically from
  whatever frontmatter keys exist — numeric/date keys get sort + range, enum
  keys get OR/AND multi-select, nested objects expand. Plus a search box,
  group-by, and a resizable panel.
- **Properties block** (like Obsidian) rendered from frontmatter, supporting
  scalars, localized values, lists, nested objects, and inline markdown (links,
  wikilinks, bold, etc.). Enum values are clickable filter pills that expand the
  corresponding sidebar accordion without navigating away.
- **Markdown** with GFM, footnotes, `[[wikilinks]]`, math (KaTeX), image
  galleries, embedded YouTube, collapsible headings/lists, and a heading outline
  that deep-links into each artwork.

> Changing the code? See [ARCHITECTURE.md](ARCHITECTURE.md) for how content is
> loaded, how the filter/sort schema is derived from frontmatter, and how the
> pieces fit together.

## Develop

```sh
npm install
npm run dev
```

Requires [Node.js](https://nodejs.org) (LTS / v20+). Open the printed local URL.

`npm run build` produces the static site in `dist/`; `npm run preview` serves
that build locally. These are the only three scripts (`dev` / `build` /
`preview`), all thin wrappers over Vite.

## Add or edit an artwork

Create a Markdown file under the folder matching its `type`:

- `src/content/personal-works/`
- `src/content/group-works/`
- `src/content/modules/`

The folder path becomes the tree structure; the file name (minus `.md`) becomes
the slug used by `[[wikilinks]]`.

```markdown
---
title: { en: "Sunset Study", ko: "노을 습작", ja: "夕焼けの習作" }
date: 2023-09-14
genre: { en: "Painting", ko: "회화", ja: "絵画" }
dimensions: { width: 60, height: 90, unit: cm }   # normalized to meters; unit dropped
tags: ["oil", "landscape"]                        # arrays show as a list / tag pills
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

- Any key is shown in the Properties block. Known keys (`title`, `releases`, `genre`,
  `medium`, `dimensions`, `tags`, …) get translated labels; unknown keys show the
  raw key name (add labels in `src/i18n.jsx`).
- A value may be a plain string/number, a **localized object** `{ en, ko, ja }`,
  a **list** `[a, b]`, or a **nested object** `{ k: v }` — all render automatically.
- **All string values** support inline markdown — this applies uniformly to every
  scalar anywhere in frontmatter (plain strings, localized object values, array
  items, nested object values, and release sub-fields like `venue` and `version`):
  - `[text](url)` → clickable link (external opens in a new tab)
  - `[text](url1)(url2)` → plain text with one `↗` icon per URL (multi-link)
  - `[[wikilink]]` → link to another artwork by slug
  - `**bold**`, `_italic_`, `` `code` `` → inline formatting
  - On **enum pills**, the link text becomes the pill label and a `↗` icon is
    appended after a separator; multi-link values add one `↗` per URL.
- `title` is used as the page heading and is not repeated in the block.
- **Quote all string values inside inline `{ ... }` objects and `[ ... ]`
  arrays.** This keeps frontmatter consistent and avoids YAML treating commas,
  colons, brackets, or quote marks as syntax. For example:
  `{ en: "Harbour, Fog" }`, `tags: ["Interactive CG", "Video feedback"]`.
- Plain top-level string values like `type: Personal work` may stay unquoted
  unless they contain `:`, `,`, brackets, or quote marks.
- `releases` is used for release/event sorting, grouping, name filtering, and
  date-range filtering. Each entry is an object with an `event` name, a `date`
  (single date or inclusive range), and optional `venue` and `version`:

  ```yaml
  releases:
    - event: "Premiere online"
      date: "2024-08-31"
    - event: "Seoul Performing Arts Festival (SPAF)"
      date: "2024-11-01 ~ 2024-11-05"
      venue: "Arko Arts Theater"
      version: "v2"
  ```

  The `event` field supports localized objects, including the YAML block-sequence
  form (each language on its own line):

  ```yaml
  releases:
    - date: "2024-11-01 ~ 2024-11-05"
      event:
        - en: "Seoul Performing Arts Festival (SPAF)"
        - ko: "서울국제공연예술제"
        - ja: "ソウル国際公演芸術祭"
      venue: "Arko Arts Theater"
  ```

  The Properties block renders each release as `DATE : EVENT @VENUE (VERSION)`.
  All string sub-fields (`event`, `venue`, `version`) support inline markdown.
  In the Releases range filter, **Min** lists all start dates and **Max** all end
  dates; the match is an inclusive overlap. The old single-key object format
  (`{ "Event name": "YYYY-MM-DD" }`) is still accepted as a fallback.

- Enum-like values (`tags`, `tools`, `genre`, `medium`, …) become clickable
  filters with **OR / AND** modes. Any categorical key may hold a single value
  or a **list** (e.g. two genres) — AND becomes meaningful once values co-occur.
- A `{ hours, minutes, seconds }` object is treated as a single duration value
  (sorted/ranged as one number, shown as `HH:MM:SS`).

### Filtering, sorting & search

The sidebar builds a **filter/sort tree** automatically from your frontmatter —
every property is scanned and classified, no configuration needed:

- **Numbers & dates** (incl. nested ones like `dimensions.width`) get an
  ascending/descending **sort** and a **min/max range** selector. Sorting is
  single-key: picking a sort replaces the previous one.
- **Lists of strings** (`tags`, `tools`) get a multi-select filter with an
  **Any / All** (OR / AND) toggle.
- **Single categorical values** (`genre`, `medium`, `status`) get a multi-select
  (OR) filter.
- **Nested objects** expand into their sub-properties.

Each key has a **"Show items without a value"** toggle (off by default). When a
key is in use — sorted by, ranged, or multi-selected — artworks lacking that
value are dropped unless this is checked; checking it keeps them and shows an
`∅` marker.

The **search box** does a case-insensitive substring match across titles (all
languages), enum values, and body text. Body matches surface as inline snippets
with the matched text highlighted; clicking a snippet jumps to that location in
the article and highlights it. Each enum value pill in a Properties block is
also clickable: it toggles the filter for that value and expands the relevant
sidebar accordion.

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

### Footnotes

Use named footnotes: `[^label]` for a reference and `[^label]: …` for its
definition, where `label` is any string of letters, digits, `-`, or `_`
(`[^ahe]`, `[^kwon-2024]`, …). The label is just an identifier — **the displayed
number is assigned automatically by order of appearance on the page**, so you
never hand-number footnotes. Definitions live in the body; references may also
appear in **frontmatter** property values (e.g. inside `credits`). Frontmatter
renders above the body, so a footnote first cited in the frontmatter becomes `1`.
A footnote cited several times gets one `↩` backlink per citation, ordered by
appearance. (Plain numeric labels like `[^1]` still work — they're just labels,
and are renumbered like everything else.)

A footnote cited **only** in the frontmatter still works, as long as its
definition exists somewhere in the body. Definitions are usually written inside a
language section (`::: en` / `ko` / `ja`) so each language reads in its own words,
but a footnote defined in only one section still resolves in every language: when
the current language lacks a definition, the one from another section is used as a
fallback. (To share a single definition across all languages on purpose, put it
outside any `:::` fence.)

### Images & galleries

Put images in `public/` and reference them by relative path, e.g.
`![](images/sunset.jpg)` for `public/images/sunset.jpg`. The site's base path is
applied automatically.

A single image paragraph renders full-width. **Two or more consecutive image
paragraphs** are grouped into a horizontal-scroll **gallery** automatically (each
image's optional emphasis caption is kept). Separate the images with blank lines
so each is its own paragraph.

### Math

Inline `$a^2 + b^2 = c^2$` and display `$$ \int_0^1 x\,dx $$` math render with
[KaTeX](https://katex.org). A `$$…$$` block on its own line is promoted to
display mode automatically.

### Videos

A Markdown link to a YouTube URL (`[caption](https://youtu.be/ID)`) renders as an
embedded, responsive player. Any other link stays a normal link.

The home page intro lives in `src/content/home.md` (also supports `:::` fences).

## Deploy to GitHub Pages

1. Push to a GitHub repo (default branch `main`).
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and publishes on
   every push to `main`.

`vite.config.js` uses `base: './'`, so the site works under any Pages path
(`user.github.io/repo/`) without extra configuration.
