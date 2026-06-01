import { useNavigate } from 'react-router-dom'
import { useLang, loc, isLocalized } from '../i18n.jsx'
import { isEnumFacet, canonicalOf, labelOf, durationSeconds, formatDuration } from '../lib/properties.js'
import { useFilters } from '../filters.jsx'

// A single enum value rendered as a pill that toggles its facet filter and
// jumps to the (filtered) home list.
function EnumPill({ path, value }) {
  const { lang } = useLang()
  const { enums, toggleEnum } = useFilters()
  const navigate = useNavigate()
  const id = canonicalOf(value)
  const active = enums[path]?.ids.includes(id)
  return (
    <button
      className="tag"
      aria-pressed={!!active}
      onClick={() => {
        toggleEnum(path, id)
        navigate('/')
      }}
    >
      {labelOf(value, lang)}
    </button>
  )
}

// Renders any frontmatter value: localized strings, plain scalars, arrays
// (as lists), and nested JSON objects (as key/value grids). Values that map to
// an enum facet become clickable filter pills. `path` is the dotted facet path.
function Value({ value, path }) {
  const { lang } = useLang()

  if (value == null || value === '') return <span className="muted">—</span>

  // Enum-backed values become clickable filter pills.
  if (path && isEnumFacet(path)) {
    if (Array.isArray(value)) {
      return (
        <span className="taglist">
          {value.map((v, i) => (
            <EnumPill key={i} path={path} value={v} />
          ))}
        </span>
      )
    }
    return (
      <span className="taglist">
        <EnumPill path={path} value={value} />
      </span>
    )
  }

  // dates (YAML parses ISO dates into Date objects)
  if (value instanceof Date) {
    return <span>{value.toLocaleDateString(lang)}</span>
  }

  // duration objects render as a single HH:MM:SS value
  if (durationSeconds(value) != null) {
    return <span>{formatDuration(durationSeconds(value))}</span>
  }

  // localized object -> single string
  if (isLocalized(value)) return <span>{loc(value, lang)}</span>

  // arrays -> list
  if (Array.isArray(value)) {
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

  // nested object -> key/value grid (descend with extended path)
  if (typeof value === 'object') {
    return (
      <span className="nested">
        {Object.entries(value).map(([k, v]) => (
          <span key={k} style={{ display: 'contents' }}>
            <span className="nkey">{k}</span>
            <Value value={v} path={path ? `${path}.${k}` : undefined} />
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
            <Value value={value} path={key} />
          </div>
        </div>
      ))}
    </div>
  )
}
