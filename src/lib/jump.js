// Shared "jump" machinery: constant-time smooth scrolling plus persistent jump
// highlights, used by search-result jumps, footnote forward/return jumps, and
// heading deep-links. Highlights persist until the user clicks somewhere with no
// link (or another jump replaces them) — not on a timeout.

// Custom Highlight API name for text-range (search) highlights.
const RANGE_HL = 'jump-highlight'
// Class applied to element highlights (footnote def / return arrow / index).
const EL_CLASS = 'jump-highlight'
// Height of the sticky topbar, so `block:'start'` targets clear it.
const TOPBAR = 48

let activeEls = []
let outsideClickInstalled = false

// Clear highlights when the user clicks anywhere that is not a link. Jump
// actions themselves run on links / footnote refs and stop propagation (or are
// links), so they never trigger this; only "click on empty space" does.
function installOutsideClickClear() {
  if (outsideClickInstalled) return
  outsideClickInstalled = true
  document.addEventListener('click', (e) => {
    if (e.target instanceof Element && e.target.closest('a')) return
    clearJumpHighlights()
  })
}

export function clearJumpHighlights() {
  for (const el of activeEls) el.classList.remove(EL_CLASS)
  activeEls = []
  if (window.CSS && CSS.highlights) CSS.highlights.delete(RANGE_HL)
}

// Highlight a set of elements (footnote definition, return arrow, index number).
// Replaces any previous jump highlight.
export function highlightElements(els) {
  installOutsideClickClear()
  clearJumpHighlights()
  for (const el of els) {
    if (!el) continue
    el.classList.add(EL_CLASS)
    activeEls.push(el)
  }
}

// Highlight a text Range (search match) via the Custom Highlight API (no DOM
// mutation). Replaces any previous jump highlight.
export function highlightRange(range) {
  installOutsideClickClear()
  clearJumpHighlights()
  if (window.CSS && CSS.highlights && window.Highlight) {
    CSS.highlights.set(RANGE_HL, new Highlight(range))
  }
}

// Constant-TIME smooth scroll (fixed duration regardless of distance), so short
// and long jumps feel equally snappy — unlike the browser's constant-speed
// `scrollIntoView({behavior:'smooth'})`.
let scrollRaf = null
export function scrollToY(targetY, { duration = 420 } = {}) {
  const scroller = document.scrollingElement || document.documentElement
  const vh = window.innerHeight
  const startY = scroller.scrollTop
  targetY = Math.max(0, Math.min(targetY, scroller.scrollHeight - vh))
  const dist = targetY - startY
  if (Math.abs(dist) < 1) return

  // Jump instantly when animation would be wrong or wasteful: reduced-motion
  // preference, or a hidden tab (rAF is paused there and would freeze mid-scroll).
  const reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion || document.hidden) {
    scroller.scrollTo(0, targetY)
    return
  }

  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  const t0 = performance.now()
  // easeInOutQuad
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
  const step = (now) => {
    const p = Math.min(1, (now - t0) / duration)
    scroller.scrollTo(0, startY + dist * ease(p))
    if (p < 1) scrollRaf = requestAnimationFrame(step)
    else scrollRaf = null
  }
  scrollRaf = requestAnimationFrame(step)
}

export function scrollToElement(el, { block = 'center', duration = 420 } = {}) {
  if (!el) return
  const vh = window.innerHeight
  const rect = el.getBoundingClientRect()
  const startY = (document.scrollingElement || document.documentElement).scrollTop

  let targetY
  if (block === 'start') targetY = startY + rect.top - TOPBAR
  else if (block === 'end') targetY = startY + rect.bottom - vh + 16
  else targetY = startY + rect.top - vh / 2 + rect.height / 2

  scrollToY(targetY, { duration })
}

// Forward jump: from a footnote reference (body, frontmatter, or enum pill) to
// its definition. Highlights the definition AND the specific return arrow that
// points back to where we came from (`fromId`), so the way back is visible.
export function jumpToFootnoteDef(label, fromId) {
  const li = document.getElementById(`user-content-fn-${label}`)
  if (!li) return
  scrollToElement(li, { block: 'center' })
  const arrow = fromId
    ? li.querySelector(`a[data-footnote-backref][href="#${CSS.escape(fromId)}"]`)
    : null
  highlightElements([li, arrow])
}

// Return jump: from a return arrow back to the original reference. Highlights the
// reference's index number (the <sup>, which wraps the <a> for body refs).
export function jumpToRef(refEl) {
  if (!refEl) return
  // A title footnote's reference lives in the sticky topbar (always pinned), so
  // scrolling *to* it is meaningless — scroll to the very top of the page instead.
  if (refEl.closest('.topbar')) scrollToY(0)
  else scrollToElement(refEl, { block: 'center' })
  highlightElements([refEl.closest('sup') || refEl])
}
