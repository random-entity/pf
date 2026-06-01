import { artworks } from './content.js'
import { loc, isLocalized } from '../i18n.jsx'

// Read a (possibly nested) value out of a frontmatter object by dotted path.
export function getValueAtPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
}

// Language-independent identity for an enum value, so the same value groups
// across artworks and survives language switches.
export function canonicalOf(v) {
  if (v == null) return ''
  if (v instanceof Date) return v.toISOString()
  if (isLocalized(v)) return loc(v, 'en') || ''
  return String(v)
}

// Human-facing label for an enum value in the active language.
export function labelOf(v, lang) {
  if (v == null) return ''
  if (isLocalized(v)) return loc(v, lang)
  return String(v)
}

// A duration is an object whose keys are a subset of {hours, minutes, seconds}
// with numeric values. Such objects are treated as a single 1-D numeric value
// (total seconds) rather than as a nested group of sub-properties.
const TIME_KEYS = new Set(['hours', 'minutes', 'seconds'])
export function durationSeconds(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v) || v instanceof Date) return null
  const keys = Object.keys(v)
  if (keys.length === 0 || !keys.every((k) => TIME_KEYS.has(k))) return null
  if (!keys.every((k) => typeof v[k] === 'number')) return null
  return (v.hours || 0) * 3600 + (v.minutes || 0) * 60 + (v.seconds || 0)
}

export function formatDuration(total) {
  const s = Math.max(0, Math.round(total))
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

// ---- Dates & events ----------------------------------------------------
// `date` may be a single date, or a list of events. Each event is a string:
//   "YYYY-MM-DD : Event name"
//   "YYYY-MM-DD ~ YYYY-MM-DD : Event name"   (inclusive range)
// the event name (and the range end) are optional.

export const EVENTS_PATH = '__events__'

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/
const EVENT_RE = /^\s*(\d{4}-\d{2}-\d{2})\s*(?:~\s*(\d{4}-\d{2}-\d{2}))?\s*(?::\s*(.+?))?\s*$/

function toMs(s) {
  if (s instanceof Date) return s.getTime()
  const m = DATE_RE.exec(String(s).trim())
  if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]) // UTC so the calendar date is stable
  const t = new Date(s).getTime()
  return Number.isNaN(t) ? null : t
}

export function formatDate(ms) {
  const d = new Date(ms)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

function parseEvent(item) {
  if (item instanceof Date) return { start: item.getTime(), end: item.getTime(), event: null }
  const m = EVENT_RE.exec(String(item))
  if (!m) return null
  const start = toMs(m[1])
  if (start == null) return null
  const end = m[2] ? toMs(m[2]) : start
  return { start, end, event: m[3] ? m[3].trim() : null }
}

// Normalize an artwork's `date` field into a list of { start, end, event }.
export function dateEvents(v) {
  if (v == null) return []
  const items = Array.isArray(v) ? v : [v]
  return items.map(parseEvent).filter(Boolean)
}

export function eventNamesOf(data) {
  return dateEvents(data?.date).map((e) => e.event).filter(Boolean)
}

// Earliest start used as the artwork's sort key; null if it has no date.
export function dateSortValue(data) {
  const evs = dateEvents(data?.date)
  return evs.length ? Math.min(...evs.map((e) => e.start)) : null
}

// Decide how a property should behave from the set of values it takes across
// all artworks. Returns one of: stringList | date | numeric | enumSingle |
// nested, or null to ignore (e.g. lists of mixed/object values).
function classify(values) {
  if (values.length === 0) return null
  if (values.some((v) => Array.isArray(v))) {
    const allStrings = values.every((v) => Array.isArray(v) && v.every((x) => typeof x === 'string'))
    return allStrings ? 'stringList' : null
  }
  if (values.every((v) => v instanceof Date)) return 'date'
  if (values.every((v) => typeof v === 'number')) return 'numeric'
  if (values.every((v) => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || isLocalized(v))) {
    return 'enumSingle'
  }
  if (values.every((v) => durationSeconds(v) != null)) return 'duration'
  if (values.every((v) => v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date))) {
    return 'nested'
  }
  return null
}

// Distinct enum values (with occurrence counts), sorted by canonical id.
function enumValues(values) {
  const map = new Map()
  const add = (v) => {
    const id = canonicalOf(v)
    if (id === '') return
    if (!map.has(id)) map.set(id, { id, raw: v, count: 0 })
    map.get(id).count++
  }
  for (const v of values) {
    if (Array.isArray(v)) v.forEach(add)
    else add(v)
  }
  return [...map.values()].sort((a, b) => a.id.localeCompare(b.id))
}

// Sorted distinct numeric options for a numeric/date facet (dates -> epoch ms).
function numericOptions(values, isDate) {
  const nums = values.map((v) => (v instanceof Date ? v.getTime() : v))
  const uniq = [...new Set(nums)].sort((a, b) => a - b)
  return { options: uniq, min: uniq[0], max: uniq[uniq.length - 1], isDate }
}

// Recursively build facets from a set of objects. `title` is skipped at the top
// level (it is the page heading and gets a dedicated sort-only facet elsewhere).
function facetsFrom(objs, base, depth) {
  const keys = new Set()
  for (const o of objs) {
    for (const k of Object.keys(o || {})) {
      if (depth === 0 && k === 'title') continue
      keys.add(k)
    }
  }
  const facets = []
  for (const key of [...keys].sort()) {
    const path = base ? `${base}.${key}` : key

    // Top-level `date`: single dates and/or a list of (possibly ranged) events.
    // Min = all start dates, Max = all end dates; event names become their own
    // filterable facet.
    if (depth === 0 && key === 'date') {
      const evs = objs.flatMap((o) => dateEvents(o?.date))
      if (evs.length) {
        const starts = [...new Set(evs.map((e) => e.start))].sort((a, b) => a - b)
        const ends = [...new Set(evs.map((e) => e.end))].sort((a, b) => a - b)
        facets.push({
          path: 'date', key: 'date', kind: 'dateEvents', depth, isDate: true,
          minOptions: starts, maxOptions: ends, min: starts[0], max: ends[ends.length - 1],
        })
        const names = [...new Set(evs.map((e) => e.event).filter(Boolean))].sort((a, b) => a.localeCompare(b))
        if (names.length) {
          facets.push({
            path: EVENTS_PATH, key: 'events', kind: 'stringList', depth,
            values: names.map((n) => ({ id: n, raw: n, count: 0 })),
          })
        }
      }
      continue
    }

    const values = objs.map((o) => o && o[key]).filter((v) => v != null)
    const kind = classify(values)
    if (kind === 'nested') {
      const children = facetsFrom(values, path, depth + 1)
      if (children.length) facets.push({ path, key, kind, depth, children })
    } else if (kind === 'stringList' || kind === 'enumSingle') {
      const vals = enumValues(values)
      if (vals.length) facets.push({ path, key, kind, depth, values: vals })
    } else if (kind === 'numeric' || kind === 'date') {
      const n = numericOptions(values, kind === 'date')
      if (n.options.length > 1) facets.push({ path, key, kind, depth, minOptions: n.options, maxOptions: n.options, ...n })
    } else if (kind === 'duration') {
      const n = numericOptions(values.map((v) => durationSeconds(v)), false)
      if (n.options.length > 1) facets.push({ path, key, kind: 'numeric', depth, isDuration: true, minOptions: n.options, maxOptions: n.options, ...n })
    }
  }
  return facets
}

// Built once: content is static and loaded eagerly at build time.
export const schema = facetsFrom(artworks.map((a) => a.data), '', 0)

// Flat lookup of every facet (including nested children) by its path.
export const facetByPath = (() => {
  const m = new Map()
  const walk = (fs) => fs.forEach((f) => { m.set(f.path, f); if (f.children) walk(f.children) })
  walk(schema)
  return m
})()

export function isEnumFacet(path) {
  const f = facetByPath.get(path)
  return f && (f.kind === 'stringList' || f.kind === 'enumSingle')
}
