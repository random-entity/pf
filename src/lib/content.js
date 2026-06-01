import yaml from 'js-yaml'
import { loc } from '../i18n.jsx'

// Eagerly load every artwork markdown file as a raw string at build time.
const files = import.meta.glob('../content/artworks/**/*.md', {
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
    const slug = path
      .replace('../content/artworks/', '')
      .replace(/\.md$/, '')
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

export const bySlug = Object.fromEntries(artworks.map((a) => [a.slug, a]))

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
  return loc(a.data.title, lang) || a.name
}

// Build a nested folder tree from artwork slugs.
export function buildTree(items) {
  const root = { name: '', children: new Map(), files: [] }
  for (const a of items) {
    const parts = a.slug.split('/')
    let node = root
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i]
      if (!node.children.has(p)) {
        node.children.set(p, { name: p, children: new Map(), files: [] })
      }
      node = node.children.get(p)
    }
    node.files.push(a)
  }
  return root
}

// Unique sorted list of all genres present.
export function allGenres(lang) {
  const set = new Set()
  for (const a of artworks) {
    const g = loc(a.data.genre, lang)
    if (g) set.add(g)
  }
  return [...set].sort()
}

// Unique sorted list of all tags.
export function allTags() {
  const set = new Set()
  for (const a of artworks) {
    for (const tag of toArray(a.data.tags)) set.add(tag)
  }
  return [...set].sort()
}

export function toArray(v) {
  if (v == null) return []
  return Array.isArray(v) ? v : [v]
}

// Date used for sorting; falls back to year, then epoch 0.
export function dateOf(a) {
  const d = a.data.date || a.data.created || a.data.year
  if (d == null) return 0
  const ts = new Date(d).getTime()
  return Number.isNaN(ts) ? 0 : ts
}
