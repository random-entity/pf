import { useRef, useState } from 'react'
import { useLang } from '../i18n.jsx'
import { artworks } from '../lib/content.js'
import { labelOf, formatDuration, formatDate, valuesCanCoexist, unitForPath, EVENTS_PATH } from '../lib/properties.js'
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

  function update(min, max) {
    if (min > max) [min, max] = [max, min]
    if (min === facet.min && max === facet.max) clearRange(facet.path)
    else setRange(facet.path, min, max)
  }

  return (
    <div className="range-row">
      <label>{t('min')}</label>
      <select value={cur.min} onChange={(e) => update(Number(e.target.value), cur.max)}>
        {facet.minOptions.map((o) => (
          <option key={o} value={o}>{fmt(o)}</option>
        ))}
      </select>
      <label>{t('max')}</label>
      <select value={cur.max} onChange={(e) => update(cur.min, Number(e.target.value))}>
        {facet.maxOptions.map((o) => (
          <option key={o} value={o}>{fmt(o)}</option>
        ))}
      </select>
      {active && (
        <button className="clear-enum" onClick={() => clearRange(facet.path)}>{t('clear')}</button>
      )}
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
  const { enums, toggleEnum, setEnumMode, clearEnum } = useFilters()
  const sel = enums[facet.path] || { ids: [], mode: 'any' }
  const andMeaningless = !valuesCanCoexist(artworks, facet.path, sel.ids)

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
        {sel.ids.length > 0 && (
          <button className="clear-enum" onClick={() => clearEnum(facet.path)}>{t('clear')}</button>
        )}
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

// --- Icon buttons ---------------------------------------------------------

// Sort icon: cycles asc → desc → off. For the default sort key, cycles
// asc → desc → asc (no "off" — it always stays sorted).
function SortIcon({ path }) {
  const { t } = useLang()
  const { sort, setSort } = useFilters()
  const state = sort.path === path ? sort.dir : null
  const isDefaultPath = path === DEFAULT_SORT.path

  const handleClick = (e) => {
    e.stopPropagation()
    if (state === null) {
      setSort(path, 'asc')
    } else if (state === 'asc') {
      setSort(path, 'desc')
    } else {
      // desc → off (restore default), unless this IS the default key → cycle back to asc
      if (isDefaultPath) setSort(path, 'asc')
      else setSort(DEFAULT_SORT.path, DEFAULT_SORT.dir)
    }
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

// Group icon: toggles on/off. Strikethrough via CSS when off.
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

// Range icon: clicking opens accordion. Strikethrough when no active constraint.
function RangeIcon({ path, onToggle }) {
  const { t } = useLang()
  const { ranges } = useFilters()
  const active = !!ranges[path]
  return (
    <button
      className={`facet-icon range-icon${active ? ' icon-on' : ' icon-off'}`}
      onClick={(e) => { e.stopPropagation(); onToggle(path) }}
    >
      {t('range')}
    </button>
  )
}

// Enum filter icon: clicking opens accordion. Strikethrough when no selections.
function EnumIcon({ path, onToggle }) {
  const { t } = useLang()
  const { enums } = useFilters()
  const active = (enums[path]?.ids.length ?? 0) > 0
  return (
    <button
      className={`facet-icon enum-icon${active ? ' icon-on' : ' icon-off'}`}
      onClick={(e) => { e.stopPropagation(); onToggle(path) }}
    >
      {t('filter')}
    </button>
  )
}

// --- FacetNode ------------------------------------------------------------

function FacetNode({ facet, openPaths, onToggle }) {
  const { propLabel } = useLang()
  const open = openPaths.has(facet.path)

  const label =
    facet.path === TITLE_SORT
      ? propLabel('title')
      : facet.depth === 0
        ? propLabel(facet.key)
        : facet.key

  const sortable = facet.kind === 'text' || facet.kind === 'numeric' || facet.kind === 'date' || facet.kind === 'dateEvents'
  const isRange = facet.kind === 'numeric' || facet.kind === 'date' || facet.kind === 'dateEvents'
  const isEnum = facet.kind === 'stringList' || facet.kind === 'enumSingle'
  const isGroupable = isEnum && facet.path !== EVENTS_PATH
  const hasMissing = facet.kind !== 'nested' && facet.kind !== 'text'

  return (
    <li className="filter-node">
      <div className="facet-head">
        <button className="facet-expand" aria-expanded={open} onClick={() => onToggle(facet.path)}>
          <span className="caret">{open ? '▾' : '▸'}</span>
          <span className="facet-label">{label}</span>
        </button>
        <div className="facet-icons">
          {isGroupable && <GroupIcon path={facet.path} />}
          {sortable && <SortIcon path={facet.path} />}
          {isRange && <RangeIcon path={facet.path} onToggle={onToggle} />}
          {isEnum && <EnumIcon path={facet.path} onToggle={onToggle} />}
        </div>
      </div>
      {open && (
        <div className="facet-body">
          {facet.kind === 'nested' && <FacetTree facets={facet.children} openPaths={openPaths} onToggle={onToggle} />}
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

export default function FilterTree({ schema }) {
  const { t } = useLang()
  const [openPaths, setOpenPaths] = useState(() => new Set())
  const prevOpen = useRef(null)

  const toggle = (path) =>
    setOpenPaths((s) => {
      const next = new Set(s)
      next.has(path) ? next.delete(path) : next.add(path)
      return next
    })

  const collapseOrRevert = () =>
    setOpenPaths((s) => {
      if (s.size > 0) {
        prevOpen.current = s
        return new Set()
      }
      return prevOpen.current && prevOpen.current.size ? new Set(prevOpen.current) : s
    })

  const anyOpen = openPaths.size > 0
  const titleFacet = { path: TITLE_SORT, key: 'title', kind: 'text', depth: 0 }
  return (
    <div className="filters">
      <div className="filters-title">
        <span>{t('filters')}</span>
        <button
          className="collapse-all"
          title={anyOpen ? t('collapseAll') : t('restoreState')}
          aria-label={anyOpen ? t('collapseAll') : t('restoreState')}
          onClick={collapseOrRevert}
        >
          {anyOpen ? '⊟' : '⊞'}
        </button>
      </div>
      <FacetTree facets={[titleFacet, ...schema]} openPaths={openPaths} onToggle={toggle} />
    </div>
  )
}
