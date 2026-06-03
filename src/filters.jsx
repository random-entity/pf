import { createContext, useContext, useMemo, useState } from 'react'
import { facetByPath } from './lib/properties.js'

// Sort-only facet for the (localized) title, which is the page heading and so
// is not part of the property schema.
export const TITLE_SORT = '__title__'

export const DEFAULT_SORT = facetByPath.has('releases')
  ? { path: 'releases', dir: 'desc' }
  : { path: TITLE_SORT, dir: 'asc' }

const Ctx = createContext(null)

// Holds the whole search/sort/filter selection. Lives above the router so it
// survives navigation and is reachable from both the sidebar and the artwork
// page's Properties block.
export function FilterProvider({ children }) {
  const [enums, setEnums] = useState({}) // path -> { ids: string[], mode: 'any'|'all' }
  const [ranges, setRanges] = useState({}) // path -> { min, max }
  const [showMissing, setShowMissing] = useState({}) // path -> true to INCLUDE items lacking the value
  const [sort, setSortState] = useState(DEFAULT_SORT) // { path, dir }
  const [group, setGroupState] = useState('none') // 'none' | facet path
  const [q, setQ] = useState('')       // main full-text search
  const [titleQ, setTitleQ] = useState('') // title-only search (Title accordion)
  const [expandPath, setExpandPath] = useState(null) // path to expand in FilterTree

  const toggleEnum = (path, id) =>
    setEnums((prev) => {
      const cur = prev[path] || { ids: [], mode: 'any' }
      const ids = cur.ids.includes(id) ? cur.ids.filter((x) => x !== id) : [...cur.ids, id]
      const next = { ...prev, [path]: { ...cur, ids } }
      if (ids.length === 0) delete next[path]
      return next
    })

  const setEnumMode = (path, mode) =>
    setEnums((prev) => {
      // Record the mode even before any value is picked, so toggling Any/All
      // first (then selecting values) behaves as expected. Entries with no ids
      // are ignored by filtering and don't count as active.
      const cur = prev[path] || { ids: [], mode: 'any' }
      return { ...prev, [path]: { ...cur, mode } }
    })

  const clearEnum = (path) =>
    setEnums((prev) => {
      const next = { ...prev }
      delete next[path]
      return next
    })

  const setRange = (path, min, max) =>
    setRanges((prev) => ({ ...prev, [path]: { min, max } }))

  const clearRange = (path) =>
    setRanges((prev) => {
      const next = { ...prev }
      delete next[path]
      return next
    })

  // Toggle whether items lacking a value for `path` are included when that key
  // is being filtered. Default (absent) is OFF — empties are excluded; setting
  // it true keeps them.
  const toggleMissing = (path) =>
    setShowMissing((prev) => {
      const next = { ...prev }
      if (next[path] === true) delete next[path]
      else next[path] = true
      return next
    })

  const setSort = (path, dir) => setSortState({ path, dir })

  const setGroup = (path) => setGroupState(path)

  const requestExpand = (path) => setExpandPath(path)
  const clearExpand = () => setExpandPath(null)

  const reset = () => {
    setEnums({})
    setRanges({})
    setShowMissing({})
    setSortState(DEFAULT_SORT)
    setGroupState('none')
    setQ('')
    setTitleQ('')
  }

  const activeCount = useMemo(
    () =>
      Object.values(enums).filter((e) => e.ids.length).length +
      Object.keys(ranges).length +
      Object.values(showMissing).filter((v) => v === true).length,
    [enums, ranges, showMissing],
  )

  const isDefaultSort = sort.path === DEFAULT_SORT.path && sort.dir === DEFAULT_SORT.dir
  const isAnyActive = q.trim() !== '' || titleQ.trim() !== '' || activeCount > 0 || !isDefaultSort || group !== 'none'

  const value = {
    enums,
    ranges,
    showMissing,
    sort,
    group,
    q,
    titleQ,
    expandPath,
    toggleEnum,
    setEnumMode,
    clearEnum,
    setRange,
    clearRange,
    toggleMissing,
    setSort,
    setGroup,
    setQ,
    setTitleQ,
    reset,
    requestExpand,
    clearExpand,
    activeCount,
    isDefaultSort,
    isAnyActive,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useFilters() {
  return useContext(Ctx)
}
