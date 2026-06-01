import { useState } from 'react'
import { useLang } from '../i18n.jsx'
import { labelOf, formatDuration, formatDate } from '../lib/properties.js'
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
  const fmt = (n) =>
    facet.isDuration ? formatDuration(n) : facet.isDate ? formatDate(n) : String(n)
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

// Toggle whether artworks that have no value for this facet appear in results.
function MissingToggle({ path }) {
  const { t } = useLang()
  const { showMissing, toggleMissing } = useFilters()
  const showing = showMissing[path] !== false
  return (
    <button className="missing-toggle" aria-pressed={showing} onClick={() => toggleMissing(path)}>
      <span className="box">{showing ? '☑' : '☐'}</span> {t('showWithoutKey')}
    </button>
  )
}

// Multi-select enum pills, with an Any/All mode toggle for list-valued facets.
function EnumFilter({ facet }) {
  const { lang, t } = useLang()
  const { enums, toggleEnum, setEnumMode } = useFilters()
  const sel = enums[facet.path] || { ids: [], mode: 'any' }

  return (
    <div>
      {facet.kind === 'stringList' && (
        <div className="tagmode" role="group" aria-label={facet.path}>
          <button aria-pressed={sel.mode === 'any'} onClick={() => setEnumMode(facet.path, 'any')}>{t('tagAny')}</button>
          <button aria-pressed={sel.mode === 'all'} onClick={() => setEnumMode(facet.path, 'all')}>{t('tagAll')}</button>
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

// Is anything selected/sorted under this facet (or its descendants)?
function facetActive(facet, f) {
  if (f.sort.path === facet.path) return true
  if (f.enums[facet.path]?.ids.length) return true
  if (f.ranges[facet.path]) return true
  if (f.showMissing[facet.path] === false) return true
  if (facet.children) return facet.children.some((c) => facetActive(c, f))
  return false
}

function FacetNode({ facet }) {
  const { propLabel } = useLang()
  const f = useFilters()
  const [open, setOpen] = useState(false)

  const label =
    facet.path === TITLE_SORT
      ? propLabel('title')
      : facet.depth === 0
        ? propLabel(facet.key)
        : facet.key
  const active = facetActive(facet, f)
  const isRange = facet.kind === 'numeric' || facet.kind === 'date' || facet.kind === 'dateEvents'

  return (
    <li className="filter-node">
      <button className="facet-head" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="caret">{open ? '▾' : '▸'}</span>
        <span className="facet-label">{label}</span>
        {active && <span className="marker" aria-hidden="true">●</span>}
      </button>
      {open && (
        <div className="facet-body">
          {facet.kind === 'nested' && (
            <ul className="filter-tree">
              {facet.children.map((c) => (
                <FacetNode key={c.path} facet={c} />
              ))}
            </ul>
          )}
          {isRange && (
            <>
              <SortButtons path={facet.path} />
              <RangeSelect facet={facet} />
              <MissingToggle path={facet.path} />
            </>
          )}
          {facet.kind === 'text' && <SortButtons path={facet.path} />}
          {(facet.kind === 'stringList' || facet.kind === 'enumSingle') && <EnumFilter facet={facet} />}
        </div>
      )}
    </li>
  )
}

// The full search/sort/filter tree: a sort-only Title facet, then every
// property facet derived from frontmatter.
export default function FilterTree({ schema }) {
  const { t } = useLang()
  const titleFacet = { path: TITLE_SORT, key: 'title', kind: 'text', depth: 0 }
  return (
    <div className="filters">
      <div className="filters-title">{t('filters')}</div>
      <ul className="filter-tree">
        <FacetNode facet={titleFacet} />
        {schema.map((f) => (
          <FacetNode key={f.path} facet={f} />
        ))}
      </ul>
    </div>
  )
}
