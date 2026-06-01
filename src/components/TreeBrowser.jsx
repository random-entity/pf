import { NavLink } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { artworks, buildTree, titleOf } from '../lib/content.js'

function Node({ node, lang }) {
  const folders = [...node.children.values()].sort((a, b) => a.name.localeCompare(b.name))
  const files = [...node.files].sort((a, b) => titleOf(a, lang).localeCompare(titleOf(b, lang)))
  return (
    <ul>
      {folders.map((child) => (
        <li key={child.name}>
          <details open>
            <summary>{child.name}</summary>
            <Node node={child} lang={lang} />
          </details>
        </li>
      ))}
      {files.map((a) => (
        <li key={a.slug}>
          <NavLink
            to={`/artwork/${a.slug}`}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {titleOf(a, lang)}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

// File-browser style navigation mirroring the content folder structure.
export default function TreeBrowser() {
  const { lang } = useLang()
  const tree = buildTree(artworks)
  return (
    <div className="tree">
      <Node node={tree} lang={lang} />
    </div>
  )
}
