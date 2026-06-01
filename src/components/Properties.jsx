import { Link } from 'react-router-dom'
import { useLang, loc, isLocalized } from '../i18n.jsx'

// Renders any frontmatter value: localized strings, plain scalars, arrays
// (as lists), and nested JSON objects (as key/value grids). Tags get linked
// to the database view filtered by that tag.
function Value({ value, propKey }) {
  const { lang } = useLang()

  if (value == null || value === '') return <span className="muted">—</span>

  // dates (YAML parses ISO dates into Date objects)
  if (value instanceof Date) {
    return <span>{value.toLocaleDateString(lang)}</span>
  }

  // localized object -> single string
  if (isLocalized(value)) return <span>{loc(value, lang)}</span>

  // arrays -> list (tags rendered as linked pills)
  if (Array.isArray(value)) {
    if (propKey === 'tags') {
      return (
        <span className="taglist">
          {value.map((t, i) => (
            <Link key={i} className="tag" to={`/?tag=${encodeURIComponent(t)}`}>
              {String(t)}
            </Link>
          ))}
        </span>
      )
    }
    return (
      <ul>
        {value.map((v, i) => (
          <li key={i}>
            <Value value={v} />
          </li>
        ))}
      </ul>
    )
  }

  // nested object -> key/value grid
  if (typeof value === 'object') {
    return (
      <span className="nested">
        {Object.entries(value).map(([k, v]) => (
          <span key={k} style={{ display: 'contents' }}>
            <span className="nkey">{k}</span>
            <Value value={v} />
          </span>
        ))}
      </span>
    )
  }

  // scalar
  return <span>{String(value)}</span>
}

// Obsidian-style "Properties" block driven entirely by frontmatter.
// `title` is shown as the page heading elsewhere, so it is skipped here.
export default function Properties({ data }) {
  const { propLabel } = useLang()
  const entries = Object.entries(data).filter(([k]) => k !== 'title')
  if (entries.length === 0) return null

  return (
    <div className="properties">
      {entries.map(([key, value]) => (
        <div className="prop" key={key}>
          <div className="key">{propLabel(key)}</div>
          <div className="val">
            <Value value={value} propKey={key} />
          </div>
        </div>
      ))}
    </div>
  )
}
