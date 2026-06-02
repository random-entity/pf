import { useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useLang, LANGS } from '../i18n.jsx'
import { artworks, titleOf } from '../lib/content.js'
import { extractHeadings, buildHeadingTree } from '../lib/markdown.js'
import { bodyMatchAll } from '../lib/search.js'
import {
  schema,
  facetByPath,
  getValueAtPath,
  labelOf,
  durationSeconds,
  dateEvents,
  dateSortValue,
  eventNamesOf,
  idsAtPath,
  EVENTS_PATH,
} from '../lib/properties.js'
import { useFilters, TITLE_SORT } from '../filters.jsx'
import FilterTree from './FilterTree.jsx'

function HeadingTree({ nodes, slug }) {
  if (nodes.length === 0) return null
  return (
    <ul>
      {nodes.map((n, i) => (
        <li key={i} data-level={n.level}>
          <Link to={{ pathname: `/${slug}`, hash: `#${encodeURIComponent(n.id)}` }}>{n.text}</Link>
          <HeadingTree nodes={n.children} slug={slug} />
        </li>
      ))}
    </ul>
  )
}

// Render a snippet with the matched portion bold-underlined.
function Snippet({ snippet, mStart, mEnd }) {
  return (
    <span className="snippet-text">
      {snippet.slice(0, mStart)}
      <mark className="snippet-mark">{snippet.slice(mStart, mEnd)}</mark>
      {snippet.slice(mEnd)}
    </span>
  )
}

// Max snippets shown before "show more" is required.
const SNIPPET_DEFAULT_SHOW = 3

function ArtworkItem({ artwork, bodyHits, titleHits }) {
  const { lang, t, setLang } = useLang()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const tree = useMemo(
    () => buildHeadingTree(extractHeadings(artwork.body, lang)),
    [artwork, lang],
  )
  const hasHeadings = tree.length > 0
  const hits = bodyHits ?? []
  const shown = expanded ? hits : hits.slice(0, SNIPPET_DEFAULT_SHOW)

  const handleBodySnippetClick = (hit) => {
    navigate(`/${artwork.slug}`, {
      state: { jumpTo: hit.matchText, jumpOcc: hit.occ, jumpLang: hit.lang, _t: Date.now() },
    })
  }

  const handleTitleSnippetClick = (hit) => {
    navigate(`/${artwork.slug}`, {
      state: { jumpLang: hit.lang, _t: Date.now() },
    })
  }

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
          to={`/${artwork.slug}`}
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          {titleOf(artwork, lang)}
        </NavLink>
      </div>

      {/* Cross-language title matches */}
      {titleHits?.length > 0 && (
        <div className="search-snippets">
          {titleHits.map((hit, i) => (
            <button key={i} className="snippet-item" onClick={() => handleTitleSnippetClick(hit)}>
              <span className="snippet-lang">{hit.lang}</span>
              <Snippet snippet={hit.snippet} mStart={hit.mStart} mEnd={hit.mEnd} />
            </button>
          ))}
        </div>
      )}

      {/* Body content matches */}
      {hits.length > 0 && (
        <div className="search-snippets">
          {shown.map((hit, i) => (
            <button key={i} className="snippet-item" onClick={() => handleBodySnippetClick(hit)}>
              {hit.lang !== lang && <span className="snippet-lang">{hit.lang}</span>}
              <Snippet snippet={hit.snippet} mStart={hit.mStart} mEnd={hit.mEnd} />
            </button>
          ))}
          {hits.length > SNIPPET_DEFAULT_SHOW && (
            <button className="snippet-more" onClick={() => setExpanded((v) => !v)}>
              {expanded ? t('showLess') : `+${hits.length - SNIPPET_DEFAULT_SHOW} ${t('more')}`}
            </button>
          )}
        </div>
      )}

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

function numberAtPath(data, path, facet) {
  const v = getValueAtPath(data, path)
  if (v == null) return null
  if (facet?.isDuration) return durationSeconds(v)
  if (v instanceof Date) return v.getTime()
  return facet?.isDate ? new Date(v).getTime() : v
}

function hasValueAtPath(data, facet) {
  if (facet.kind === 'dateEvents') return dateEvents(data.date).length > 0
  if (facet.kind === 'stringList' || facet.kind === 'enumSingle') return idsAtPath(data, facet.path).length > 0
  return numberAtPath(data, facet.path, facet) != null
}

// Exact case-insensitive substring match against title (all langs) and enum labels.
// Used for the main search bar — no fuzzy, so "ㅇ" only matches text that contains "ㅇ".
function exactMetaMatch(artwork, q) {
  const qLo = q.toLowerCase()
  for (const l of LANGS) {
    if (titleOf(artwork, l).toLowerCase().includes(qLo)) return true
  }
  for (const f of facetByPath.values()) {
    if (f.kind !== 'stringList' && f.kind !== 'enumSingle') continue
    const v = getValueAtPath(artwork.data, f.path)
    if (v == null) continue
    const vals = Array.isArray(v) ? v : [v]
    for (const val of vals) {
      for (const l of LANGS) {
        if (String(labelOf(val, l) ?? '').toLowerCase().includes(qLo)) return true
      }
    }
  }
  return false
}

export default function DatabaseBrowser() {
  const { lang, t } = useLang()
  const { enums, ranges, showMissing, sort, group, q, setQ, titleQ, reset, isAnyActive } = useFilters()

  const sortValue = (a) => {
    if (sort.path === TITLE_SORT) return titleOf(a, lang)
    const facet = facetByPath.get(sort.path)
    if (!facet) return null
    if (facet.kind === 'dateEvents') return dateSortValue(a.data)
    return numberAtPath(a.data, sort.path, facet)
  }

  const { results, matchMap, titleMatchMap } = useMemo(() => {
    const matchMap = new Map()
    const titleMatchMap = new Map()
    const constrainedPaths = new Set([
      ...Object.keys(enums).filter((p) => enums[p].ids.length),
      ...Object.keys(ranges),
    ])
    if (sort.path !== TITLE_SORT && facetByPath.has(sort.path)) constrainedPaths.add(sort.path)

    let list = artworks.filter((a) => {
      // Main search: exact substring across all text. No fuzzy — avoids false
      // positives with partial CJK characters like "ㅇ".
      if (q.trim()) {
        const bodyHits = bodyMatchAll(a.body, q, lang)
        const metaHit = exactMetaMatch(a, q)
        if (bodyHits.length === 0 && !metaHit) return false
        if (bodyHits.length > 0) matchMap.set(a.slug, bodyHits)
      }

      // Title-only filter: exact case-insensitive substring across all languages.
      // Collect cross-language hits (those not in the current UI lang) as snippets.
      if (titleQ.trim()) {
        const qLo = titleQ.toLowerCase()
        const matchingLangs = LANGS.filter((l) => titleOf(a, l).toLowerCase().includes(qLo))
        if (matchingLangs.length === 0) return false
        const crossHits = matchingLangs
          .filter((l) => l !== lang)
          .map((l) => {
            const title = titleOf(a, l)
            const idx = title.toLowerCase().indexOf(qLo)
            return { lang: l, snippet: title, mStart: idx, mEnd: idx + qLo.length, matchText: title.slice(idx, idx + qLo.length) }
          })
        if (crossHits.length > 0) titleMatchMap.set(a.slug, crossHits)
      }

      for (const path of constrainedPaths) {
        const facet = facetByPath.get(path)
        if (!facet) continue
        if (!hasValueAtPath(a.data, facet)) {
          if (showMissing[path] === true) continue
          return false
        }
        const sel = enums[path]
        if (sel?.ids.length) {
          const own = idsAtPath(a.data, path)
          const ok = sel.mode === 'all'
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
      if (va == null) return 1
      if (vb == null) return -1
      const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb
      return cmp * dir
    })
    return { results: list, matchMap, titleMatchMap }
  }, [q, titleQ, lang, enums, ranges, showMissing, sort])

  const groups = useMemo(() => {
    if (group === 'none') return [['', results]]
    const map = new Map()
    for (const a of results) {
      const v = getValueAtPath(a.data, group)
      const vals = v == null ? [null] : Array.isArray(v) ? v : [v]
      for (const one of vals) {
        const label = one == null ? '—' : labelOf(one, lang)
        if (!map.has(label)) map.set(label, [])
        map.get(label).push(a)
      }
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [results, group, lang])

  return (
    <div className="database">
      <div className="section-label">{t('searchLabel')}</div>
      <input
        className="main-search"
        type="search"
        placeholder={t('search')}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label={t('search')}
      />

      <FilterTree schema={schema} isAnyActive={isAnyActive} onReset={reset} />

      <div className="count">{results.length} {t('items')}</div>
      {results.length === 0 && <p className="muted">{t('noResults')}</p>}

      {groups.map(([name, items]) => (
        <div key={name || '_'}>
          {group !== 'none' && <div className="db-group-title">{name}</div>}
          <ul className="db-list">
            {items.map((a) => (
              <ArtworkItem key={a.slug} artwork={a} bodyHits={matchMap.get(a.slug)} titleHits={titleMatchMap.get(a.slug)} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
