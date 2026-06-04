import { useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useLang, LANGS } from '../i18n.jsx'
import { artworks, titleOf } from '../lib/content.js'
import { extractHeadings, buildHeadingTree } from '../lib/markdown.js'
import { bodyMatchAll, propMatchAll } from '../lib/search.js'
import {
  schema,
  facetByPath,
  valuesAtPath,
  labelOf,
  idsAtPath,
  hasValueAtPath,
  sortValueForFacet,
  rangeMatchesFacet,
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

function ArtworkItem({ artwork, bodyHits, titleHits, propHits }) {
  const { lang, t, setLang } = useLang()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [bodyExpanded, setBodyExpanded] = useState(false)
  const [propExpanded, setPropExpanded] = useState(false)

  const tree = useMemo(
    () => buildHeadingTree(extractHeadings(artwork.body, lang)),
    [artwork, lang],
  )
  const hasHeadings = tree.length > 0
  const bodyHitList = bodyHits ?? []
  const propHitList = propHits ?? []
  const shownBody = bodyExpanded ? bodyHitList : bodyHitList.slice(0, SNIPPET_DEFAULT_SHOW)
  const shownProp = propExpanded ? propHitList : propHitList.slice(0, SNIPPET_DEFAULT_SHOW)

  const handleBodySnippetClick = (hit) => {
    navigate(`/${artwork.slug}`, {
      state: { jumpTo: hit.matchText, jumpOcc: hit.occ, jumpLang: hit.lang, _t: Date.now() },
    })
  }

  const handlePropSnippetClick = (hit) => {
    navigate(`/${artwork.slug}`, {
      state: { jumpPropTo: hit.matchText, jumpPropOcc: hit.occ, jumpLang: hit.lang, _t: Date.now() },
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

      {/* Frontmatter property value matches */}
      {propHitList.length > 0 && (
        <div className="search-snippets">
          {shownProp.map((hit, i) => (
            <button key={i} className="snippet-item" onClick={() => handlePropSnippetClick(hit)}>
              {hit.lang !== lang && <span className="snippet-lang">{hit.lang}</span>}
              <span className="snippet-lang snippet-prop">prop</span>
              <Snippet snippet={hit.snippet} mStart={hit.mStart} mEnd={hit.mEnd} />
            </button>
          ))}
          {propHitList.length > SNIPPET_DEFAULT_SHOW && (
            <button className="snippet-more" onClick={() => setPropExpanded((v) => !v)}>
              {propExpanded ? t('showLess') : `+${propHitList.length - SNIPPET_DEFAULT_SHOW} ${t('more')}`}
            </button>
          )}
        </div>
      )}

      {/* Body content matches */}
      {bodyHitList.length > 0 && (
        <div className="search-snippets">
          {shownBody.map((hit, i) => (
            <button key={i} className="snippet-item" onClick={() => handleBodySnippetClick(hit)}>
              {hit.lang !== lang && <span className="snippet-lang">{hit.lang}</span>}
              <Snippet snippet={hit.snippet} mStart={hit.mStart} mEnd={hit.mEnd} />
            </button>
          ))}
          {bodyHitList.length > SNIPPET_DEFAULT_SHOW && (
            <button className="snippet-more" onClick={() => setBodyExpanded((v) => !v)}>
              {bodyExpanded ? t('showLess') : `+${bodyHitList.length - SNIPPET_DEFAULT_SHOW} ${t('more')}`}
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

// Exact case-insensitive substring match against title (all langs) and enum
// labels. Used for the main search bar — no fuzzy, so "ㅇ" only matches text
// that literally contains "ㅇ".
function exactMetaMatch(artwork, q) {
  const qLo = q.toLowerCase()
  for (const l of LANGS) {
    if (titleOf(artwork, l).toLowerCase().includes(qLo)) return true
  }
  for (const f of facetByPath.values()) {
    if (f.kind !== 'enum') continue
    for (const val of valuesAtPath(artwork.data, f.path)) {
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
    return sortValueForFacet(facet, a.data)
  }

  const { results, matchMap, propMatchMap, titleMatchMap } = useMemo(() => {
    const matchMap = new Map()
    const propMatchMap = new Map()
    const titleMatchMap = new Map()
    // Only real filters constrain the list: active enum selections and ranges.
    // Sorting must NOT drop items — an artwork lacking the sort value simply
    // sinks to the bottom (null-handling in the comparator below). This is what
    // keeps items without `releases` visible under the default releases.date sort.
    const constrainedPaths = new Set([
      ...Object.keys(enums).filter((p) => enums[p].ids.length),
      ...Object.keys(ranges),
    ])

    let list = artworks.filter((a) => {
      // Main search: exact substring across all text. No fuzzy — avoids false
      // positives with partial CJK characters like "ㅇ".
      if (q.trim()) {
        const bodyHits = bodyMatchAll(a.body, q, lang)
        const propHits = propMatchAll(a.data, q, lang)
        const metaHit = exactMetaMatch(a, q)
        if (bodyHits.length === 0 && propHits.length === 0 && !metaHit) return false
        if (bodyHits.length > 0) matchMap.set(a.slug, bodyHits)
        if (propHits.length > 0) propMatchMap.set(a.slug, propHits)
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
        if (r && !rangeMatchesFacet(facet, a.data, r)) return false
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
    return { results: list, matchMap, propMatchMap, titleMatchMap }
  }, [q, titleQ, lang, enums, ranges, showMissing, sort])

  const groups = useMemo(() => {
    if (group === 'none') return [['', results]]
    const map = new Map()
    for (const a of results) {
      const raws = valuesAtPath(a.data, group)
      const vals = raws.length ? raws : [null]
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
              <ArtworkItem key={a.slug} artwork={a} bodyHits={matchMap.get(a.slug)} propHits={propMatchMap.get(a.slug)} titleHits={titleMatchMap.get(a.slug)} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
