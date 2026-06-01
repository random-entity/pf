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
- `date` (or `created` / `year`) is used for sorting in the database.
- `tags` become clickable filters.

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
