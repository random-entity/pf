import { createContext, useContext, useEffect, useState } from 'react'

export const LANGS = ['en', 'ko', 'ja']
export const LANG_LABELS = { en: 'EN', ko: '한국어', ja: '日本語' }

// UI strings. `props` holds localized labels for known frontmatter keys;
// unknown keys fall back to the raw key name.
const UI = {
  en: {
    siteTitle: 'Portfolio',
    files: 'Files',
    database: 'Database',
    search: 'Search…',
    sortBy: 'Sort by',
    groupBy: 'Group by',
    date: 'Date',
    title: 'Title',
    genre: 'Genre',
    tags: 'Tags',
    none: 'None',
    all: 'All',
    asc: 'Ascending',
    desc: 'Descending',
    reset: 'Reset filters',
    filters: 'Filters & sort',
    sortAsc: 'Sort ↑',
    sortDesc: 'Sort ↓',
    min: 'Min',
    max: 'Max',
    showWithoutKey: 'Show items without a value',
    filterByTags: 'Filter by tags',
    tagAny: 'Any',
    tagAll: 'All',
    noResults: 'No results.',
    noHeadings: 'No headings.',
    home: 'Home',
    notFound: 'Artwork not found.',
    menu: 'Menu',
    items: 'items',
    props: { title: 'Title', date: 'Date', events: 'Events', created: 'Created', genre: 'Genre', medium: 'Medium', dimensions: 'Dimensions', duration: 'Duration', edition: 'Edition', hardware: 'Hardware', tools: 'Tools', year: 'Year', tags: 'Tags', location: 'Location', status: 'Status' },
  },
  ko: {
    siteTitle: '포트폴리오',
    files: '파일',
    database: '데이터베이스',
    search: '검색…',
    sortBy: '정렬',
    groupBy: '그룹',
    date: '날짜',
    title: '제목',
    genre: '장르',
    tags: '태그',
    none: '없음',
    all: '전체',
    asc: '오름차순',
    desc: '내림차순',
    reset: '필터 초기화',
    filters: '필터 및 정렬',
    sortAsc: '정렬 ↑',
    sortDesc: '정렬 ↓',
    min: '최소',
    max: '최대',
    showWithoutKey: '값이 없는 항목 표시',
    filterByTags: '태그로 필터',
    tagAny: '하나라도',
    tagAll: '모두',
    noResults: '결과 없음.',
    noHeadings: '제목 없음.',
    home: '홈',
    notFound: '작품을 찾을 수 없습니다.',
    menu: '메뉴',
    items: '개',
    props: { title: '제목', date: '날짜', events: '이벤트', created: '제작일', genre: '장르', medium: '재료', dimensions: '크기', duration: '재생 시간', edition: '에디션', hardware: '하드웨어', tools: '도구', year: '연도', tags: '태그', location: '위치', status: '상태' },
  },
  ja: {
    siteTitle: 'ポートフォリオ',
    files: 'ファイル',
    database: 'データベース',
    search: '検索…',
    sortBy: '並び替え',
    groupBy: 'グループ',
    date: '日付',
    title: 'タイトル',
    genre: 'ジャンル',
    tags: 'タグ',
    none: 'なし',
    all: 'すべて',
    asc: '昇順',
    desc: '降順',
    reset: 'フィルターをリセット',
    filters: 'フィルターと並び替え',
    sortAsc: '並び替え ↑',
    sortDesc: '並び替え ↓',
    min: '最小',
    max: '最大',
    showWithoutKey: '値なしの項目を表示',
    filterByTags: 'タグで絞り込み',
    tagAny: 'いずれか',
    tagAll: 'すべて',
    noResults: '結果なし。',
    noHeadings: '見出しなし。',
    home: 'ホーム',
    notFound: '作品が見つかりません。',
    menu: 'メニュー',
    items: '件',
    props: { title: 'タイトル', date: '日付', events: 'イベント', created: '制作日', genre: 'ジャンル', medium: '素材', dimensions: 'サイズ', duration: '長さ', edition: 'エディション', hardware: 'ハードウェア', tools: 'ツール', year: '年', tags: 'タグ', location: '場所', status: 'ステータス' },
  },
}

const Ctx = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lang')
    if (LANGS.includes(saved)) return saved
    const nav = navigator.language?.slice(0, 2)
    return LANGS.includes(nav) ? nav : 'en'
  })

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = (key) => UI[lang][key] ?? UI.en[key] ?? key
  const propLabel = (key) => UI[lang].props[key] ?? UI.en.props[key] ?? key

  return <Ctx.Provider value={{ lang, setLang, t, propLabel }}>{children}</Ctx.Provider>
}

export function useLang() {
  return useContext(Ctx)
}

// Resolve a possibly-localized value to a string for the current language.
// Accepts plain strings/numbers or objects like { en, ko, ja }.
export function loc(value, lang) {
  if (value == null) return ''
  // Always return a string. For any object, prefer the current language, then
  // English, then the first scalar — so a malformed frontmatter value degrades
  // gracefully instead of crashing the render.
  if (typeof value === 'object' && !Array.isArray(value)) {
    const picked = value[lang] ?? value.en ?? Object.values(value).find((v) => v != null && typeof v !== 'object')
    return picked == null ? '' : String(picked)
  }
  return String(value)
}

export function isLocalized(obj) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return false
  const keys = Object.keys(obj)
  return keys.length > 0 && keys.every((k) => LANGS.includes(k))
}
