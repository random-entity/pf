// ---------------------------------------------------------------------------
// Property schema — the single source of truth for how each frontmatter
// property behaves. This REPLACES the old dynamic classification (which guessed
// a property's role from the shape/frequency of its values across works).
//
// Each entry maps a property PATH to a config object:
//
//   { type, label?, unit? }
//
// `type` is one of:
//   text     → inline markdown (links/bold/footnotes); searchable; no facet
//   enum     → filter pill(s); filter + group facet
//   date     → formatted date / "start → end"; sort + range-filter facet
//   number   → number (+ optional `unit`); sort + range-filter facet
//   duration → HH:MM:SS; sort + range-filter facet
//   group    → a container object; render/recurse into children, never a facet
//
// `label` (root keys, and any key whose label should be localized) holds the
// editable en/ko/ja display label. Without a label the key name is used.
// `unit` (number type) is appended to the rendered value (e.g. "m").
//
// PATHS:
//   - Root keys use the bare key, e.g. `tags`.
//   - Nested keys use a dotted path, e.g. `releases.event`. Array traversal is
//     implicit: `releases` is an array of objects, so `releases.event` means
//     "the event field of each release".
//
// Any path NOT listed here defaults to `text` (covers dynamic nested keys such
// as credit roles). Raw YAML Date values always render formatted regardless of
// the declared type.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Canonical display orders — edit these to reorder the UI.
// ---------------------------------------------------------------------------

// Order of paths shown in the sidebar filter/sort/group tree.
// 'title' refers to the synthetic Title row (TITLE_SORT = '__title__').
// Paths absent from this list appear after all listed paths, alphabetically.
export const FACET_ORDER = [
  'type',
  'title',
  'releases.date',
  'genre',
  'tags',
  'tools',
  'releases.event',
  'releases.venue',
]

// Order of root keys shown in the frontmatter properties block.
// Keys absent from this list appear after all listed keys, alphabetically.
export const FRONTMATTER_ORDER = [
  'tagline',
  'format',
  'type',
  'genre',
  'tags',
  'tools',
  'releases',
  'credits',
  'source',
];

export const PROPERTY_SCHEMA = {
  // title is the page heading; it is excluded from the Properties block and its
  // sort is handled by the synthetic TITLE_SORT facet. Listed here only so its
  // localized label is available to the sidebar's Title row.
  title: { type: 'text', label: { en: 'Title', ko: '제목', ja: 'タイトル' } },

  tagline: { type: 'text', label: { en: 'Tagline', ko: '태그라인', ja: 'タグライン' } },
  format: { type: 'text', label: { en: 'Format', ko: '형식', ja: '形式' } },

  type: { type: 'enum', label: { en: 'Type', ko: '구분', ja: '区分' } },
  genre: { type: 'enum', label: { en: 'Genre', ko: '장르', ja: 'ジャンル' } },
  tags: { type: 'enum', label: { en: 'Tags', ko: '태그', ja: 'タグ' } },
  tools: { type: 'enum', label: { en: 'Tools', ko: '도구', ja: 'ツール' } },

  source: { type: 'text', label: { en: 'Source', ko: '소스', ja: 'ソース' } },

  // Credits are a localized object of role → name(s); roles are arbitrary, so
  // the inner values fall through to the `text` default.
  credits: { type: 'group', label: { en: 'Credits', ko: '크레딧', ja: 'クレジット' } },
  credit: { type: 'group', label: { en: 'Credits', ko: '크레딧', ja: 'クレジット' } },

  // Releases: a list of objects. The event is a filterable enum, the date is a
  // sortable/range-filterable date, and venue/version are plain text.
  releases: { type: 'group', label: { en: 'Releases', ko: '릴리스', ja: 'リリース' } },
  'releases.event': { type: 'enum', label: { en: 'Event', ko: '이벤트', ja: 'イベント' } },
  'releases.date': { type: 'date', label: { en: 'Date', ko: '날짜', ja: '日付' } },
  'releases.venue': { type: 'enum', label: { en: 'Venue', ko: '장소', ja: '会場' } },
  'releases.version': { type: 'text', label: { en: 'Version', ko: '버전', ja: 'バージョン' } },

  // ---- Aspirational keys (not yet used by content) kept as a template. -----
  created: { type: 'date', label: { en: 'Created', ko: '제작일', ja: '制作日' } },
  year: { type: 'number', label: { en: 'Year', ko: '연도', ja: '年' } },
  duration: { type: 'duration', label: { en: 'Duration', ko: '재생 시간', ja: '長さ' } },
  dimensions: { type: 'group', label: { en: 'Dimensions', ko: '크기', ja: 'サイズ' } },
  'dimensions.width': { type: 'number', unit: 'm', label: { en: 'Width', ko: '너비', ja: '幅' } },
  'dimensions.height': { type: 'number', unit: 'm', label: { en: 'Height', ko: '높이', ja: '高さ' } },
  'dimensions.depth': { type: 'number', unit: 'm', label: { en: 'Depth', ko: '깊이', ja: '奥行き' } },
  medium: { type: 'enum', label: { en: 'Medium', ko: '재료', ja: '素材' } },
  edition: { type: 'text', label: { en: 'Edition', ko: '에디션', ja: 'エディション' } },
  hardware: { type: 'enum', label: { en: 'Hardware', ko: '하드웨어', ja: 'ハードウェア' } },
  tech: { type: 'enum', label: { en: 'Tech', ko: '기술', ja: '技術' } },
  location: { type: 'enum', label: { en: 'Location', ko: '위치', ja: '場所' } },
  status: { type: 'enum', label: { en: 'Status', ko: '상태', ja: 'ステータス' } },
}

// Title-case the final segment of a dotted path as a fallback label.
function lastSegmentTitleCased(path) {
  const seg = String(path).split('.').pop() || ''
  return seg.charAt(0).toUpperCase() + seg.slice(1)
}

// The declared type for a path, defaulting to `text` for anything unlisted.
export function typeForPath(path) {
  return PROPERTY_SCHEMA[path]?.type ?? 'text'
}

// The localized display label for a path, falling back to the title-cased key.
export function labelForPath(path, lang) {
  const l = PROPERTY_SCHEMA[path]?.label
  return (l && (l[lang] ?? l.en)) ?? lastSegmentTitleCased(path)
}
