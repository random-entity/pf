import { useMemo, useState } from 'react'
import { Link, NavLink, useSearchParams } from 'react-router-dom'
import { useLang, loc } from '../i18n.jsx'
import { artworks, titleOf, dateOf, toArray, allTags } from '../lib/content.js'
import { fuzzyScore } from '../lib/fuzzy.js'
import { extractHeadings, buildHeadingTree } from '../lib/markdown.js'

// Recursive renderer for an artwork's Markdown heading outline. Each heading
// deep-links to its slugged id within the artwork page (see ArtworkPage's
// scroll effect and rehype-slug in Markdown.jsx). `search` carries the active
// filter query so navigating away does not reset the tag selection.
function HeadingTree({ nodes, slug, search }) {
  if (nodes.length === 0) return null
  return (
    <ul>
      {nodes.map((n, i) => (
        <li key={i} data-level={n.level}>
          <Link to={{ pathname: `/artwork/${slug}`, search, hash: `#${encodeURIComponent(n.id)}` }}>
            {n.text}
          </Link>
          <HeadingTree nodes={n.children} slug={slug} search={search} />
        </li>
      ))}
    </ul>
  )
}

// One artwork: title links to the page; the caret expands a heading outline.
// `search` preserves the current filter query (?tag=…) across navigation.
function ArtworkItem({ artwork, search }) {
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
          to={{ pathname: `/artwork/${artwork.slug}`, search }}
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          {titleOf(artwork, lang)}
        </NavLink>
      </div>
      {open && (
        <div className="outline">
          {hasHeadings ? (
            <HeadingTree nodes={tree} slug={artwork.slug} search={search} />
          ) : (
            <span className="muted">{t('noHeadings')}</span>
          )}
        </div>
      )}
    </li>
  )
}

// Searchable / sortable / groupable database view of all artworks.
// Selected tags live in the URL (?tag=) so Property tag links feed into it.
export default function DatabaseBrowser() {
  const { lang, t } = useLang()
  const [params, setParams] = useSearchParams()
  const selectedTags = params.getAll('tag')
  const search = params.toString() // preserved on artwork links so filters survive navigation

  const [q, setQ] = useState('')
  const [sort, setSort] = useState('date') // 'date' | 'title'
  const [dir, setDir] = useState('desc') // 'asc' | 'desc'
  const [group, setGroup] = useState('none') // 'none' | 'genre'
  const [tagMode, setTagMode] = useState('any') // 'any' (OR) | 'all' (AND)

  const tags = useMemo(() => allTags(), [])

  const results = useMemo(() => {
    const lowerTags = selectedTags.map((x) => x.toLowerCase())

    let list = artworks.filter((a) => {
      // Tag filter: 'any' keeps artworks with at least one selected tag (OR);
      // 'all' requires every selected tag (AND).
      if (lowerTags.length) {
        const own = toArray(a.data.tags).map((x) => String(x).toLowerCase())
        const match =
          tagMode === 'all'
            ? lowerTags.every((x) => own.includes(x))
            : lowerTags.some((x) => own.includes(x))
        if (!match) return false
      }
      // Fuzzy text filter across title, genre, slug and tags.
      if (q.trim()) {
        const hay = [
          titleOf(a, lang),
          loc(a.data.genre, lang),
          a.slug,
          toArray(a.data.tags).join(' '),
        ].join(' ')
        if (fuzzyScore(q, hay) === 0) return false
      }
      return true
    })

    list = [...list].sort((a, b) => {
      const cmp =
        sort === 'title'
          ? titleOf(a, lang).localeCompare(titleOf(b, lang))
          : dateOf(a) - dateOf(b)
      return dir === 'asc' ? cmp : -cmp
    })
    return list
  }, [q, sort, dir, lang, tagMode, selectedTags.join(',')])

  const groups = useMemo(() => {
    if (group !== 'genre') return [['', results]]
    const map = new Map()
    for (const a of results) {
      const g = loc(a.data.genre, lang) || '—'
      if (!map.has(g)) map.set(g, [])
      map.get(g).push(a)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [results, group, lang])

  function toggleTag(tag) {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((x) => x !== tag)
      : [...selectedTags, tag]
    const sp = new URLSearchParams(params)
    sp.delete('tag')
    for (const x of next) sp.append('tag', x)
    setParams(sp, { replace: true })
  }

  function reset() {
    setQ('')
    setSort('date')
    setDir('desc')
    setGroup('none')
    setTagMode('any')
    const sp = new URLSearchParams(params)
    sp.delete('tag')
    setParams(sp, { replace: true })
  }

  const filtersActive = q.trim() !== '' || selectedTags.length > 0

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
        <div className="row">
          <div style={{ flex: 1 }}>
            <label>{t('sortBy')}</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="date">{t('date')}</option>
              <option value="title">{t('title')}</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>&nbsp;</label>
            <select value={dir} onChange={(e) => setDir(e.target.value)}>
              <option value="desc">{t('desc')}</option>
              <option value="asc">{t('asc')}</option>
            </select>
          </div>
        </div>
        <div>
          <label>{t('groupBy')}</label>
          <select value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="none">{t('none')}</option>
            <option value="genre">{t('genre')}</option>
          </select>
        </div>

        {tags.length > 0 && (
          <div>
            <div className="tagmode-row">
              <label>{t('filterByTags')}</label>
              <div className="tagmode" role="group" aria-label={t('filterByTags')}>
                <button aria-pressed={tagMode === 'any'} onClick={() => setTagMode('any')}>
                  {t('tagAny')}
                </button>
                <button aria-pressed={tagMode === 'all'} onClick={() => setTagMode('all')}>
                  {t('tagAll')}
                </button>
              </div>
            </div>
            <div className="tagfilter">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className="tag"
                  aria-pressed={selectedTags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <button className="db-reset" onClick={reset} disabled={!filtersActive}>
          {t('reset')}
        </button>
      </div>

      <div className="count">
        {results.length} {t('items')}
      </div>

      {results.length === 0 && <p className="muted">{t('noResults')}</p>}

      {groups.map(([name, items]) => (
        <div key={name || '_'}>
          {group === 'genre' && <div className="db-group-title">{name}</div>}
          <ul className="db-list">
            {items.map((a) => (
              <ArtworkItem key={a.slug} artwork={a} search={search} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
