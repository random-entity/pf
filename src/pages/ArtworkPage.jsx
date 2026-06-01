import { useParams, Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { bySlug, titleOf } from '../lib/content.js'
import { prepare } from '../lib/markdown.js'
import Properties from '../components/Properties.jsx'
import Markdown from '../components/Markdown.jsx'

export default function ArtworkPage() {
  const { lang, t } = useLang()
  // The wildcard route gives the full nested slug via params['*'].
  const params = useParams()
  const slug = decodeURI(params['*'] || '')
  const artwork = bySlug[slug]

  if (!artwork) {
    return (
      <p className="muted">
        {t('notFound')} <Link to="/">{t('home')}</Link>
      </p>
    )
  }

  const body = prepare(artwork.body, lang)

  return (
    <article>
      <h2 className="page-title">{titleOf(artwork, lang)}</h2>
      <Properties data={artwork.data} />
      <div className="article">
        <Markdown>{body}</Markdown>
      </div>
    </article>
  )
}
