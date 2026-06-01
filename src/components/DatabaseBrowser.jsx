import { useMemo, useState } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import { useLang, loc } from '../i18n.jsx'
import { artworks, titleOf, dateOf, toArray } from '../lib/content.js'

// Searchable / sortable / groupable database view of all artworks.
// The active tag filter is held in the URL (?tag=) so Property tag links work.
export default function DatabaseBrowser() {
  const { lang, t } = useLang()
  const [params, setParams] = useSearchParams()
  const tag = params.get('tag') || ''

  const [q, setQ] = useState('')
  const [sort, setSort] = useState('date') // 'date' | 'title'
  const [dir, setDir] = useState('desc') // 'asc' | 'desc'
  const [group, setGroup] = useState('none') // 'none' | 'genre'

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    let list = artworks.filter((a) => {
      if (tag && !toArray(a.data.tags).some((x) => String(x).toLowerCase() === tag.toLowerCase())) {
        return false
      }
      if (!needle) return true
      const hay = [
        titleOf(a, lang),
        loc(a.data.genre, lang),
        a.slug,
        toArray(a.data.tags).join(' '),
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(needle)
    })

    list = [...list].sort((a, b) => {
      const cmp =
        sort === 'title'
          ? titleOf(a, lang).localeCompare(titleOf(b, lang))
          : dateOf(a) - dateOf(b)
      return dir === 'asc' ? cmp : -cmp
    })
    return list
  }, [q, sort, dir, tag, lang])

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

  function clearTag() {
    params.delete('tag')
    setParams(params, { replace: true })
  }

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
        {tag && (
          <div className="row" style={{ alignItems: 'center' }}>
            <span className="tag">{tag}</span>
            <button onClick={clearTag}>✕</button>
          </div>
        )}
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
              <li key={a.slug}>
                <NavLink
                  to={`/artwork/${a.slug}`}
                  className={({ isActive }) => (isActive ? 'active' : undefined)}
                >
                  {titleOf(a, lang)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
