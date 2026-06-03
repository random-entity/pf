import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useLang, loc, isLocalized } from '../i18n.jsx'
import { wikiLinks, expandMultiLinks, mdLinkUrls } from '../lib/markdown.js'
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
      {expandMultiLinks(wikiLinks(String(children)))}
    </ReactMarkdown>
  )
}

// A single enum value rendered as a pill that toggles its facet filter and
// expands the corresponding accordion in the sidebar. If the value is a markdown
// link (or multi-link), external link ↗ icons are appended after a separator.
function EnumPill({ path, value }) {
  const { lang } = useLang()
  const { enums, toggleEnum, requestExpand } = useFilters()
  const id = canonicalOf(value)
  const active = enums[path]?.ids.includes(id)
  const displayText = String(labelOf(value, lang) ?? '')
  const valueStr = isLocalized(value) ? loc(value, lang) : String(value ?? '')
  const externalUrls = mdLinkUrls(valueStr)

  return (
    <button
      className="tag"
      aria-pressed={!!active}
      onClick={() => { toggleEnum(path, id); requestExpand(path) }}
    >
      <span className="tag-label">{displayText}</span>
      {externalUrls.length > 0 && (
        <>
          <span className="tag-link-sep" aria-hidden="true" />
          {externalUrls.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="tag-ext-link"
              title={url}
            >
              ↗
            </a>
          ))}
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
              <span className="venue"><InlineMarkdown>{e.venue}</InlineMarkdown></span>
            </>
          )}

          {/* 4. Version (Only rendered if it exists) */}
          {e.version && (
            <>
              {' '}
              <span className="version">(<InlineMarkdown>{e.version}</InlineMarkdown>)</span>
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

  // localized object → pick current language's value, then render whatever type it is
  if (isLocalized(value)) {
    const picked = value[lang] ?? value.en ?? Object.values(value).find(v => v != null)
    return <Value value={picked ?? ''} path={path} />
  }

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
