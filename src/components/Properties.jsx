import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useLang, loc, isLocalized } from '../i18n.jsx'
import { wikiLinks } from '../lib/markdown.js'
import {
  isEnumFacet,
  canonicalOf,
  labelOf,
  durationSeconds,
  formatDuration,
  releaseEvents,
  formatDate,
  unitForPath,
  RELEASES_PATH,
} from '../lib/properties.js'
import { useFilters } from '../filters.jsx'

// Renders a string value with inline markdown (links, bold, italic, code,
// wikilinks). Block-level elements are unwrapped to keep properties inline.
function InlineMarkdown({ children }) {
  if (!children) return null
  const components = {
    a: ({ href, children: linkChildren }) => (
      <a
        href={href}
        target={href?.startsWith('#') ? undefined : '_blank'}
        rel={href?.startsWith('#') ? undefined : 'noopener noreferrer'}
        style={{ textDecoration: 'underline' }}
      >
        {linkChildren}
      </a>
    ),
  }
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      allowedElements={['a', 'strong', 'em', 'code', 'del']}
      unwrapDisallowed
      components={components}
    >
      {wikiLinks(String(children))}
    </ReactMarkdown>
  )
}

// Extract the URL from markdown link syntax "[text](url)", or null if absent.
function mdLinkUrl(s) {
  const m = String(s ?? '').match(/^\[([^\]]+)\]\(([^)]+)\)$/)
  return m ? m[2] : null
}

// A single enum value rendered as a pill that toggles its facet filter and
// expands the corresponding accordion in the sidebar. If the value is a markdown
// link, an external link icon is appended after a separator.
function EnumPill({ path, value }) {
  const { lang } = useLang()
  const { enums, toggleEnum, requestExpand } = useFilters()
  const id = canonicalOf(value)
  const active = enums[path]?.ids.includes(id)
  const displayText = String(labelOf(value, lang) ?? '')
  const externalUrl = mdLinkUrl(String(value ?? ''))

  return (
    <button
      className="tag"
      aria-pressed={!!active}
      onClick={() => { toggleEnum(path, id); requestExpand(path) }}
    >
      <span className="tag-label">{displayText}</span>
      {externalUrl && (
        <>
          <span className="tag-link-sep" aria-hidden="true" />
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="tag-ext-link"
            title={externalUrl}
          >
            ↗
          </a>
        </>
      )}
    </button>
  )
}

// The `releases` property: renders each release as {Date} : {Event} @{Venue} ({Version}).
function ReleasesValue({ value }) {
  const evs = releaseEvents(value)
  if (evs.length === 0) return <span className="muted">—</span>
  
  return (
    <ul className="release-events">
      {evs.map((e, i) => (
        <li key={i}>
          {/* 3. Date or Date Range */}
          <span className="date-range">
            {formatDate(e.start)}
            {e.end !== e.start ? ` → ${formatDate(e.end)}` : ''}
          </span>
          {' : '}

          {/* 1. Event (Clickable EnumPill) */}
          {e.event ? (
            <EnumPill path={RELEASES_PATH} value={e.event} />
          ) : (
            <span>* Release</span>
          )}
          
		  {/* 2. Venue (Only rendered if it exists) */}
          {e.venue && (
            <>
              {'@'}
              <span className="venue">{e.venue}</span>
            </>
          )}
          
          {/* 4. Version (Only rendered if it exists) */}
          {e.version && (
            <>
              {' '}
              <span className="version">({e.version})</span>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

// Renders any frontmatter value: localized strings, plain scalars, arrays
// (as lists), and nested JSON objects (as key/value grids). Values that map to
// an enum facet become clickable filter pills. `path` is the dotted facet path.
function Value({ value, path }) {
  const { lang } = useLang()

  if (value == null || value === '') return <span className="muted">—</span>

  // `releases` gets dedicated rendering (date/range + release/event name).
  if (path === RELEASES_PATH) return <ReleasesValue value={value} />

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
    return <span>{formatDate(value.getTime())}</span>
  }

  // duration objects render as a single HH:MM:SS value
  if (durationSeconds(value) != null) {
    return <span>{formatDuration(durationSeconds(value))}</span>
  }

  // localized object -> single string (inline markdown)
  if (isLocalized(value)) return <InlineMarkdown>{loc(value, lang)}</InlineMarkdown>

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

  // scalar number under a unit-bearing key (e.g. dimensions)
  if (typeof value === 'number' && path) {
    const unit = unitForPath(path)
    if (unit) return <span>{value} {unit}</span>
  }
  // plain string: render inline markdown (links, wikilinks, bold, etc.)
  if (typeof value === 'string') return <InlineMarkdown>{value}</InlineMarkdown>
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
