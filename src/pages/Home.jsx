import { useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { artworks, titleOf } from '../lib/content.js'
import { releaseSortValue } from '../lib/properties.js'
import { firstH1Text, prepare, stripFirstH1 } from '../lib/markdown.js'
import Markdown from '../components/Markdown.jsx'

// Optional intro text. Edit src/content/home.md (supports language fences).
const introFiles = import.meta.glob('../content/home.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const intro = Object.values(introFiles)[0] || ''

export default function Home() {
  const { lang } = useLang()
  const { setPageTitle } = useOutletContext()
  const preparedIntro = intro ? prepare(intro, lang) : ''
  const bodyIntro = stripFirstH1(preparedIntro)
  const recent = [...artworks].sort((a, b) => (releaseSortValue(b.data) ?? 0) - (releaseSortValue(a.data) ?? 0))

  useEffect(() => {
    setPageTitle(firstH1Text(preparedIntro))
  }, [preparedIntro, setPageTitle])

  return (
    <div>
      {intro && (
        <div className="article" style={{ marginBottom: 32 }}>
          <Markdown>{bodyIntro}</Markdown>
        </div>
      )}
      <ul className="db-list">
        {recent.map((a) => (
          <li key={a.slug}>
            <Link to={`/${a.slug}`}>{titleOf(a, lang)}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
