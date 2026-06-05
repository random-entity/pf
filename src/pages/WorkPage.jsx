import { useEffect, useLayoutEffect, useMemo } from 'react'
import { useParams, useLocation, Link, useOutletContext } from 'react-router-dom'
import { useLang, isLocalized } from '../i18n.jsx'
import { bySlug, titleOf } from '../lib/content.js'
import { prepare, stripFirstH1, wikiLinks, expandMultiLinks } from '../lib/markdown.js'
import { typeForPath } from '../lib/schema.js'
import Properties from '../components/Properties.jsx'
import Markdown from '../components/Markdown.jsx'
import { scrollToElement, highlightRange, clearJumpHighlights } from '../lib/jump.js'

const FN_LABEL = '[A-Za-z0-9_-]+'
const FN_REF = new RegExp(`\\[\\^(${FN_LABEL})\\]`, 'g')

// Collect footnote labels in an enum value (string, array, or localized
// object), in pill render order, for the given language. Enum pills render their
// label text — including footnote refs as superscripts — so these must be seeded
// and numbered too, just like text leaves.
function collectEnumRefs(value, lang, out) {
  if (value == null) return
  if (Array.isArray(value)) {
    for (const v of value) collectEnumRefs(v, lang, out)
    return
  }
  const str = isLocalized(value)
    ? value[lang] ?? value.en ?? Object.values(value).find((v) => v != null) ?? ''
    : String(value)
  for (const m of String(str).matchAll(FN_REF)) out.push(m[1])
}

// Collect footnote labels referenced in a (possibly nested/localized)
// frontmatter value, in the order Properties renders them, for the given
// language. Returns an array (with repeats). Mirrors `Value` in Properties:
// `text` leaves and `enum` pills render footnote refs (text via inline markdown,
// enum via the pill superscript), so both are collected; date/number/duration
// paths are skipped; arrays keep their path; localized objects pick one string.
function collectFrontmatterRefs(value, lang, path, out) {
  if (value == null) return
  if (path) {
    const ty = typeForPath(path)
    if (ty === 'enum') { collectEnumRefs(value, lang, out); return }
    if (ty === 'date' || ty === 'number' || ty === 'duration') return
  }
  if (typeof value === 'string') {
    for (const m of value.matchAll(FN_REF)) out.push(m[1])
    return
  }
  if (Array.isArray(value)) {
    for (const v of value) collectFrontmatterRefs(v, lang, path, out)
    return
  }
  if (typeof value === 'object' && !(value instanceof Date)) {
    if (isLocalized(value)) {
      const picked =
        value[lang] ?? value.en ?? Object.values(value).find((v) => v != null)
      collectFrontmatterRefs(picked, lang, path, out)
    } else {
      for (const [k, v] of Object.entries(value)) {
        collectFrontmatterRefs(v, lang, path ? `${path}.${k}` : k, out)
      }
    }
  }
}

// Prepare the article body for rendering and reconcile footnotes WITHOUT mutating
// React-owned DOM (a previous version reordered <li>s / rebuilt backref <a>s in a
// layout effect, which corrupted React's tree and crashed on navigation). Two
// things are handled here, both by adjusting the markdown remark-gfm sees:
//
//  - Cross-language definitions: definitions live inside `::: lang` sections, so a
//    footnote defined only in (say) English has no definition once `pickLanguage`
//    strips the other fences. We inject a fallback definition from whichever fence
//    does define it.
//  - Appearance-order numbering + frontmatter backlinks: remark-gfm numbers and
//    orders footnotes by first reference in the body, and emits one backref per
//    reference. So we PREPEND one hidden "seed" reference per frontmatter citation
//    (in render order) inside a `.fn-seeds` wrapper (display:none). remark then
//    numbers them frontmatter-first and gives each a backref; WorkPage's effect
//    only retargets those leading backrefs at the real frontmatter citations
//    (an attribute change — safe for React).
function footnotePlan(data, body, lang) {
  if (!data || body == null) return { body: '' }
  const prepared = data.title
    ? prepare(body, lang)
    : stripFirstH1(prepare(body, lang))

  const defRe = new RegExp(`^\\[\\^(${FN_LABEL})\\]:[ \\t]*(.*)$`, 'gm')
  // Definitions already available in the current language (its fence + shared).
  const presentDefs = new Set([...prepared.matchAll(defRe)].map((m) => m[1]))
  // Every definition anywhere in the source (any fence) — cross-language fallback.
  const allDefs = new Map()
  for (const m of body.matchAll(defRe)) {
    if (!allDefs.has(m[1])) allDefs.set(m[1], m[2])
  }
  const hasDef = (l) => presentDefs.has(l) || allDefs.has(l)

  // Footnote citations in the frontmatter, in render order.
  const fmRefs = []
  for (const [k, v] of Object.entries(data)) {
    if (k === 'title') continue
    collectFrontmatterRefs(v, lang, k, fmRefs)
  }

  // References in the current language's body prose (excluding definition lines).
  const prose = prepared.replace(new RegExp(`^\\[\\^${FN_LABEL}\\]:.*$`, 'gm'), '')
  const bodyRefs = new Set([...prose.matchAll(FN_REF)].map((m) => m[1]))

  // Inject fallback definitions for footnotes the current language lacks.
  const injected = []
  for (const label of new Set([...fmRefs, ...bodyRefs])) {
    if (!presentDefs.has(label) && allDefs.has(label)) {
      injected.push(`[^${label}]: ${expandMultiLinks(wikiLinks(allDefs.get(label)))}`)
    }
  }

  // One hidden seed reference per defined frontmatter citation, in order.
  const seeds = fmRefs.filter(hasDef).map((l) => `[^${l}]`).join('')

  let out = prepared
  if (seeds) out = `<div class="fn-seeds">\n\n${seeds}\n\n</div>\n\n${out}`
  if (injected.length) out += `\n\n${injected.join('\n\n')}`
  return { body: out }
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

export default function WorkPage() {
  const { lang, t, setLang } = useLang()
  const { setPageTitle } = useOutletContext()
  const params = useParams()
  const slug = decodeURI(params['*'] || '')
  const work = bySlug[slug]
  const { hash, state } = useLocation()
  const plan = useMemo(
    () => footnotePlan(work?.data, work?.body, lang),
    [work, lang],
  )

  useEffect(() => {
    setPageTitle(work ? titleOf(work, lang) : '')
    return () => setPageTitle('')
  }, [work, lang, setPageTitle])

  // Heading deep-link via URL hash.
  useEffect(() => {
    if (state?.jumpTo) return
    if (!hash) { window.scrollTo(0, 0); return }
    const id = decodeURIComponent(hash.replace(/^#/, ''))
    const el = document.getElementById(id)
    if (el) scrollToElement(el, { block: 'start' })
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
      // Persists until the user clicks an empty area (handled by jump.js).
      highlightRange(range)

      // Scroll the containing element to center (constant-time).
      const scroll = () => scrollToElement(el, { block: 'center' })
      scroll()

      // Images may shift layout in the article body; not relevant for props.
      if (!isProp) {
        const pending = [...container.querySelectorAll('img')].filter((im) => !im.complete)
        if (pending.length) {
          const onLoad = () => scroll()
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

  // Footnotes are numbered by order of appearance, frontmatter-first. The heavy
  // lifting (ordering, numbering, one backref per citation) is done natively by
  // remark-gfm via the hidden seed references prepended in `footnotePlan`, so this
  // effect only makes ATTRIBUTE changes — never structural ones — which React
  // tolerates across re-renders and unmount:
  //   1. show the resolved number on each frontmatter citation and give it an id;
  //   2. point each definition's leading backrefs (the seeds, emitted first) at
  //      those frontmatter citations instead of the hidden seeds.
  useLayoutEffect(() => {
    const articleEl = document.querySelector('article')
    if (!articleEl) return
    const ol = articleEl.querySelector('.footnotes ol')
    if (!ol) return

    // Display number per label = its definition's position in the list.
    const numByLabel = new Map()
    ;[...ol.children].forEach((li, i) => {
      const m = (li.id || '').match(/^user-content-fn-(.+)$/)
      if (m) numByLabel.set(decodeURIComponent(m[1]), i + 1)
    })

    // Frontmatter citations: show the number, expose a backref target id.
    const fmByLabel = new Map()
    for (const sup of articleEl.querySelectorAll('.properties sup[data-fn-ref]')) {
      const label = sup.getAttribute('data-fn-ref')
      const num = numByLabel.get(label)
      if (num == null) continue // no definition anywhere → leave the literal label
      if (!fmByLabel.has(label)) fmByLabel.set(label, [])
      const ids = fmByLabel.get(label)
      const id = `fnref-fm-${label}-${ids.length + 1}`
      sup.id = id
      sup.textContent = String(num)
      ids.push(id)
    }

    // Each definition's first N backrefs correspond to the N seed references
    // (one per frontmatter citation, emitted before any body citation). Retarget
    // them at the real frontmatter <sup>s.
    for (const [label, ids] of fmByLabel) {
      const li = document.getElementById(`user-content-fn-${label}`)
      if (!li) continue
      const backs = li.querySelectorAll('a[data-footnote-backref]')
      ids.forEach((id, i) => {
        if (backs[i]) backs[i].setAttribute('href', `#${id}`)
      })
    }
  }, [work, lang])

  // Drop any jump highlight on unmount.
  useEffect(() => () => clearJumpHighlights(), [])

  if (!work) {
    return (
      <p className="muted">
        {t('notFound')} <Link to="/">{t('home')}</Link>
      </p>
    )
  }

  return (
    <article>
      <Properties data={work.data} />
      <div className="article">
        {/* Key by slug+lang so the body remounts on navigation. Without this,
            React reuses the same <img> nodes and only swaps `src`, so the
            previous page's image stays painted until the new one finishes
            downloading (very visible over the network on GitHub Pages). Fresh
            nodes start empty instead of showing the stale image. */}
        <Markdown key={`${slug}|${lang}`}>{plan.body}</Markdown>
      </div>
    </article>
  )
}
