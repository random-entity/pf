import { useEffect, useRef } from 'react'
import { useParams, useLocation, Link, useOutletContext } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { bySlug, titleOf } from '../lib/content.js'
import { prepare, stripFirstH1 } from '../lib/markdown.js'
import Properties from '../components/Properties.jsx'
import Markdown from '../components/Markdown.jsx'

const HL_NAME = 'search-jump'

function clearHighlight() {
  if (window.CSS && CSS.highlights) CSS.highlights.delete(HL_NAME)
}

// Build a DOM Range over the `occ`-th occurrence of `query` inside `container`,
// by concatenating every text node (so a match spanning element boundaries,
// e.g. across a bold span or footnote ref, is still found) and mapping the
// char offset back to (node, offset). No DOM mutation.
function buildRange(container, query, occ) {
  const q = (query || '').toLowerCase()
  if (!q || !container) return null

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  const segs = []
  let node
  let total = 0
  while ((node = walker.nextNode())) {
    const len = node.textContent.length
    if (len) segs.push({ node, from: total, to: total + len })
    total += len
  }
  const full = segs.map((s) => s.node.textContent).join('').toLowerCase()

  // Locate the occ-th occurrence; fall back to the first.
  let idx = -1
  let count = 0
  let from = 0
  while (true) {
    const found = full.indexOf(q, from)
    if (found === -1) break
    if (count === occ) { idx = found; break }
    count++
    from = found + q.length
  }
  if (idx === -1) idx = full.indexOf(q)
  if (idx === -1) return null

  const endIdx = idx + q.length
  const startSeg = segs.find((s) => s.from <= idx && s.to > idx)
  const endSeg = segs.find((s) => s.from < endIdx && s.to >= endIdx) || startSeg
  if (!startSeg) return null

  const range = document.createRange()
  range.setStart(startSeg.node, idx - startSeg.from)
  range.setEnd(endSeg.node, Math.min(endIdx - endSeg.from, endSeg.node.textContent.length))
  return { range, el: startSeg.node.parentElement }
}

export default function ArtworkPage() {
  const { lang, t, setLang } = useLang()
  const { setPageTitle } = useOutletContext()
  const params = useParams()
  const slug = decodeURI(params['*'] || '')
  const artwork = bySlug[slug]
  const { hash, state } = useLocation()
  const hlTimer = useRef(null)

  useEffect(() => {
    setPageTitle(artwork ? titleOf(artwork, lang) : '')
    return () => setPageTitle('')
  }, [artwork, lang, setPageTitle])

  // Heading deep-link via URL hash.
  useEffect(() => {
    if (state?.jumpTo) return
    if (!hash) { window.scrollTo(0, 0); return }
    const id = decodeURIComponent(hash.replace(/^#/, ''))
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash, slug, lang, state?.jumpTo])

  // Snippet jump. state = { jumpTo?, jumpOcc?, jumpLang?, _t }.
  // `_t` is a nonce so repeated clicks (even on the same text) re-run this.
  useEffect(() => {
    const { jumpTo, jumpLang, jumpOcc } = state || {}
    if (!jumpTo && !jumpLang) return

    // Switch language first; the effect re-runs after the re-render.
    if (jumpLang && jumpLang !== lang) { setLang(jumpLang); return }
    if (!jumpTo) return

    let raf1
    let raf2
    let imgCleanup

    const jump = () => {
      const container = document.querySelector('.article')
      if (!container) return
      const built = buildRange(container, jumpTo, jumpOcc ?? 0)
      if (!built) return
      const { range, el } = built

      // Highlight the exact match without mutating the DOM (Custom Highlight API).
      clearHighlight()
      if (window.CSS && CSS.highlights && window.Highlight) {
        CSS.highlights.set(HL_NAME, new Highlight(range))
        if (hlTimer.current) clearTimeout(hlTimer.current)
        hlTimer.current = setTimeout(clearHighlight, 2600)
      }

      // Scroll the containing element to center.
      const scroll = (smooth) =>
        el?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' })
      scroll(true)

      // Images above the target may still be loading and shift layout; re-center
      // (instantly) as each finishes, for a few seconds.
      const pending = [...container.querySelectorAll('img')].filter((im) => !im.complete)
      if (pending.length) {
        const onLoad = () => scroll(false)
        pending.forEach((im) => im.addEventListener('load', onLoad))
        const stop = setTimeout(() => pending.forEach((im) => im.removeEventListener('load', onLoad)), 5000)
        imgCleanup = () => { clearTimeout(stop); pending.forEach((im) => im.removeEventListener('load', onLoad)) }
      }
    }

    // Two frames so React has painted the (possibly re-rendered) article.
    raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(jump) })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      if (imgCleanup) imgCleanup()
    }
  }, [state?._t, state?.jumpTo, state?.jumpOcc, state?.jumpLang, lang, slug])

  // Drop the highlight on unmount.
  useEffect(() => () => { clearHighlight(); if (hlTimer.current) clearTimeout(hlTimer.current) }, [])

  if (!artwork) {
    return (
      <p className="muted">
        {t('notFound')} <Link to="/">{t('home')}</Link>
      </p>
    )
  }

  return (
    <article>
      <Properties data={artwork.data} />
      <div className="article">
        <Markdown>{artwork.data.title ? prepare(artwork.body, lang) : stripFirstH1(prepare(artwork.body, lang))}</Markdown>
      </div>
    </article>
  )
}
