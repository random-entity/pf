import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
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
    </div>
  )
}
