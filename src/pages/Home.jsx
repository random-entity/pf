import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { artworks, titleOf, dateOf } from '../lib/content.js'
import { prepare } from '../lib/markdown.js'
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
  const recent = [...artworks].sort((a, b) => dateOf(b) - dateOf(a))

  return (
    <div>
      {intro && (
        <div className="article" style={{ marginBottom: 32 }}>
          <Markdown>{prepare(intro, lang)}</Markdown>
        </div>
      )}
      <ul className="db-list">
        {recent.map((a) => (
          <li key={a.slug}>
            <Link to={`/artwork/${a.slug}`}>{titleOf(a, lang)}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
