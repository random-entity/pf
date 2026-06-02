import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { remarkGallery } from '../lib/remarkGallery.js'

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
  // A link to YouTube becomes a responsive embedded player; everything else
  // stays a normal link.
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
    return (
      <a href={href} {...rest}>
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
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkGallery]}
      rehypePlugins={[rehypeSlug]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  )
}
