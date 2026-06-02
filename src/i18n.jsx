import { createContext, useContext, useEffect, useState } from 'react'

export const LANGS = ['en', 'ko', 'ja']
export const LANG_LABELS = { en: 'EN', ko: '한', ja: '日' }

// UI strings. `props` holds localized labels for known frontmatter keys;
// unknown keys fall back to the raw key name.
const UI = {
  en: {
    siteTitle: '∀∃portfolio',
    files: 'Files',
    database: 'Database',
    search: 'Search',
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
    filters: 'SORT/FILTER/GROUP',
    collapseAll: 'Collapse all',
    restoreState: 'Restore',
    resize: 'Resize sidebar',
    sort: 'Sort',
    group: 'Group',
    range: 'Range',
    filter: 'Filter',
    searchLabel: 'Search',
    collapse: 'Collapse',
    expand: 'Expand',
    resetShort: 'Reset',
    showLess: 'Show less',
    more: 'more',
    sortAsc: 'Sort ↑',
    sortDesc: 'Sort ↓',
	sortByDate: "Sort by date",
	sortByDateAsc: "Sort by date ↑",
	sortByDateDesc: "Sort by date ↓",
    min: 'Min',
    max: 'Max',
    showWithoutKey: 'Show items without a value',
    markSort: 'Sorted by this key',
    markRange: 'Range filter active',
    markMulti: 'Multi-select filter active',
    markMissing: 'Including items without a value',
    filterByTags: 'Filter by tags',
    tagAny: 'OR',
    tagAll: 'AND',
    clear: 'Clear',
    allExclusive: 'These values never occur together — “AND” would match nothing',
    noResults: 'No results.',
    noHeadings: 'No headings.',
    home: 'Home',
    notFound: 'Artwork not found.',
    menu: 'Menu',
    items: 'items',
    props: { title: 'Title', tagline: 'Tagline', date: 'Releases', releases: 'Releases', events: 'Events', type: 'Type', created: 'Created', genre: 'Genre', medium: 'Medium', dimensions: 'Dimensions', duration: 'Duration', edition: 'Edition', hardware: 'Hardware', tools: 'Tools', tech: 'Tech', source: 'Source', year: 'Year', tags: 'Tags', location: 'Location', status: 'Status' },
  },
  ko: {
    siteTitle: '포트폴리오',
    files: '파일',
    database: '데이터베이스',
    search: '검색',
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
    filters: '정렬 및 필터',
    collapseAll: '모두 접기',
    restoreState: '복원',
    resize: '사이드바 크기 조절',
    sort: '정렬',
    group: '그룹',
    range: '범위',
    filter: '필터',
    searchLabel: '검색',
    collapse: '접기',
    expand: '펼치기',
    resetShort: '초기화',
    showLess: '접기',
    more: '개 더',
    sortAsc: '정렬 ↑',
    sortDesc: '정렬 ↓',
	sortByDate: "날짜 정렬",
	sortByDateAsc: "날짜 정렬 ↑",
	sortByDateDesc: "날짜 정렬 ↓",
    min: '최소',
    max: '최대',
    showWithoutKey: '값이 없는 항목 표시',
    markSort: '이 항목으로 정렬됨',
    markRange: '범위 필터 적용 중',
    markMulti: '다중 선택 필터 적용 중',
    markMissing: '값 없는 항목 포함',
    filterByTags: '태그로 필터',
    tagAny: 'OR',
    tagAll: 'AND',
    clear: '지우기',
    allExclusive: '이 값들은 함께 나타나지 않습니다 — “AND”는 결과가 없습니다',
    noResults: '결과 없음.',
    noHeadings: '제목 없음.',
    home: '홈',
    notFound: '작품을 찾을 수 없습니다.',
    menu: '메뉴',
    items: '개',
    props: { title: '제목', tagline: '태그라인', date: '릴리스', releases: '릴리스', events: '이벤트', type: '유형', created: '제작일', genre: '장르', medium: '재료', dimensions: '크기', duration: '재생 시간', edition: '에디션', hardware: '하드웨어', tools: '도구', tech: '기술', source: '소스', year: '연도', tags: '태그', location: '위치', status: '상태' },
  },
  ja: {
    siteTitle: 'ポートフォリオ',
    files: 'ファイル',
    database: 'データベース',
    search: '検索',
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
    filters: '並び替え・フィルター',
    collapseAll: 'すべて折りたたむ',
    restoreState: '復元',
    resize: 'サイドバーの幅を調整',
    sort: '並べ替え',
    group: 'グループ',
    range: '範囲',
    filter: 'フィルター',
    searchLabel: '検索',
    collapse: '折りたたむ',
    expand: '展開',
    resetShort: 'リセット',
    showLess: '折りたたむ',
    more: '件以上',
    sortAsc: '並び替え ↑',
    sortDesc: '並び替え ↓',
	sortByDate: "日付並び替え ↓",
	sortByDateAsc: "日付並び替え ↑",
	sortByDateDesc: "日付並び替え ↓",
    min: '最小',
    max: '最大',
    showWithoutKey: '値なしの項目を表示',
    markSort: 'この項目で並び替え中',
    markRange: '範囲フィルター適用中',
    markMulti: '複数選択フィルター適用中',
    markMissing: '値なしの項目を含む',
    filterByTags: 'タグで絞り込み',
    tagAny: 'OR',
    tagAll: 'AND',
    clear: 'クリア',
    allExclusive: 'これらの値は同時に存在しません — 「AND」は該当なしになります',
    noResults: '結果なし。',
    noHeadings: '見出しなし。',
    home: 'ホーム',
    notFound: '作品が見つかりません。',
    menu: 'メニュー',
    items: '件',
    props: { title: 'タイトル', tagline: 'タグライン', date: 'リリース', releases: 'リリース', events: 'イベント', type: 'タイプ', created: '制作日', genre: 'ジャンル', medium: '素材', dimensions: 'サイズ', duration: '長さ', edition: 'エディション', hardware: 'ハードウェア', tools: 'ツール', tech: '技術', source: 'ソース', year: '年', tags: 'タグ', location: '場所', status: 'ステータス' },
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
    document.title = '∀∃'
  }, [lang])

  const t = (key) => {
    if (key === 'siteTitle') return '∀∃portfolio'
    if (key === 'filters') return 'SORT/FILTER/GROUP'
    return UI[lang][key] ?? UI.en[key] ?? key
  }
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
