import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Prefix relative asset URLs with Vite's base so images resolve correctly
// on GitHub Pages. Absolute URLs and hash routes are left untouched.
function asset(src) {
  if (!src) return src
  if (/^(https?:)?\/\//.test(src) || src.startsWith('#') || src.startsWith('data:')) return src
  return import.meta.env.BASE_URL + src.replace(/^\.?\//, '')
}

const components = {
  img: ({ src, alt, ...rest }) => <img src={asset(src)} alt={alt ?? ''} loading="lazy" {...rest} />,
}

// remark-gfm provides footnotes ([^1]) and tables. Wikilinks are pre-rewritten
// into plain markdown links upstream (see lib/markdown.js).
export default function Markdown({ children }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  )
}
