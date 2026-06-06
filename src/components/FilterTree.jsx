import { useEffect } from 'react'
import { useLang } from '../i18n.jsx'
import { works } from '../lib/content.js'
import { labelOf, formatDuration, formatDate, valuesCanCoexist, unitForPath } from '../lib/properties.js'
import { useFilters, TITLE_SORT, DEFAULT_SORT } from '../filters.jsx'

// Min/max dropdowns for a numeric/date facet.
function RangeSelect({ facet }) {
  const { t } = useLang()
  const { ranges, setRange, clearRange } = useFilters()
  const unit = unitForPath(facet.path)
  const fmt = (n) =>
    facet.isDuration ? formatDuration(n) : facet.isDate ? formatDate(n) : unit ? `${n} ${unit}` : String(n)
  const active = !!ranges[facet.path]
  const cur = ranges[facet.path] || { min: facet.min, max: facet.max }

  function commit(min, max) {
    if (min === facet.min && max === facet.max) clearRange(facet.path)
    else setRange(facet.path, min, max)
  }

  return (
    <div className="range-row">
      <label>{t('min')}</label>
      <select value={cur.min} onChange={(e) => {
        const min = Number(e.target.value)
        // New min > current max → reset max to absolute maximum
        commit(min, min > cur.max ? facet.max : cur.max)
      }}>
        {facet.minOptions.map((o) => <option key={o} value={o}>{fmt(o)}</option>)}
      </select>
      <label>{t('max')}</label>
      <select value={cur.max} onChange={(e) => {
        const max = Number(e.target.value)
        // New max < current min → reset min to absolute minimum
        commit(max < cur.min ? facet.min : cur.min, max)
      }}>
        {facet.maxOptions.map((o) => <option key={o} value={o}>{fmt(o)}</option>)}
      </select>
    </div>
  )
}

// "Show items without a value" toggle.
function MissingToggle({ path }) {
  const { t } = useLang()
  const { showMissing, toggleMissing } = useFilters()
  const checked = showMissing[path] === true
  return (
    <button className="missing-toggle" aria-pressed={checked} onClick={() => toggleMissing(path)}>
      <span className="box">{checked ? '☑' : '☐'}</span> {t('showWithoutKey')}
    </button>
  )
}

// OR/AND multi-select enum pills.
function EnumFilter({ facet }) {
  const { lang, t } = useLang()
  const { enums, toggleEnum, setEnumMode } = useFilters()
  const sel = enums[facet.path] || { ids: [], mode: 'any' }
  const andMeaningless = !valuesCanCoexist(works, facet.path, sel.ids)

  return (
    <div>
      <div className="tagmode-row">
        <div className="tagmode" role="radiogroup" aria-label={facet.path}>
          <button className="radio" role="radio" aria-checked={sel.mode === 'any'} onClick={() => setEnumMode(facet.path, 'any')}>
            <span className="dot">{sel.mode === 'any' ? '◉' : '○'}</span> {t('tagAny')}
          </button>
          <button
            className={`radio${andMeaningless ? ' struck' : ''}`}
            role="radio"
            aria-checked={sel.mode === 'all'}
            title={andMeaningless ? t('allExclusive') : undefined}
            onClick={() => setEnumMode(facet.path, 'all')}
          >
            <span className="dot">{sel.mode === 'all' ? '◉' : '○'}</span> {t('tagAll')}
          </button>
        </div>
      </div>
      <div className="tagfilter">
        {facet.values.map((v) => (
          <button
            key={v.id}
            className="tag"
            aria-pressed={sel.ids.includes(v.id)}
            onClick={() => toggleEnum(facet.path, v.id)}
          >
            {labelOf(v.raw, lang)}
          </button>
        ))}
      </div>
    </div>
  )
}

// Title-specific fuzzy search input (rendered inside the Title accordion).
function TitleSearch() {
  const { t } = useLang()
  const { titleQ, setTitleQ } = useFilters()
  return (
    <input
      type="search"
      className="title-search-input"
      placeholder={t('search')}
      value={titleQ}
      onChange={(e) => setTitleQ(e.target.value)}
      aria-label={t('search')}
    />
  )
}

// --- Icon buttons ---------------------------------------------------------

function SortIcon({ path }) {
  const { t } = useLang()
  const { sort, setSort } = useFilters()
  const state = sort.path === path ? sort.dir : null
  const isDefaultPath = path === DEFAULT_SORT.path

  const handleClick = (e) => {
    e.stopPropagation()
    if (state === null) setSort(path, 'asc')
    else if (state === 'asc') setSort(path, 'desc')
    else if (isDefaultPath) setSort(TITLE_SORT, 'asc')
    else setSort(DEFAULT_SORT.path, DEFAULT_SORT.dir)
  }

  const label = state === 'asc' ? t('sortAsc') : state === 'desc' ? t('sortDesc') : t('sort')

  return (
    <button
      className={`facet-icon sort-icon${state ? ' icon-on' : ''}`}
      onClick={handleClick}
      aria-label={label}
    >
      {label}
    </button>
  )
}

// "Search" icon on the Title row — opens accordion to show title search input.
function TitleSearchIcon({ path, onToggle, openPaths }) {
  const { t } = useLang()
  const { titleQ } = useFilters()
  const active = titleQ.trim() !== ''
  return (
    <button
      className={`facet-icon title-search-icon${active ? ' icon-on' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (!openPaths.has(path)) onToggle(path) }}
      aria-label={t('search')}
    >
      {t('search')}
    </button>
  )
}

function GroupIcon({ path }) {
  const { t } = useLang()
  const { group, setGroup } = useFilters()
  const active = group === path
  return (
    <button
      className={`facet-icon group-icon${active ? ' icon-on' : ' icon-off'}`}
      aria-pressed={active}
      onClick={(e) => { e.stopPropagation(); setGroup(active ? 'none' : path) }}
    >
      {t('group')}
    </button>
  )
}

function EnumIcon({ path, onToggle }) {
  const { t } = useLang()
  const { enums, ranges, clearEnum } = useFilters()
  const active = (enums[path]?.ids.length ?? 0) > 0 || !!ranges[path]
  return (
    <button
      className={`facet-icon enum-icon${active ? ' icon-on' : ' icon-off'}`}
      onClick={(e) => { e.stopPropagation(); active ? clearEnum(path) : onToggle(path) }}
    >
      {t('filter')}
    </button>
  )
}

// Filter icon for range (date/number/duration) facets — opens the accordion to
// show the min/max selectors; goes icon-on when a range filter is active.
function RangeIcon({ path, onToggle }) {
  const { t } = useLang()
  const { ranges, clearRange } = useFilters()
  const active = !!ranges[path]
  return (
    <button
      className={`facet-icon range-icon${active ? ' icon-on' : ' icon-off'}`}
      onClick={(e) => { e.stopPropagation(); active ? clearRange(path) : onToggle(path) }}
    >
      {t('filter')}
    </button>
  )
}

// --- FacetNode ------------------------------------------------------------

function FacetNode({ facet, openPaths, onToggle }) {
  const { propLabel } = useLang()
  const open = openPaths.has(facet.path)

  const isTitleRow = facet.path === TITLE_SORT
  const label = isTitleRow ? propLabel('title') : propLabel(facet.path)

  const sortable = isTitleRow || facet.kind === 'date' || facet.kind === 'number' || facet.kind === 'duration'
  const isRange = facet.kind === 'date' || facet.kind === 'number' || facet.kind === 'duration'
  const isEnum = facet.kind === 'enum'
  // Date facets are groupable (groups by year). Enum facets group by value.
  const isGroupable = isEnum || facet.kind === 'date'
  const hasMissing = facet.kind !== 'nested' && facet.kind !== 'text'

  return (
    <li className="filter-node">
      <div className="facet-head">
        <button className="facet-expand" aria-expanded={open} onClick={() => onToggle(facet.path)}>
          <span className="caret">{open ? '▾' : '▸'}</span>
          <span className="facet-label">{label}</span>
        </button>
        <div className="facet-icons">
          {sortable && <SortIcon path={facet.path} />}
          {isTitleRow && <TitleSearchIcon path={facet.path} onToggle={onToggle} openPaths={openPaths} />}
          {isRange && <RangeIcon path={facet.path} onToggle={onToggle} />}
          {isEnum && <EnumIcon path={facet.path} onToggle={onToggle} />}
          {isGroupable && <GroupIcon path={facet.path} />}
        </div>
      </div>
      {open && (
        <div className="facet-body">
          {facet.kind === 'nested' && <FacetTree facets={facet.children} openPaths={openPaths} onToggle={onToggle} />}
          {isTitleRow && <TitleSearch />}
          {isRange && <RangeSelect facet={facet} />}
          {isEnum && <EnumFilter facet={facet} />}
          {hasMissing && <MissingToggle path={facet.path} />}
        </div>
      )}
    </li>
  )
}

function FacetTree({ facets, openPaths, onToggle }) {
  return (
    <ul className="filter-tree">
      {facets.map((fac) => (
        <FacetNode key={fac.path} facet={fac} openPaths={openPaths} onToggle={onToggle} />
      ))}
    </ul>
  )
}

// openPaths and setOpenPaths are lifted to DatabaseBrowser so the sticky header
// (search + filters-title) can read anyOpen and call collapseOrRevert.
// allFacets is also pre-computed there since collapseOrRevert needs allPaths.
export default function FilterTree({ allFacets, openPaths, setOpenPaths }) {
  const { expandPath, clearExpand } = useFilters()

  useEffect(() => {
    if (!expandPath) return
    // Expand the target path and any ancestor paths (for nested facets).
    const parts = expandPath.split('.')
    const pathsToOpen = parts.map((_, i) => parts.slice(0, i + 1).join('.'))
    setOpenPaths((s) => {
      const next = new Set(s)
      for (const p of pathsToOpen) next.add(p)
      return next
    })
    clearExpand()
  }, [expandPath, clearExpand, setOpenPaths])

  const toggle = (path) =>
    setOpenPaths((s) => {
      const next = new Set(s)
      next.has(path) ? next.delete(path) : next.add(path)
      return next
    })

  return (
    <div className="filters">
      <FacetTree facets={allFacets} openPaths={openPaths} onToggle={toggle} />
    </div>
  )
}
