import { useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { artworks, titleOf } from '../lib/content.js'
import { fuzzyScore } from '../lib/fuzzy.js'
import { extractHeadings, buildHeadingTree } from '../lib/markdown.js'
import {
  schema,
  facetByPath,
  getValueAtPath,
  canonicalOf,
  labelOf,
  durationSeconds,
  dateEvents,
  dateSortValue,
  eventNamesOf,
  EVENTS_PATH,
} from '../lib/properties.js'
import { useFilters, TITLE_SORT } from '../filters.jsx'
import FilterTree from './FilterTree.jsx'

// Recursive renderer for an artwork's Markdown heading outline. Each heading
// deep-links to its slugged id within the artwork page.
function HeadingTree({ nodes, slug }) {
  if (nodes.length === 0) return null
  return (
    <ul>
      {nodes.map((n, i) => (
        <li key={i} data-level={n.level}>
          <Link to={{ pathname: `/artwork/${slug}`, hash: `#${encodeURIComponent(n.id)}` }}>{n.text}</Link>
          <HeadingTree nodes={n.children} slug={slug} />
        </li>
      ))}
    </ul>
  )
}

// One artwork: title links to the page; the caret expands a heading outline.
function ArtworkItem({ artwork }) {
  const { lang, t } = useLang()
  const [open, setOpen] = useState(false)
  const tree = useMemo(
    () => buildHeadingTree(extractHeadings(artwork.body, lang)),
    [artwork, lang],
  )
  const hasHeadings = tree.length > 0

  return (
    <li className="acc-item">
      <div className="acc-head">
        <button
          className="acc-toggle"
          aria-expanded={open}
          aria-label={titleOf(artwork, lang)}
          disabled={!hasHeadings}
          onClick={() => setOpen((v) => !v)}
        >
          {hasHeadings ? (open ? '▾' : '▸') : '·'}
        </button>
        <NavLink
          to={`/artwork/${artwork.slug}`}
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          {titleOf(artwork, lang)}
        </NavLink>
      </div>
      {open && (
        <div className="outline">
          {hasHeadings ? (
            <HeadingTree nodes={tree} slug={artwork.slug} />
          ) : (
            <span className="muted">{t('noHeadings')}</span>
          )}
        </div>
      )}
    </li>
  )
}

// Canonical ids an artwork carries at a facet path (handles list & single).
function idsAtPath(data, path) {
  if (path === EVENTS_PATH) return eventNamesOf(data)
  const v = getValueAtPath(data, path)
  if (v == null) return []
  return Array.isArray(v) ? v.map(canonicalOf) : [canonicalOf(v)]
}

function numberAtPath(data, path, facet) {
  const v = getValueAtPath(data, path)
  if (v == null) return null
  if (facet?.isDuration) return durationSeconds(v)
  if (v instanceof Date) return v.getTime()
  return facet?.isDate ? new Date(v).getTime() : v
}

// Does the artwork carry any value for this facet? Used by the per-key
// "show items without a value" toggle.
function hasValueAtPath(data, facet) {
  if (facet.kind === 'dateEvents') return dateEvents(data.date).length > 0
  if (facet.kind === 'stringList' || facet.kind === 'enumSingle') return idsAtPath(data, facet.path).length > 0
  return numberAtPath(data, facet.path, facet) != null
}

// Single, fully generic database view driven by the property schema.
export default function DatabaseBrowser() {
  const { lang, t, propLabel } = useLang()
  const { enums, ranges, showMissing, sort, reset, activeCount, isDefaultSort } = useFilters()

  const [q, setQ] = useState('')
  const [group, setGroup] = useState('none') // 'none' | <enumSingle facet path>

  const groupable = useMemo(() => schema.filter((f) => f.kind === 'enumSingle'), [])

  // Text searched by the fuzzy box: title, slug, and every enum value label.
  const haystackOf = (a) => {
    const parts = [titleOf(a, lang), a.slug]
    for (const f of facetByPath.values()) {
      if (f.kind !== 'stringList' && f.kind !== 'enumSingle') continue
      const v = getValueAtPath(a.data, f.path)
      if (Array.isArray(v)) parts.push(v.map((x) => labelOf(x, lang)).join(' '))
      else if (v != null) parts.push(labelOf(v, lang))
    }
    parts.push(eventNamesOf(a.data).join(' '))
    return parts.join(' ')
  }

  const sortValue = (a) => {
    if (sort.path === TITLE_SORT) return titleOf(a, lang)
    const facet = facetByPath.get(sort.path)
    if (!facet) return null
    if (facet.kind === 'dateEvents') return dateSortValue(a.data)
    return numberAtPath(a.data, sort.path, facet)
  }

  const results = useMemo(() => {
    // Every key that currently constrains the result: a multi-select, a range,
    // or a "hide items without a value".
    const constrainedPaths = new Set([
      ...Object.keys(enums).filter((p) => enums[p].ids.length),
      ...Object.keys(ranges),
      ...Object.keys(showMissing).filter((p) => showMissing[p] === false),
    ])

    let list = artworks.filter((a) => {
      if (q.trim() && fuzzyScore(q, haystackOf(a)) === 0) return false

      for (const path of constrainedPaths) {
        const facet = facetByPath.get(path)
        if (!facet) continue

        if (!hasValueAtPath(a.data, facet)) {
          if (showMissing[path] === false) return false
          continue // missing but allowed -> nothing else to check
        }

        const sel = enums[path]
        if (sel?.ids.length) {
          const own = idsAtPath(a.data, path)
          const ok =
            facet.kind === 'stringList' && sel.mode === 'all'
              ? sel.ids.every((id) => own.includes(id))
              : sel.ids.some((id) => own.includes(id))
          if (!ok) return false
        }

        const r = ranges[path]
        if (r) {
          if (facet.kind === 'dateEvents') {
            const evs = dateEvents(a.data.date)
            if (!evs.some((e) => e.start <= r.max && e.end >= r.min)) return false
          } else {
            const num = numberAtPath(a.data, path, facet)
            if (num < r.min || num > r.max) return false
          }
        }
      }

      return true
    })

    const dir = sort.dir === 'asc' ? 1 : -1
    list = [...list].sort((a, b) => {
      const va = sortValue(a)
      const vb = sortValue(b)
      if (va == null && vb == null) return 0
      if (va == null) return 1 // missing values sort last regardless of dir
      if (vb == null) return -1
      const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb
      return cmp * dir
    })
    return list
  }, [q, lang, enums, ranges, showMissing, sort])

  const groups = useMemo(() => {
    if (group === 'none') return [['', results]]
    const map = new Map()
    for (const a of results) {
      const v = getValueAtPath(a.data, group)
      const label = v == null ? '—' : labelOf(v, lang)
      if (!map.has(label)) map.set(label, [])
      map.get(label).push(a)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [results, group, lang])

  const filtersActive = q.trim() !== '' || activeCount > 0 || !isDefaultSort || group !== 'none'

  return (
    <div className="database">
      <div className="dbcontrols">
        <input
          type="search"
          placeholder={t('search')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={t('search')}
        />

        {groupable.length > 0 && (
          <div>
            <label>{t('groupBy')}</label>
            <select value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="none">{t('none')}</option>
              {groupable.map((f) => (
                <option key={f.path} value={f.path}>{propLabel(f.key)}</option>
              ))}
            </select>
          </div>
        )}

        <button
          className="db-reset"
          onClick={() => {
            setQ('')
            setGroup('none')
            reset()
          }}
          disabled={!filtersActive}
        >
          {t('reset')}
        </button>
      </div>

      <FilterTree schema={schema} />

      <div className="count">
        {results.length} {t('items')}
      </div>

      {results.length === 0 && <p className="muted">{t('noResults')}</p>}

      {groups.map(([name, items]) => (
        <div key={name || '_'}>
          {group !== 'none' && <div className="db-group-title">{name}</div>}
          <ul className="db-list">
            {items.map((a) => (
              <ArtworkItem key={a.slug} artwork={a} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
