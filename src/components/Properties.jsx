import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useLang, loc, isLocalized } from '../i18n.jsx'
import { wikiLinks, expandMultiLinks, mdLinkUrls } from '../lib/markdown.js'
import {
  canonicalOf,
  labelOf,
  durationSeconds,
  formatDuration,
  formatDate,
  parseDateRange,
  unitForPath,
} from '../lib/properties.js'
import { typeForPath, labelForPath } from '../lib/schema.js'
import { useFilters } from '../filters.jsx'

// Inline markdown components. Defined at module scope (stable identities) so a
// re-render of the Properties block reconciles rather than remounts these nodes
// — important because ArtworkPage mutates the footnote <sup> elements (id, index,
// backlinks) directly in the DOM, and a remount would discard those mutations.
const INLINE_COMPONENTS = {
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
  // Footnote reference. The displayed number, a unique backref id, and the ↩
  // backlinks are all assigned by ArtworkPage once both the frontmatter and the
  // body have rendered, so numbering reflects order of appearance across the
  // whole page (frontmatter first). Here we only mark it and wire the forward
  // jump to the definition.
  sup: ({ 'data-fn-ref': fnRef, children: supChildren }) => (
    <sup
      className="fn-ref"
      data-fn-ref={fnRef || undefined}
      style={{ cursor: fnRef ? 'pointer' : undefined }}
      onClick={fnRef ? () => {
        document.getElementById(`user-content-fn-${fnRef}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } : undefined}
    >
      {supChildren}
    </sup>
  ),
}

// Renders a string value with inline markdown (links, bold, italic, code,
// wikilinks, footnote refs). Always returns a single <span> so it is safe
// inside grid/flex contexts (avoids sibling bleed in display:contents grids).
// Footnote references [^xxx] scroll to the definition in the article body.
function InlineMarkdown({ children }) {
  if (!children) return null
  // Footnote labels are [^xxx] where xxx is [A-Za-z0-9_-]+ (the literal value is
  // just an identifier — the displayed index is assigned by order of appearance).
  const content = expandMultiLinks(wikiLinks(String(children)))
    .replace(/\[\^([A-Za-z0-9_-]+)\]/g, '<sup data-fn-ref="$1">$1</sup>')
  return (
    <span>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        allowedElements={['a', 'strong', 'em', 'code', 'del', 'sup']}
        unwrapDisallowed
        components={INLINE_COMPONENTS}
      >
        {content}
      </ReactMarkdown>
    </span>
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

// Renders any frontmatter value, driven by the property's declared type
// (src/lib/schema.js) at its dotted `path`. Container shapes (localized objects,
// arrays, plain objects) are handled structurally and recurse with the extended
// path, so nested fields like `releases.date` / `releases.event` pick up their
// own declared types. Unlisted paths default to `text` (inline markdown).
function Value({ value, path }) {
  const { lang } = useLang()

  if (value == null || value === '') return <span className="muted">—</span>

  const type = path ? typeForPath(path) : 'text'

  // Enum → clickable filter pill(s). Arrays render one pill per element. NB:
  // this runs BEFORE the localized-leaf pick below so a localized enum value
  // {en,ko,ja} reaches EnumPill intact — EnumPill derives its canonical id via
  // canonicalOf (language-stable) so the pill stays in sync with the sidebar
  // filter in every language.
  if (type === 'enum') {
    const arr = Array.isArray(value) ? value : [value]
    return (
      <span className="taglist">
        {arr.map((v, i) => (
          <EnumPill key={i} path={path} value={v} />
        ))}
      </span>
    )
  }

  // Localized leaf {en,ko,ja}: pick the current language, then render at the
  // same path (its type is unchanged by language selection).
  if (isLocalized(value)) {
    const picked = value[lang] ?? value.en ?? Object.values(value).find((v) => v != null)
    return <Value value={picked ?? ''} path={path} />
  }

  // Date → formatted date or "start → end" range.
  if (type === 'date') {
    const r = parseDateRange(value)
    if (r)
      return (
        <span className="date-range">
          {formatDate(r.start)}
          {r.end !== r.start ? ` → ${formatDate(r.end)}` : ''}
        </span>
      )
    // fall through to default rendering if unparseable
  }

  // Non-enum arrays → list, recursing with the SAME path so each element keeps
  // its declared type (e.g. each release object under `releases`).
  if (Array.isArray(value)) {
    return (
      <ul>
        {value.map((v, i) => (
          <li key={i}>
            <Value value={v} path={path} />
          </li>
        ))}
      </ul>
    )
  }

  // Raw YAML Date instance always renders formatted.
  if (value instanceof Date) {
    return <span className="date-range">{formatDate(value.getTime())}</span>
  }

  // Duration object → HH:MM:SS.
  if (type === 'duration' || durationSeconds(value) != null) {
    const s = durationSeconds(value)
    if (s != null) return <span>{formatDuration(s)}</span>
  }

  // Number → value plus optional unit.
  if (typeof value === 'number') {
    const unit = unitForPath(path)
    return <span>{unit ? `${value} ${unit}` : value}</span>
  }

  // Plain object → key/value grid (descend with the extended path). Keys show
  // their localized label from the schema (falling back to the raw key).
  if (typeof value === 'object') {
    return (
      <span className="nested">
        {Object.entries(value).map(([k, v]) => {
          const childPath = path ? `${path}.${k}` : k
          return (
            <span key={k} style={{ display: 'contents' }}>
              <span className="nkey">{labelForPath(childPath, lang)}</span>
              <Value value={v} path={childPath} />
            </span>
          )
        })}
      </span>
    )
  }

  // Text / default: render inline markdown (links, wikilinks, bold, footnotes).
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
