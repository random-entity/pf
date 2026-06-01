import { useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
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
  const { hash } = useLocation()

  // Deep-link: scroll to the heading named in the URL hash once the article
  // (with rehype-slug ids) has rendered. Re-runs when the target, artwork, or
  // language changes.
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = decodeURIComponent(hash.replace(/^#/, ''))
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash, slug, lang])

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
