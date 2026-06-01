import { useState } from 'react'
import { useLang } from '../i18n.jsx'
import { labelOf, formatDuration } from '../lib/properties.js'
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

// Min/max dropdowns over a numeric (or date) facet's distinct values.
function RangeSelect({ facet }) {
  const { lang, t } = useLang()
  const { ranges, setRange, clearRange } = useFilters()
  const fmt = (n) =>
    facet.isDuration ? formatDuration(n) : facet.isDate ? new Date(n).toLocaleDateString(lang) : String(n)
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
        {facet.options.map((o) => (
          <option key={o} value={o}>{fmt(o)}</option>
        ))}
      </select>
      <label>{t('max')}</label>
      <select value={cur.max} onChange={(e) => update(cur.min, Number(e.target.value))}>
        {facet.options.map((o) => (
          <option key={o} value={o}>{fmt(o)}</option>
        ))}
      </select>
    </div>
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
function facetActive(facet, enums, ranges, sort) {
  if (sort.path === facet.path) return true
  if (enums[facet.path]?.ids.length) return true
  if (ranges[facet.path]) return true
  if (facet.children) return facet.children.some((c) => facetActive(c, enums, ranges, sort))
  return false
}

function FacetNode({ facet }) {
  const { propLabel } = useLang()
  const { enums, ranges, sort } = useFilters()
  const [open, setOpen] = useState(false)

  const label =
    facet.path === TITLE_SORT
      ? propLabel('title')
      : facet.depth === 0
        ? propLabel(facet.key)
        : facet.key
  const active = facetActive(facet, enums, ranges, sort)

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
          {(facet.kind === 'numeric' || facet.kind === 'date') && (
            <>
              <SortButtons path={facet.path} />
              <RangeSelect facet={facet} />
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
