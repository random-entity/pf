# Artist Portfolio

A minimal, Obsidian-like portfolio site. React + Vite, deployable to GitHub
Pages. Content is plain Markdown with YAML frontmatter — no CMS, no database.

## Features

- **Minimal, monochrome UI** with automatic light/dark mode. No ornamentation.
- **Three languages** (English / 한국어 / 日本語) via an always-visible switcher.
- **Schema-driven sidebar**: each property's behavior is declared in one config
  file (`src/lib/schema.js`) — `date`/`number` get sort + range, `enum` gets
  OR/AND multi-select, `group` expands into nested facets, `text` is search-only.
  Plus a search box, group-by, and a resizable panel.
- **Properties block** (like Obsidian) rendered from frontmatter, supporting
  scalars, localized values, lists, nested objects, and inline markdown (links,
  wikilinks, bold, etc.). Enum values are clickable filter pills that expand the
  corresponding sidebar accordion without navigating away.
- **Markdown** with GFM, footnotes, `[[wikilinks]]`, math (KaTeX), image
  galleries, embedded YouTube (with optional captions), collapsible
  headings/lists, and a heading outline that deep-links into each work. While
  reading a work, a pinned overlay shows the **current nested heading path** so
  you always know where you are.
- **Sticky sidebar stacking**: as you scroll the filter tree, each sort/filter/
  group **Key row** above your position stays stacked at the top (the same idea as
  the article's heading path). Clicking a stacked row — or its Filter button —
  scrolls back to that row's section and opens it.

> Changing the code? See [ARCHITECTURE.md](ARCHITECTURE.md) for how content is
> loaded, how the property schema (`src/lib/schema.js`) drives the filter/sort
> tree and rendering, and how the pieces fit together.

## Develop

```sh
npm install
npm run dev
```

Requires [Node.js](https://nodejs.org) (LTS / v20+). Open the printed local URL.

`npm run build` produces the static site in `dist/`; `npm run preview` serves
that build locally. These are the only three scripts (`dev` / `build` /
`preview`), all thin wrappers over Vite.

## Add or edit a work

A **work** is anything in the portfolio — an artwork, a module, a toy, and so on.
What kind it is comes from its `type` frontmatter property, **not** from where the
file lives. Create a Markdown file anywhere under `src/content/` (every `*.md`
below it is loaded, at any depth):

- `src/content/personal-works/`, `src/content/group-works/`,
  `src/content/modules/`, `src/content/toys/`, … — these subfolders are just a
  loose authoring convenience; add or rename them freely.

The folder path becomes the slug used by `[[wikilinks]]` and the URL, so the file
name (minus `.md`) should be unique. (`src/content/home.md` is the site intro,
not a work, and is the one file excluded from the glob.)

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

- Any key is shown in the Properties block. Each key's **type** and translated
  **label** are declared in `src/lib/schema.js` (`PROPERTY_SCHEMA`); keys not
  listed there default to plain `text` and show the title-cased key name. Add a
  property's type/label there — not in `src/i18n.jsx`.
- A value may be a plain string/number, a **localized object** `{ en, ko, ja }`,
  a **list** `[a, b]`, or a **nested object** `{ k: v }` — all render automatically.
- **All string values** support inline markdown — this applies uniformly to every
  scalar anywhere in frontmatter (plain strings, localized object values, array
  items, nested object values, and release sub-fields like `venue` and `version`):
  - `[text](url)` → clickable link (external opens in a new tab)
  - `[text](url1)(url2)` → plain text with one `↗` icon per URL (multi-link)
  - `[[wikilink]]` → link to another work by slug
  - `**bold**`, `_italic_`, `` `code` `` → inline formatting
  - On **enum pills**, the link text becomes the pill label and a `↗` icon is
    appended after a separator; multi-link values add one `↗` per URL.
  - **Footnote refs** `[^label]` also work inside an enum value (e.g.
    `event: "Forum IMPACT[^liege]"`): the marker is lifted out of the label and
    shown as a numbered superscript on the right of the pill, sharing the same
    appearance-order numbering and return-link as body footnotes.
  - **Wikilinks** `[[target]]` / `[[target|alias]]` also work inside an enum value
    (e.g. `event: "[[liege-2024]]"`): the visible text is rendered as the label,
    and a **page icon** linking to that work is appended right after the label,
    *before* any footnote or `↗` icons: `[ label | 🗎 | ¹ | ↗ ]`. The label text is
    the `alias` if you give one (`[[target|alias]]`); otherwise the referenced
    page's **title** (in the current language, falling back en → ko → ja); and if
    the target doesn't resolve, the raw target (filename) — shown with a muted,
    inert icon.
  - Footnote markers (and the page-icon, not the wikilink's text) are kept out of
    the sidebar filter pills; the value's filter/group identity is the label text.
- `title` is used as the page heading (shown in the topbar) and is not repeated
  in the block, but it behaves like any other value: footnote refs `[^label]` in
  the title render as a superscript on the topbar title (numbered first, since the
  title comes before everything else) and join the page's footnote list.
- **Quote all string values inside inline `{ ... }` objects and `[ ... ]`
  arrays.** This keeps frontmatter consistent and avoids YAML treating commas,
  colons, brackets, or quote marks as syntax. For example:
  `{ en: "Harbour, Fog" }`, `tags: ["Interactive CG", "Video feedback"]`.
- Plain top-level string values like `type: Personal work` may stay unquoted
  unless they contain `:`, `,`, brackets, or quote marks.
- `releases` is a list of objects. Its sub-fields are typed in the schema:
  `releases.event` and `releases.venue` are **enums** (sort/group/filter pills),
  `releases.date` is a **date** (sort + range; the default sort), and
  `releases.version` is **text**. Each entry needs at least a `date`:

  ```yaml
  releases:
    - event: "Premiere online"
      date: "2024-08-31"
    - event: "Seoul Performing Arts Festival (SPAF)"
      date: "2024-11-01 ~ 2024-11-05"
      venue: "Arko Arts Theater"
      version: "v2"
  ```

  The `event` field may be a plain string or a localized object `{ en, ko, ja }`:

  ```yaml
  releases:
    - date: "2024-11-01 ~ 2024-11-05"
      event: { en: "SPAF", ko: "서울국제공연예술제", ja: "ソウル国際公演芸術祭" }
      venue: "Arko Arts Theater"
  ```

  The Properties block renders each release as a small grid (Event pill,
  formatted Date / `start → end`, Venue/Version text); all string sub-fields
  support inline markdown. In the Releases **Date** range filter, **Min** lists
  all start dates and **Max** all end dates; the match is an inclusive overlap.
  (The legacy `{ "Event name": "YYYY-MM-DD" }` single-key shape is no longer
  supported — use the `{ event, date }` object form.)

- Enum properties (`tags`, `tools`, `genre`, `type`, … — whatever is typed
  `enum` in the schema) become clickable filters with **OR / AND** modes. An
  enum value may be a single value or a **list** (e.g. two genres) — AND becomes
  meaningful once values co-occur.
- A `{ hours, minutes, seconds }` object under a `duration`-typed key is shown as
  a single `HH:MM:SS` value (sorted/ranged as one number).
- **Wildcard dates.** A `date` value may mask a **trailing run of digits** with
  `x`/`X` when only part of the date is known — across the year, month, and day:
  `2022-XX-XX` (some day in 2022), `2022-06-XX` (some day in June 2022), or even a
  partial year like `205x-XX-XX` (some day in the 2050s) or `20XX-XX-XX` (the 21st
  century). It renders masked as `205?-??-??`, but for sorting/filtering it
  expands to the full span it could represent (`205x-XX-XX` → `2050-01-01 …
  2059-12-31`), sorting by its earliest possible date and contributing both
  bounds to the range filter's Min/Max lists. Wildcards must form a trailing run
  — a masked digit followed by a concrete one (`2022-XX-06`, `20x4-XX-XX`) is
  rejected and falls back to plain text.

### Forcing display order

Two arrays in `src/lib/schema.js` set the display order — edit them to reorder:

- `FACET_ORDER` — the order of rows in the sidebar filter/sort/group tree
  (`'title'` is the synthetic Title row).
- `FRONTMATTER_ORDER` — the order of rows in the Properties block.

Any path not listed appears after the listed ones, alphabetically.

### Filtering, sorting & search

The sidebar builds a **filter/sort tree** from the property schema
(`src/lib/schema.js`) — each property's controls follow its declared `type`:

- **`date` / `number` / `duration`** (incl. nested ones like `releases.date`)
  get an ascending/descending **sort** and a **min/max range** selector. Sorting
  is single-key: picking a sort replaces the previous one.
- **`enum`** (`tags`, `tools`, `genre`, `type`, …) gets a multi-select filter
  with an **Any / All** (OR / AND) toggle, whether the value is a single value or
  a list.
- **`group`** (`releases`) expands into its typed sub-facets.
- **`text`** is search-only — never a facet.

**Sorting only orders items — it never hides them.** A work that lacks the
sort value (e.g. one with no `releases.date` under the default newest-first sort)
simply sinks to the bottom of the list, so every work stays visible by
default.

Each key has a **"Show items without a value"** toggle (off by default). When a
key is **filtered** — ranged or multi-selected — works lacking that value are
dropped unless this is checked; checking it keeps them and shows an `∅` marker.

The **search box** does a case-insensitive substring match across titles (all
languages), enum values, **all frontmatter property text** (including values
nested inside localized objects such as `credits`, and the role/field labels
themselves), and body text — in every language. Body and property matches surface
as inline snippets with the matched text highlighted; clicking a snippet jumps to
that exact occurrence in the article (or Properties block) and highlights it. The
highlight persists until you click an empty area of the page. Each enum value pill
in a Properties block is also clickable: it toggles the filter for that value and
expands the relevant sidebar accordion.

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

`[[slug]]` or `[[slug|Custom label]]` links to another work — in body text,
frontmatter values, and enum pills alike. Targets resolve by slug, trailing path
segment, or file basename. The link text is the `Custom label` if you give one;
otherwise the **referenced page's title** (in the current language, falling back
en → ko → ja); an unresolved target renders as plain text (its raw target). The
resolved title is what search matches, so you can find a page by the title of
another work that links to it.

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

#### Global footnotes / glossary

Footnotes are resolved **local-first, then from a shared glossary** at
`glossary/glossary.md`. There's no special syntax — a normal `[^label]` reference
that the current page doesn't define automatically falls back to the glossary, so
you can write a definition once and reuse it across many works:

```markdown
Each agent is a boid[^boids] following local rules.
```

- Resolution order: (1) a page-local `[^label]:` definition wins, so a page can
  **override** a shared term just by defining it; (2) otherwise the glossary
  definition; (3) otherwise the reference is left unresolved.
- A glossary-resolved footnote renders, numbers, and lists **exactly like a local
  one** (merged into the same per-page footnotes list, frontmatter-first order),
  and works in frontmatter values too (e.g. `tagline: "…boids[^boids]"`).
- The glossary file is authored just like page footnotes — `[^label]: text`
  definitions with the same `::: en|ko|ja` fences (a definition outside any fence
  is shared across languages; missing languages fall back to English). Markdown
  links, `[[wikilinks]]`, and emphasis all work in glossary definitions.

#### URL map (reference links)

A link target that starts with `^` is a **URL reference** — the real URL is
looked up by label, **local-first then from the glossary**, just like footnotes.
It's handy for URLs reused across works (project repo, an artist's site, …):

```markdown
The code lives [on GitHub](^repo), and see the [boids page](^wiki-boids).

(^repo): https://github.com/you/your-project
```

- Define a URL on its own line at the bottom of the page: `(^label): https://…`.
  Resolution is local-first: a page-local `(^label):` wins; otherwise the shared
  `glossary/glossary.md` is used; an unresolved label leaves a (visibly broken)
  link.
- Unlike a footnote, a URL ref shows **no marker and no list entry** — it simply
  turns `[text]` into a normal external link.
- It composes with the multi-link syntax: `[text](^a)(^b)` (and mixes with real
  URLs, e.g. `[text](^a)(https://…)`) produce one `↗` per resolved URL.
- Works in frontmatter string values too (e.g. `source: "[repo](^repo)"`).
- Definitions may live inside `::: en|ko|ja` fences for language-specific URLs;
  one outside any fence is shared across languages.

### Images & galleries

Put images in `public/` and reference them by relative path, e.g.
`![](images/sunset.jpg)` for `public/images/sunset.jpg`. The site's base path is
applied automatically.

A single image paragraph renders full-width. **Two or more consecutive image
paragraphs** are grouped into a horizontal-scroll **gallery** automatically (each
image's optional emphasis caption is kept). Separate the images with blank lines
so each is its own paragraph.

**Lead ("hero") images.** Any image that appears **before the first heading** in
the body is hoisted to render **above the Properties table**, so a work can open
with a banner image followed by its frontmatter. (If a file has no heading at all
there is no boundary, so nothing is hoisted.) This works even when the image sits
inside a `::: lang` fence.

### Math

Inline `$a^2 + b^2 = c^2$` and display `$$ \int_0^1 x\,dx $$` math render with
[KaTeX](https://katex.org). A `$$…$$` block on its own line is promoted to
display mode automatically.

### Videos

A Markdown link to a YouTube URL (`[caption](https://youtu.be/ID)`) renders as an
embedded, responsive player. Any other link stays a normal link.

To show a **caption** beneath a video, put an emphasis line **directly under** the
video link (no blank line between them), exactly like an image caption:

```
[Video](https://youtu.be/ID)
*A short caption*
```

The home page intro lives in `src/content/home.md` (also supports `:::` fences).

## Deploy to GitHub Pages

1. Push to a GitHub repo (default branch `main`).
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and publishes on
   every push to `main`.

`vite.config.js` uses `base: './'`, so the site works under any Pages path
(`user.github.io/repo/`) without extra configuration.
