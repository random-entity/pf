import yaml from 'js-yaml'
import { loc } from '../i18n.jsx'
import { pickLanguage, plainText } from './markdown.js'

// Eagerly load every artwork/module markdown file as a raw string at build time.
// Content is organized by the `type` frontmatter value:
//   src/content/personal-works/
//   src/content/group-works/
//   src/content/modules/
const files = import.meta.glob('../content/{personal-works,group-works,modules}/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const FM = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

function parse(raw) {
  const m = FM.exec(raw)
  if (!m) return { data: {}, body: raw }
  let data = {}
  try {
    data = yaml.load(m[1]) || {}
  } catch (e) {
    console.warn('Frontmatter parse error:', e)
  }
  return { data, body: m[2] }
}

function firstH1Text(body, lang) {
  const m = /^#\s+(.+?)\s*#*\s*$/m.exec(pickLanguage(body, lang))
  return m ? plainText(m[1]) : ''
}

// Conversion factors to meters for `dimensions`. Authors may write any of
// these units; the app normalizes everything to meters.
const UNIT_TO_M = { m: 1, cm: 0.01, mm: 0.001, km: 1000, in: 0.0254, ft: 0.3048 }

// Convert a `{ width, height, …, unit }` object to plain meters, dropping the
// `unit` key (so it is never surfaced as its own property/facet).
function dimensionsToMeters(dim) {
  if (!dim || typeof dim !== 'object' || Array.isArray(dim)) return dim
  const factor = UNIT_TO_M[String(dim.unit).toLowerCase()] ?? 1
  const out = {}
  for (const [k, v] of Object.entries(dim)) {
    if (k === 'unit') continue
    out[k] = typeof v === 'number' ? Math.round(v * factor * 1e4) / 1e4 : v
  }
  return out
}

export const artworks = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.replace('../content/', '').replace(/\.md$/, '')
    const { data, body } = parse(raw)
    if (data.dimensions) data.dimensions = dimensionsToMeters(data.dimensions)
    return {
      slug,
      name: slug.split('/').pop(),
      dirs: slug.split('/').slice(0, -1),
      data,
      body,
    }
  })
  .sort((a, b) => a.slug.localeCompare(b.slug))

export const bySlug = Object.fromEntries(
  artworks.flatMap((a) => {
    const legacyDir = a.data.type === 'Module' ? 'modules' : 'works'
    return [
      [a.slug, a],
      // Backward compatibility for routes from the pre-refactor structure.
      [`${legacyDir}/${a.name}`, a],
    ]
  }),
)

// Resolve a wikilink target to an artwork slug. Matches by exact slug,
// by trailing path segment, or by basename (case-insensitive).
export function resolveSlug(target) {
  const t = target.trim()
  if (bySlug[t]) return t
  const lower = t.toLowerCase()
  const hit = artworks.find(
    (a) =>
      a.slug.toLowerCase() === lower ||
      a.slug.toLowerCase().endsWith('/' + lower) ||
      a.name.toLowerCase() === lower,
  )
  return hit ? hit.slug : null
}

// Display title for an artwork in the given language.
export function titleOf(a, lang) {
  return loc(a.data.title, lang) || firstH1Text(a.body, lang) || a.name
}
