import { createContext, useContext, useMemo, useState } from 'react'
import { facetByPath } from './lib/properties.js'

// Sort-only facet for the (localized) title, which is the page heading and so
// is not part of the property schema.
export const TITLE_SORT = '__title__'

const DEFAULT_SORT = facetByPath.has('date')
  ? { path: 'date', dir: 'desc' }
  : { path: TITLE_SORT, dir: 'asc' }

const Ctx = createContext(null)

// Holds the whole search/sort/filter selection. Lives above the router so it
// survives navigation and is reachable from both the sidebar and the artwork
// page's Properties block.
export function FilterProvider({ children }) {
  const [enums, setEnums] = useState({}) // path -> { ids: string[], mode: 'any'|'all' }
  const [ranges, setRanges] = useState({}) // path -> { min, max }
  const [sort, setSortState] = useState(DEFAULT_SORT) // { path, dir }

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

  const setRange = (path, min, max) =>
    setRanges((prev) => ({ ...prev, [path]: { min, max } }))

  const clearRange = (path) =>
    setRanges((prev) => {
      const next = { ...prev }
      delete next[path]
      return next
    })

  const setSort = (path, dir) => setSortState({ path, dir })

  const reset = () => {
    setEnums({})
    setRanges({})
    setSortState(DEFAULT_SORT)
  }

  const activeCount = useMemo(
    () =>
      Object.values(enums).filter((e) => e.ids.length).length +
      Object.keys(ranges).length,
    [enums, ranges],
  )

  const value = {
    enums,
    ranges,
    sort,
    toggleEnum,
    setEnumMode,
    setRange,
    clearRange,
    setSort,
    reset,
    activeCount,
    isDefaultSort: sort.path === DEFAULT_SORT.path && sort.dir === DEFAULT_SORT.dir,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useFilters() {
  return useContext(Ctx)
}
