import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'

// Walk up from `el` to find a footnote reference and return its label, or null.
// Handles both:
//   <sup data-fn-ref="label">          — frontmatter / enum-pill refs
//   <a data-footnote-ref href="#user-content-fn-label">  — body refs (remark-gfm)
function labelFromEl(el) {
  let cur = el
  while (cur && cur !== document.body) {
    if (cur.dataset?.fnRef) return cur.dataset.fnRef
    if (cur.tagName === 'A' && cur.hasAttribute('data-footnote-ref')) {
      const m = (cur.getAttribute('href') || '').match(/^#user-content-fn-(.+)$/)
      if (m) return decodeURIComponent(m[1])
    }
    cur = cur.parentElement
  }
  return null
}

// Return the cleaned innerHTML of the footnote definition <li>, or null if not
// found. The backref anchors (<a data-footnote-backref>, ↩) are navigation aids,
// not content, so they are removed. We remove ONLY the anchors — never adjacent
// text nodes: a footnote whose text ends right before the first backref keeps all
// its content in that single preceding text node, so deleting it would blank the
// popup. The leftover separating spaces are harmless (trimmed / negligible).
function footnoteHtml(label) {
  const li = document.getElementById(`user-content-fn-${label}`)
  if (!li) return null
  const clone = li.cloneNode(true)
  clone.querySelectorAll('a[data-footnote-backref]').forEach((a) => a.remove())
  return clone.innerHTML.trim() || null
}

const POPUP_MAX_W = 300
const GAP = 8         // px gap between anchor element and popup
const MARGIN = 10     // px min distance from viewport edges

export default function FootnotePreview() {
  const [popup, setPopup] = useState(null) // { label, html, rect } | null
  const [pos, setPos] = useState(null)     // { left, top } once measured | null
  const boxRef = useRef(null)
  const hideTimer = useRef(null)

  // Position AFTER render, using the popup's real measured size, so the
  // above/below decision and the viewport clamping account for the actual
  // (dynamic) height — a short popup near the top stays above; a tall one flips
  // below; either way it never spills past a viewport edge.
  useLayoutEffect(() => {
    if (!popup || !boxRef.current) return
    const { rect } = popup
    const w = boxRef.current.offsetWidth
    const h = boxRef.current.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight

    const left = Math.max(MARGIN, Math.min(rect.left + rect.width / 2 - w / 2, vw - w - MARGIN))

    // Prefer above; flip below only if the popup doesn't fit above.
    let top = rect.top - GAP - h
    if (top < MARGIN) {
      const below = rect.bottom + GAP
      // Use below if it fits; otherwise pick whichever side has more room, clamped.
      top = below + h <= vh - MARGIN ? below : Math.max(MARGIN, vh - MARGIN - h)
    }
    setPos({ left, top })
  }, [popup])

  useEffect(() => {
    const show = (label, anchorEl) => {
      const html = footnoteHtml(label)
      if (!html) return
      const rect = anchorEl.getBoundingClientRect()
      clearTimeout(hideTimer.current)
      setPos(null) // re-measure for the new anchor before showing
      setPopup({ label, html, rect })
    }

    const scheduleHide = () => {
      hideTimer.current = setTimeout(() => setPopup(null), 120)
    }

    const onOver = (e) => {
      const label = labelFromEl(e.target)
      if (!label) return
      // Find the actual ref element (the one with the data attribute / href).
      const anchor =
        e.target.closest('[data-fn-ref]') ||
        e.target.closest('a[data-footnote-ref]')
      if (anchor) show(label, anchor)
    }

    const onOut = (e) => {
      if (labelFromEl(e.target)) scheduleHide()
    }

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      clearTimeout(hideTimer.current)
    }
  }, [])

  if (!popup) return null

  return createPortal(
    <div
      ref={boxRef}
      className="fn-preview"
      style={{
        maxWidth: POPUP_MAX_W,
        left: pos ? pos.left : 0,
        top: pos ? pos.top : 0,
        // Hidden until measured/positioned to avoid a one-frame flash at (0,0).
        visibility: pos ? 'visible' : 'hidden',
      }}
      onMouseEnter={() => clearTimeout(hideTimer.current)}
      onMouseLeave={() => setPopup(null)}
      // Safe: HTML originates from our own remark-gfm render, never user input.
      dangerouslySetInnerHTML={{ __html: popup.html }}
    />,
    document.body,
  )
}
