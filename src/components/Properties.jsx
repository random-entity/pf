import { createContext, useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useLang, loc, isLocalized } from '../i18n.jsx'
import { wikiLinks, expandMultiLinks, mdLinkUrls, mdWikiLinks } from '../lib/markdown.js'
import { resolveUrlRefs } from '../lib/urlmap.js'

// Resolver for `[text](^label)` URL-map refs in frontmatter values. Supplied by
// WorkPage (built from the page body + glossary); defaults to a no-op resolver.
export const UrlMapContext = createContext(() => null)
import {
  canonicalOf,
  labelOf,
  durationSeconds,
  formatDuration,
  formatDate,
  parseDateRange,
  unitForPath,
} from '../lib/properties.js'
import { typeForPath, labelForPath, FRONTMATTER_ORDER } from '../lib/schema.js'
import { jumpToFootnoteDef } from '../lib/jump.js'
import { useFilters } from '../filters.jsx'

// Inline markdown components. Defined at module scope (stable identities) so a
// re-render of the Properties block reconciles rather than remounts these nodes
// — important because WorkPage mutates the footnote <sup> elements (id, index,
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
  // backlinks are all assigned by WorkPage once both the frontmatter and the
  // body have rendered, so numbering reflects order of appearance across the
  // whole page (frontmatter first). Here we only mark it and wire the forward
  // jump to the definition.
  sup: ({ 'data-fn-ref': fnRef, children: supChildren }) => (
    <sup
      className="fn-ref"
      data-fn-ref={fnRef || undefined}
      style={{ cursor: fnRef ? 'pointer' : undefined }}
      onClick={fnRef ? (e) => {
        e.stopPropagation()
        jumpToFootnoteDef(fnRef, e.currentTarget.id)
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
export function InlineMarkdown({ children }) {
  const { lang } = useLang()
  const resolveUrl = useContext(UrlMapContext)
  if (!children) return null
  // Footnote labels are [^xxx] where xxx is [A-Za-z0-9_-]+ (the literal value is
  // just an identifier — the displayed index is assigned by order of appearance).
  // `[text](^label)` URL-map refs are resolved to real URLs first (after multi-
  // link expansion, which preserves each `(^label)` group). Wikilinks without an
  // alias render the referenced page's title (handled in wikiLinks via `lang`).
  const content = resolveUrlRefs(
    expandMultiLinks(wikiLinks(String(children), lang)),
    resolveUrl,
  ).replace(/\[\^([A-Za-z0-9_-]+)\]/g, '<sup data-fn-ref="$1">$1</sup>')
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

// Footnote reference marker inside a value, e.g. "[^label]".
const FN_REF = /\[\^([A-Za-z0-9_-]+)\]/g
// Wikilink marker inside a value, e.g. "[[target]]" / "[[target|alias]]".
const WIKI_REF = /\[\[[^\]]*\]\]/g

// A small page/document glyph for wikilinks attached to a pill (monochrome,
// inherits the current text color).
const PageIcon = () => (
  <svg
    viewBox="0 0 14 16"
    width="10"
    height="11"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinejoin="round"
    strokeLinecap="round"
  >
    <path d="M2.5 1.5 h6 l3 3 v10 h-9 z" />
    <path d="M8.5 1.5 v3 h3" />
  </svg>
)

// A single enum value rendered as a pill that toggles its facet filter and
// expands the corresponding accordion in the sidebar. Attachments in the value
// render to the right of the label, each in its own separated zone, in this
// order: wikilinks "[[target|alias]]" as page-icon links, footnote refs
// (e.g. "Forum IMPACT[^1]") as superscripts, and markdown-link URLs
// (e.g. "[text](url)(url)") as ↗ icons — [ label | 🗎 | ¹ | ↗ ↗ ]. A wikilink's
// visible text (alias, else target) stays in the label (via labelOf); only the
// page-icon is the marker. Footnote superscripts get the same appearance-order
// numbering + backlink wiring as body footnotes (handled by WorkPage, which finds
// every `.properties sup[data-fn-ref]`).
function EnumPill({ path, value }) {
  const { lang } = useLang()
  const { enums, toggleEnum, requestExpand } = useFilters()
  const resolveUrl = useContext(UrlMapContext)
  const id = canonicalOf(value)
  const active = enums[path]?.ids.includes(id)
  const displayText = String(labelOf(value, lang) ?? '')
  const valueStr = isLocalized(value) ? loc(value, lang) : String(value ?? '')
  // Wikilinks attached to the pill (rendered as page-icon links). Strip them out
  // before the footnote/link parsers so their brackets don't confuse the matchers.
  const wikis = mdWikiLinks(valueStr)
  const rest = valueStr.replace(WIKI_REF, '')
  const fnLabels = [...rest.matchAll(FN_REF)].map((m) => m[1])
  // Strip footnote markers before parsing link URLs — a [^label] inside the link
  // text contains a "]" that would otherwise break the [text](url) matcher — and
  // resolve `[text](^label)` URL-map refs so the ↗ links point at real URLs.
  const externalUrls = mdLinkUrls(resolveUrlRefs(rest.replace(FN_REF, ''), resolveUrl))

  return (
    <button
      className="tag"
      aria-pressed={!!active}
      onClick={() => { toggleEnum(path, id); requestExpand(path) }}
    >
      <span className="tag-label">{displayText}</span>
      {wikis.length > 0 && (
        <>
          <span className="tag-link-sep" aria-hidden="true" />
          {wikis.map((w, i) =>
            w.slug ? (
              <a
                key={`w-${i}`}
                href={`#/${encodeURI(w.slug)}`}
                onClick={(e) => e.stopPropagation()}
                className="tag-wiki-link"
                title={w.alias ?? w.target}
              >
                <PageIcon />
              </a>
            ) : (
              <span
                key={`w-${i}`}
                className="tag-wiki-link tag-wiki-broken"
                title={`Unresolved wikilink: ${w.target}`}
              >
                <PageIcon />
              </span>
            ),
          )}
        </>
      )}
      {fnLabels.length > 0 && (
        <>
          <span className="tag-link-sep" aria-hidden="true" />
          {fnLabels.map((label, i) => (
            <sup
              key={`fn-${i}`}
              className="fn-ref tag-fn-ref"
              data-fn-ref={label}
              onClick={(e) => {
                e.stopPropagation()
                jumpToFootnoteDef(label, e.currentTarget.id)
              }}
            >
              {label}
            </sup>
          ))}
        </>
      )}
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

  // Date → masked/formatted display ("2022-??-??", "2023-10-06", or "a → b").
  if (type === 'date') {
    const r = parseDateRange(value)
    if (r) return <span className="date-range">{r.display}</span>
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
export default function Properties({ data, resolveUrl }) {
  const { propLabel } = useLang()
  const entries = Object.entries(data)
    .filter(([k]) => k !== 'title')
    .sort(([a], [b]) => {
      const ia = FRONTMATTER_ORDER.indexOf(a)
      const ib = FRONTMATTER_ORDER.indexOf(b)
      const ra = ia === -1 ? Infinity : ia
      const rb = ib === -1 ? Infinity : ib
      if (ra !== rb) return ra - rb
      return a.localeCompare(b)
    })
  if (entries.length === 0) return null

  return (
    <UrlMapContext.Provider value={resolveUrl || (() => null)}>
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
    </UrlMapContext.Provider>
  )
}
