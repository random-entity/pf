import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useParams, useLocation, Link, useOutletContext } from 'react-router-dom'
import { useLang, isLocalized } from '../i18n.jsx'
import { bySlug, titleOf } from '../lib/content.js'
import { prepare, stripFirstH1, wikiLinks, expandMultiLinks } from '../lib/markdown.js'
import Properties from '../components/Properties.jsx'
import Markdown from '../components/Markdown.jsx'

const HL_NAME = 'search-jump'

const FN_LABEL = '[A-Za-z0-9_-]+'
const FN_REF = new RegExp(`\\[\\^(${FN_LABEL})\\]`, 'g')

// Collect every footnote label referenced in a (possibly nested/localized)
// frontmatter value for the given language. Mirrors how Properties resolves a
// value to the strings it actually renders.
function collectFnLabels(value, lang, out) {
  if (value == null) return
  if (typeof value === 'string') {
    for (const m of value.matchAll(FN_REF)) out.add(m[1])
    return
  }
  if (Array.isArray(value)) {
    for (const v of value) collectFnLabels(v, lang, out)
    return
  }
  if (typeof value === 'object' && !(value instanceof Date)) {
    if (isLocalized(value)) {
      const picked =
        value[lang] ?? value.en ?? Object.values(value).find((v) => v != null)
      collectFnLabels(picked, lang, out)
    } else {
      for (const v of Object.values(value)) collectFnLabels(v, lang, out)
    }
  }
}

// Prepare the article body for rendering and reconcile footnotes. Two problems
// are handled here:
//
//  - remark-gfm only emits a footnote definition that is referenced *in the
//    body*, so a footnote cited only in the frontmatter (e.g. inside `credits`)
//    would be dropped. For those we append a hidden "seed" reference.
//  - Definitions live inside `::: lang` sections, so a footnote defined only in
//    (say) the English section has no definition once `pickLanguage` strips the
//    other fences. When a needed footnote lacks a current-language definition we
//    inject one from whichever language fence does define it.
//
// ArtworkPage's footnote effect then hides the seeds and keeps the real
// (frontmatter / body) citations as the backlink targets.
function footnotePlan(data, body, lang) {
  if (!data || body == null) return { body: '', seedLabels: [] }
  const prepared = data.title
    ? prepare(body, lang)
    : stripFirstH1(prepare(body, lang))

  const defRe = new RegExp(`^\\[\\^(${FN_LABEL})\\]:[ \\t]*(.*)$`, 'gm')
  // Definitions already available in the current language (its fence + shared).
  const presentDefs = new Set([...prepared.matchAll(defRe)].map((m) => m[1]))
  // References in the current language's body prose (excluding definition lines).
  const prose = prepared.replace(
    new RegExp(`^\\[\\^${FN_LABEL}\\]:.*$`, 'gm'),
    '',
  )
  const bodyRefs = new Set([...prose.matchAll(FN_REF)].map((m) => m[1]))
  // Footnote labels referenced in the frontmatter for the current language.
  const fmLabels = new Set()
  for (const [k, v] of Object.entries(data)) {
    if (k === 'title') continue
    collectFnLabels(v, lang, fmLabels)
  }

  // Every definition anywhere in the source (any language fence) — the
  // cross-language fallback. First one wins for a given label.
  const allDefs = new Map()
  for (const m of body.matchAll(defRe)) {
    if (!allDefs.has(m[1])) allDefs.set(m[1], m[2])
  }

  const needed = new Set([...fmLabels, ...bodyRefs])
  const hasDef = (l) => presentDefs.has(l) || allDefs.has(l)

  // Inject a fallback definition for any needed footnote the current language
  // doesn't define itself.
  const injected = []
  for (const label of needed) {
    if (!presentDefs.has(label) && allDefs.has(label)) {
      injected.push(`[^${label}]: ${expandMultiLinks(wikiLinks(allDefs.get(label)))}`)
    }
  }
  // Seed a hidden body reference for footnotes cited only in the frontmatter.
  const seedLabels = [...fmLabels].filter((l) => !bodyRefs.has(l) && hasDef(l))

  let out = prepared
  if (injected.length) out += `\n\n${injected.join('\n\n')}`
  if (seedLabels.length) out += `\n\n${seedLabels.map((l) => `[^${l}]`).join('')}`
  return { body: out, seedLabels }
}

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
  const plan = useMemo(
    () => footnotePlan(artwork?.data, artwork?.body, lang),
    [artwork, lang],
  )

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

  // Snippet jump. state = { jumpTo?, jumpOcc?, jumpLang?, jumpPropTo?, jumpPropOcc?, _t }.
  // jumpTo/jumpOcc target the article body; jumpPropTo/jumpPropOcc target the
  // properties block. `_t` is a nonce so repeated clicks re-run this.
  useEffect(() => {
    const { jumpTo, jumpPropTo, jumpLang, jumpOcc, jumpPropOcc } = state || {}
    if (!jumpTo && !jumpPropTo && !jumpLang) return

    // Switch language first; the effect re-runs after the re-render.
    if (jumpLang && jumpLang !== lang) { setLang(jumpLang); return }
    if (!jumpTo && !jumpPropTo) return

    const isProp = !!jumpPropTo
    const term = isProp ? jumpPropTo : jumpTo
    const occ = (isProp ? jumpPropOcc : jumpOcc) ?? 0

    let raf1
    let raf2
    let imgCleanup

    const jump = () => {
      const container = document.querySelector(isProp ? '.properties' : '.article')
      if (!container) return
      const built = buildRange(container, term, occ)
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

      // Images may shift layout in the article body; not relevant for props.
      if (!isProp) {
        const pending = [...container.querySelectorAll('img')].filter((im) => !im.complete)
        if (pending.length) {
          const onLoad = () => scroll(false)
          pending.forEach((im) => im.addEventListener('load', onLoad))
          const stop = setTimeout(() => pending.forEach((im) => im.removeEventListener('load', onLoad)), 5000)
          imgCleanup = () => { clearTimeout(stop); pending.forEach((im) => im.removeEventListener('load', onLoad)) }
        }
      }
    }

    // Two frames so React has painted the (possibly re-rendered) content.
    raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(jump) })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      if (imgCleanup) imgCleanup()
    }
  }, [state?._t, state?.jumpTo, state?.jumpPropTo, state?.jumpOcc, state?.jumpPropOcc, state?.jumpLang, lang, slug])

  // Footnotes are numbered by order of appearance across the whole page rather
  // than by their literal [^label]. Frontmatter property values render before the
  // article body, so a single document-order pass over every reference (the
  // frontmatter <sup data-fn-ref> markers and the body's remark-gfm refs) yields
  // the right order. We then (1) renumber every reference, (2) reorder the
  // definition list to match, and (3) rebuild each definition's ↩ backlinks in
  // appearance order — so a footnote first cited in the frontmatter gets index 1
  // and its first backlink points back to the frontmatter, not the body.
  useLayoutEffect(() => {
    const articleEl = document.querySelector('article')
    if (!articleEl) return

    const labelOf = (el) => {
      if (el.matches('sup[data-fn-ref]')) return el.getAttribute('data-fn-ref')
      const m = (el.getAttribute('href') || '').match(/#user-content-fn-(.+)$/)
      return m ? decodeURIComponent(m[1]) : null
    }
    const defOf = (label) => document.getElementById(`user-content-fn-${label}`)

    // References in document order (frontmatter markers + body refs).
    const seedSet = new Set(plan.seedLabels)
    const refs = [...articleEl.querySelectorAll('sup[data-fn-ref], a[data-footnote-ref]')]
    const number = new Map() // label -> display index (first appearance)
    const occ = new Map() // label -> [ref elements in appearance order]
    for (const el of refs) {
      const label = labelOf(el)
      if (!label) continue
      // Hidden seed reference appended for a footnote cited only in the
      // frontmatter — it exists solely so remark-gfm emits the definition.
      // Hide it and don't let it count as a citation.
      if (seedSet.has(label) && el.matches('a[data-footnote-ref]')) {
        el.closest('p')?.style.setProperty('display', 'none')
        continue
      }
      if (!defOf(label)) continue // skip refs without a definition
      if (!number.has(label)) number.set(label, number.size + 1)
      if (!occ.has(label)) occ.set(label, [])
      occ.get(label).push(el)
    }
    if (number.size === 0) return

    // (1) Renumber each reference and give it a unique backref-target id.
    for (const [label, els] of occ) {
      const num = number.get(label)
      els.forEach((el, i) => {
        el.id = `fnback-${label}-${i + 1}`
        el.textContent = String(num)
      })
    }

    const ol = articleEl.querySelector('.footnotes ol')
    if (!ol) return

    // (2) Reorder the definition list to match appearance order. The <ol>
    // renumbers its markers by position, so this also fixes the visible indices.
    for (const label of number.keys()) {
      const li = defOf(label)
      if (li) ol.appendChild(li)
    }

    // (3) Rebuild ↩ backlinks in appearance order.
    for (const [label, els] of occ) {
      const li = defOf(label)
      if (!li) continue
      const ps = li.querySelectorAll('p')
      const p = ps[ps.length - 1] || li
      p.querySelectorAll('a[data-footnote-backref]').forEach((a) => a.remove())
      els.forEach((_el, i) => {
        const a = document.createElement('a')
        a.href = `#fnback-${label}-${i + 1}`
        a.setAttribute('data-footnote-backref', '')
        a.setAttribute('aria-label', `Back to reference ${i + 1}`)
        a.className = 'data-footnote-backref'
        a.textContent = '↩'
        if (i > 0) {
          const s = document.createElement('sup')
          s.textContent = String(i + 1)
          a.appendChild(s)
        }
        p.append(' ', a)
      })
    }
  }, [artwork, lang])

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
        <Markdown>{plan.body}</Markdown>
      </div>
    </article>
  )
}
