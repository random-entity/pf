import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { visit } from 'unist-util-visit'
import { remarkGallery } from '../lib/remarkGallery.js'

// remark-math v6 treats single-line $$...$$ as inline math even in a standalone
// paragraph. This rehype plugin runs before rehype-katex and promotes any <p>
// whose only child is a <code class="math math-inline"> element into a
// <div class="math math-display"> so rehype-katex renders it in display mode.
function rehypeMathDisplay() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (
        node.tagName === 'p' &&
        node.children.length === 1 &&
        node.children[0].type === 'element' &&
        node.children[0].tagName === 'code' &&
        node.children[0].properties?.className?.includes('math-inline')
      ) {
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['math', 'math-display'] },
          children: node.children[0].children,
        }
      }
    })
  }
}

// Prefix relative asset URLs with Vite's base so images resolve correctly
// on GitHub Pages. Absolute URLs and hash routes are left untouched.
function asset(src) {
  if (!src) return src
  if (/^(https?:)?\/\//.test(src) || src.startsWith('#') || src.startsWith('data:')) return src
  return import.meta.env.BASE_URL + src.replace(/^\.?\//, '')
}

// Extract a YouTube video id from common URL shapes.
function youTubeId(href = '') {
  const m = href.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return m ? m[1] : null
}

const components = {
  img: ({ src, alt, ...rest }) => <img src={asset(src)} alt={alt ?? ''} loading="lazy" {...rest} />,
  // Canvas elements with animation initialization
  canvas: ({ id, ...props }) => {
    const canvasRef = useRef(null)
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      let size = 20
      let rx = 8
      let ry = 2

      let posX = canvas.width / 2
      let posY = canvas.height / 2 - size
      let angle = 0

      const FPS = 24
      const FRAME_INTERVAL = 1000 / FPS

      function drawFlower() {
        ctx.fillStyle = 'gray'
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(posX, posY, size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }

      function animate() {
        drawFlower()
        posX += rx * Math.cos(angle)
        posY += ry * Math.sin(angle)
        angle += 0.1
      }

      const intervalId = setInterval(animate, FRAME_INTERVAL)
      animate()

      return () => clearInterval(intervalId)
    }, [])

    return <canvas ref={canvasRef} id={id} {...props} />
  },
  // A link to YouTube becomes a responsive embedded player; everything else
  // stays a normal link (external links open in new tab).
  a: ({ href, children, ...rest }) => {
    const id = youTubeId(href || '')
    if (id) {
      return (
        <span className="video">
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title={typeof children === 'string' ? children : 'YouTube video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </span>
      )
    }
    const isExternal = href && !href.startsWith('#') && !href.startsWith('/')
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {children}
      </a>
    )
  },
}

// remark-gfm provides footnotes ([^1]) and tables. rehype-slug adds an `id` to
// each heading (matching lib/markdown.js's slugs) so the database outline can
// deep-link to a heading. Wikilinks are pre-rewritten into plain markdown links
// upstream (see lib/markdown.js).
export default function Markdown({ children }) {
  const ref = useRef(null)
  const highlightTimer = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const findLocalTarget = (href) => {
      if (!href?.startsWith('#') || href.startsWith('#/')) return null
      const id = decodeURIComponent(href.slice(1))
      return document.getElementById(id) || document.getElementById(id.replace(/^user-content-/, ''))
    }

    const highlightTarget = (target) => {
      const highlight = target.closest('.footnotes li') || target.closest('sup') || target
      root.querySelectorAll('.md-jump-highlight').forEach((el) => el.classList.remove('md-jump-highlight'))
      if (highlightTimer.current) clearTimeout(highlightTimer.current)
      highlight.classList.add('md-jump-highlight')
      highlightTimer.current = setTimeout(() => {
        highlight.classList.remove('md-jump-highlight')
        highlightTimer.current = null
      }, 2600)
    }

    // React StrictMode runs effects twice in development. Remove previously
    // injected controls before rebuilding them so they never become inert.
    for (const old of root.querySelectorAll('.md-collapse-toggle')) old.remove()
    for (const old of root.querySelectorAll('.md-heading-marker')) old.remove()

    const makeToggle = ({ label, kind }) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = `md-collapse-toggle md-collapse-${kind}`
      button.setAttribute('aria-label', label)
      button.setAttribute('aria-expanded', 'true')
      button.textContent = '•'
      return button
    }

    const setExpanded = (button, expanded) => {
      button.setAttribute('aria-expanded', String(expanded))
      if (button.classList.contains('md-collapse-heading')) {
        const hashes = button.dataset.hashes || ''
        button.textContent = `${expanded ? '▾' : '▸'} ${hashes}`
      } else {
        button.textContent = expanded ? '•' : '◉'
      }
    }

    for (const heading of root.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
      const level = Number(heading.tagName.slice(1))
      let sibling = heading.nextElementSibling
      let hasSection = false
      while (sibling) {
        if (/^H[1-6]$/.test(sibling.tagName) && Number(sibling.tagName.slice(1)) <= level) break
        hasSection = true
        sibling = sibling.nextElementSibling
      }
      if (!hasSection) continue

      const hashes = '#'.repeat(level)
      const marker = document.createElement('button')
      marker.type = 'button'
      marker.className = 'md-heading-marker md-collapse-toggle md-collapse-heading'
      marker.setAttribute('aria-label', 'Collapse section')
      marker.setAttribute('aria-expanded', 'true')
      marker.dataset.hashes = hashes
      marker.textContent = `▾ ${hashes}`
      heading.prepend(marker)
    }

    for (const item of root.querySelectorAll('li')) {
      const nestedLists = [...item.children].filter((child) => child.tagName === 'UL' || child.tagName === 'OL')
      if (nestedLists.length === 0) continue

      const button = makeToggle({ label: 'Collapse nested list', kind: 'list' })
      item.prepend(button)
    }

    const onClick = (event) => {
      if (!(event.target instanceof Element)) return

      const localLink = event.target.closest('a[href^="#"]')
      if (localLink && root.contains(localLink) && !localLink.getAttribute('href')?.startsWith('#/')) {
        const target = findLocalTarget(localLink.getAttribute('href'))
        if (target) {
          event.preventDefault()
          event.stopPropagation()
          target.scrollIntoView({ behavior: 'smooth', block: 'center' })
          target.focus?.({ preventScroll: true })
          highlightTarget(target)
        }
        return
      }

      // Direct click on a toggle, or click anywhere on a collapsible heading
      let button = event.target.closest('.md-collapse-toggle')
      if (!button) {
        const heading = event.target.closest('h1, h2, h3, h4, h5, h6')
        if (heading && root.contains(heading))
          button = heading.querySelector('.md-collapse-heading')
      }
      if (!button || !root.contains(button)) return

      event.preventDefault()
      event.stopPropagation()

      const expanded = button.getAttribute('aria-expanded') !== 'true'
      if (button.classList.contains('md-collapse-heading')) {
        const heading = button.parentElement
        const level = Number(heading.tagName.slice(1))
        let sibling = heading.nextElementSibling
        while (sibling) {
          if (/^H[1-6]$/.test(sibling.tagName) && Number(sibling.tagName.slice(1)) <= level) break
          sibling.hidden = !expanded
          if (expanded) delete sibling.dataset.mdCollapsed
          else sibling.dataset.mdCollapsed = 'true'
          sibling = sibling.nextElementSibling
        }
      } else {
        const item = button.parentElement
        for (const list of item.children) {
          if (list.tagName === 'UL' || list.tagName === 'OL') {
            list.hidden = !expanded
            if (expanded) delete list.dataset.mdCollapsed
            else list.dataset.mdCollapsed = 'true'
          }
        }
      }

      setExpanded(button, expanded)
    }

    root.addEventListener('click', onClick)
    return () => {
      root.removeEventListener('click', onClick)
      if (highlightTimer.current) clearTimeout(highlightTimer.current)
      root.querySelectorAll('.md-jump-highlight').forEach((el) => el.classList.remove('md-jump-highlight'))
      for (const el of root.querySelectorAll('[data-md-collapsed="true"]')) {
        el.hidden = false
        delete el.dataset.mdCollapsed
      }
      for (const marker of root.querySelectorAll('.md-heading-marker')) marker.remove()
      for (const button of root.querySelectorAll('.md-collapse-toggle')) button.remove()
    }
  }, [children])

  return (
    <div ref={ref} className="markdown-render">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkGallery]}
        rehypePlugins={[rehypeMathDisplay, rehypeKatex, rehypeRaw, rehypeSlug]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
