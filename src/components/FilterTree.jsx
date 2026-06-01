import { useState } from 'react'
import { useLang } from '../i18n.jsx'
import { artworks } from '../lib/content.js'
import { labelOf, formatDuration, formatDate, valuesCanCoexist, unitForPath } from '../lib/properties.js'
import { useFilters, TITLE_SORT } from '../filters.jsx'

// Asc/desc sort buttons that drive the single global sort key.
function SortButtons({ path }) {
  const { t } = useLang()
  const { sort, setSort } = useFilters()
  return (
    <div className="sort-row">
      <button aria-pressed={sort.path === path && sort.dir === 'asc'} onClick={() => setSort(path, 'asc')}>
        {t('sortAsc')}
      </button>
      <button aria-pressed={sort.path === path && sort.dir === 'desc'} onClick={() => setSort(path, 'desc')}>
        {t('sortDesc')}
      </button>
    </div>
  )
}

// Min/max dropdowns over a numeric/date facet. For event dates, Min lists all
// start dates and Max all end dates.
function RangeSelect({ facet }) {
  const { t } = useLang()
  const { ranges, setRange, clearRange } = useFilters()
  const unit = unitForPath(facet.path)
  const fmt = (n) =>
    facet.isDuration ? formatDuration(n) : facet.isDate ? formatDate(n) : unit ? `${n} ${unit}` : String(n)
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
    </div>
  )
}

// Toggle whether artworks that have no value for this facet are included when
// this key is filtered. Off by default; checking it keeps the empties.
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

// Multi-select enum pills, with an Any/All mode toggle for list-valued facets.
function EnumFilter({ facet }) {
  const { lang, t } = useLang()
  const { enums, toggleEnum, setEnumMode, clearEnum } = useFilters()
  const sel = enums[facet.path] || { ids: [], mode: 'any' }

  // AND is meaningless when the selected values never co-occur on a single
  // artwork — strike it through to signal that.
  const andMeaningless = !valuesCanCoexist(artworks, facet.path, sel.ids)
  const isList = facet.kind === 'stringList'

  return (
    <div>
      {(isList || sel.ids.length > 0) && (
        <div className="tagmode-row">
          {isList && (
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
          )}
          {sel.ids.length > 0 && (
            <button className="clear-enum" onClick={() => clearEnum(facet.path)}>{t('clear')}</button>
          )}
        </div>
      )}
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

// Which active constraints exist on this key (aggregated over descendants),
// surfaced as marker symbols on the key's row.
function markersFor(facet, f) {
  const m = { sort: false, dir: null, range: false, multi: false, missing: false }
  const visit = (fac) => {
    if (f.sort.path === fac.path) {
      m.sort = true
      m.dir = f.sort.dir
    }
    if (f.ranges[fac.path]) m.range = true
    if (f.enums[fac.path]?.ids.length) m.multi = true
    if (f.showMissing[fac.path] === true) m.missing = true
    fac.children?.forEach(visit)
  }
  visit(facet)
  return m
}

function FacetNode({ facet }) {
  const { t, propLabel } = useLang()
  const f = useFilters()
  const [open, setOpen] = useState(false)

  const label =
    facet.path === TITLE_SORT
      ? propLabel('title')
      : facet.depth === 0
        ? propLabel(facet.key)
        : facet.key
  const m = markersFor(facet, f)
  const sortable =
    facet.kind === 'text' || facet.kind === 'numeric' || facet.kind === 'date' || facet.kind === 'dateEvents'
  const isRange = facet.kind === 'numeric' || facet.kind === 'date' || facet.kind === 'dateEvents'
  const isEnum = facet.kind === 'stringList' || facet.kind === 'enumSingle'
  const hasMissing = facet.kind !== 'nested' && facet.kind !== 'text'

  return (
    <li className="filter-node">
      <button className="facet-head" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="caret">{open ? '▾' : '▸'}</span>
        <span className="facet-label">{label}</span>
        <span className="markers">
          {m.sort && <span className="mk mk-sort" title={t('markSort')}>{m.dir === 'asc' ? '↑' : '↓'}</span>}
          {m.range && <span className="mk mk-range" title={t('markRange')}>⇔</span>}
          {m.multi && <span className="mk mk-multi" title={t('markMulti')}>✓</span>}
          {m.missing && <span className="mk mk-missing" title={t('markMissing')}>∅</span>}
        </span>
      </button>
      {open && (
        <div className="facet-body">
          {facet.kind === 'nested' && <FacetTree facets={facet.children} />}
          {sortable && <SortButtons path={facet.path} />}
          {isRange && <RangeSelect facet={facet} />}
          {isEnum && <EnumFilter facet={facet} />}
          {hasMissing && <MissingToggle path={facet.path} />}
        </div>
      )}
    </li>
  )
}

function FacetTree({ facets }) {
  return (
    <ul className="filter-tree">
      {facets.map((fac) => (
        <FacetNode key={fac.path} facet={fac} />
      ))}
    </ul>
  )
}

// One row per key. Each key shows the controls its value type supports (Sort
// and/or Range, or Multi-select), a per-key "show items without a value"
// toggle, and marker symbols for whichever constraints are active.
export default function FilterTree({ schema }) {
  const { t } = useLang()
  const titleFacet = { path: TITLE_SORT, key: 'title', kind: 'text', depth: 0 }
  return (
    <div className="filters">
      <div className="filters-title">{t('filters')}</div>
      <FacetTree facets={[titleFacet, ...schema]} />
    </div>
  )
}
