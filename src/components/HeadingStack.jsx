import { useEffect, useState } from 'react'
import { scrollToElement } from '../lib/jump.js'

// Height of the sticky topbar (matches --topbar-height); the pinned stack sits
// just below it, so a heading is "current" once it scrolls under that line.
const TOPBAR = 40

// Read a heading's text WITHOUT the injected collapse marker (`▾ ##`), which
// Markdown.jsx prepends as a `.md-heading-marker` button after render.
function headingText(h) {
  let s = ''
  for (const n of h.childNodes) {
    if (n.nodeType === 1 && n.classList?.contains('md-heading-marker')) continue
    s += n.textContent
  }
  return s.trim()
}

// A pinned overlay that shows the current nested heading path of the article body
// as you scroll: the deepest heading that has scrolled under the topbar, plus its
// ancestor headings (by level), each clickable. Implemented as an overlay (a
// zero-height sticky wrapper + absolutely-positioned bar) so it never reflows the
// article and works with the flat heading DOM (no section wrappers, no DOM
// mutation). Mounted per work; re-inits on slug/lang change via its key.
export default function HeadingStack() {
  const [chain, setChain] = useState([])

  useEffect(() => {
    const root = document.querySelector('.article:not(.lead-media) .markdown-render')
    if (!root) return

    let raf = 0
    const update = () => {
      raf = 0
      // Visible headings in document order (skip ones inside collapsed sections).
      const headings = [...root.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(
        (h) => !h.hidden && h.offsetParent !== null,
      )
      if (!headings.length) return setChain([])

      const threshold = TOPBAR + 1
      // The current heading = the last one whose top has reached the pin line.
      let activeIdx = -1
      for (let i = 0; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top <= threshold) activeIdx = i
        else break
      }
      if (activeIdx === -1) return setChain([])

      // Walk back from the current heading collecting strictly-shallower
      // ancestors → the nested path (root … current).
      const out = []
      let level = Infinity
      for (let i = activeIdx; i >= 0; i--) {
        const l = Number(headings[i].tagName[1])
        if (l < level) {
          out.unshift({ id: headings[i].id, text: headingText(headings[i]), level: l })
          level = l
          if (l === 1) break
        }
      }
      setChain((prev) =>
        prev.length === out.length && prev.every((p, i) => p.id === out[i].id && p.text === out[i].text)
          ? prev
          : out,
      )
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Collapsing/expanding a section changes heading visibility + layout without
    // scrolling, so recompute after clicks in the article too.
    root.addEventListener('click', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      root.removeEventListener('click', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  if (!chain.length) return null
  const base = chain[0].level
  return (
    <div className="heading-stack-wrap">
      <div className="heading-stack">
        {chain.map((h, i) => (
          <button
            key={h.id || i}
            type="button"
            className="heading-stack-item"
            style={{ paddingLeft: (h.level - base) * 14 }}
            onClick={() => {
              const el = document.getElementById(h.id)
              if (el) scrollToElement(el, { block: 'start' })
            }}
          >
            {h.text}
          </button>
        ))}
      </div>
    </div>
  )
}
