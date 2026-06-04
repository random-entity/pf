import { artworks } from './content.js';
import { loc, isLocalized } from '../i18n.jsx';
import { PROPERTY_SCHEMA, typeForPath } from './schema.js';

// `releases` is kept as a named constant for the few call sites that special-case
// it (e.g. ArtworkPage skips its enum pills when seeding footnotes).
export const RELEASES_PATH = 'releases';

// Read a (possibly nested) value out of a frontmatter object by a dotted path.
// Does NOT traverse arrays — use valuesAtPath for facet/value collection.
export function getValueAtPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

// Collect every leaf value at a dotted path, transparently traversing arrays
// (so `releases.event` yields the event of every release). A localized object
// {en,ko,ja} is treated as a leaf — descending past it would hit language keys,
// not data — so it is only meaningful as the final segment.
function collectAtPath(obj, segs) {
  if (obj == null) return [];
  if (Array.isArray(obj)) return obj.flatMap((o) => collectAtPath(o, segs));
  if (segs.length === 0) return [obj]; // leaf (a localized object counts as one)
  if (isLocalized(obj)) return [];
  return collectAtPath(obj[segs[0]], segs.slice(1));
}

export function valuesAtPath(data, path) {
  return collectAtPath(data, path.split('.'));
}

// Language-independent identity for an enum value, so the same value groups
// across artworks and survives language switches.
export function canonicalOf(v) {
  if (v == null) return '';
  if (v instanceof Date) return v.toISOString();
  if (isLocalized(v)) return loc(v, 'en') || '';
  return String(v);
}

// Strip markdown link syntax from a string, returning just the display text.
// Handles both [text](url) and [text](url1)(url2)... forms.
function stripMdLink(s) {
  const m = s.match(/^\[([^\]]+)\](?:\([^)]+\))+$/);
  return m ? m[1] : s;
}

// Human-facing label for an enum value in the active language.
// Markdown link syntax "[text](url)" is stripped to just "text".
export function labelOf(v, lang) {
  if (v == null) return '';
  if (isLocalized(v)) return stripMdLink(loc(v, lang));
  return stripMdLink(String(v));
}

// A duration is an object whose keys are a subset of {hours, minutes, seconds}
// with numeric values, treated as a single 1-D numeric value (total seconds).
const TIME_KEYS = new Set(['hours', 'minutes', 'seconds']);
export function durationSeconds(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v) || v instanceof Date)
    return null;
  const keys = Object.keys(v);
  if (keys.length === 0 || !keys.every((k) => TIME_KEYS.has(k))) return null;
  if (!keys.every((k) => typeof v[k] === 'number')) return null;
  return (v.hours || 0) * 3600 + (v.minutes || 0) * 60 + (v.seconds || 0);
}

export function formatDuration(total) {
  const s = Math.max(0, Math.round(total));
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

// ---- Dates -------------------------------------------------------------
// A date value is either a YAML Date, a "YYYY-MM-DD" string, or an inclusive
// range "YYYY-MM-DD ~ YYYY-MM-DD".

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const RANGE_RE = /^\s*(\d{4}-\d{2}-\d{2})\s*(?:~\s*(\d{4}-\d{2}-\d{2}))?\s*$/;

function toMs(s) {
  if (s instanceof Date) return s.getTime();
  const m = DATE_RE.exec(String(s).trim());
  if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]); // UTC so the calendar date is stable
  const t = new Date(s).getTime();
  return Number.isNaN(t) ? null : t;
}

export function formatDate(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

// Parse a date value into { start, end } epoch ms, or null if unparseable.
export function parseDateRange(value) {
  if (value instanceof Date) {
    const ms = value.getTime();
    return { start: ms, end: ms };
  }
  const m = RANGE_RE.exec(String(value));
  if (!m) return null;
  const start = toMs(m[1]);
  if (start == null) return null;
  const end = m[2] ? toMs(m[2]) : start;
  return { start, end };
}

// ---- Path-typed value collection (used by the facet engine) ------------

// Enum: canonical ids carried at a path (across arrays).
export function idsAtPath(data, path) {
  return valuesAtPath(data, path).map(canonicalOf).filter(Boolean);
}

// Date: every parsed { start, end } range at a path.
function rangesAtPath(data, path) {
  return valuesAtPath(data, path).map(parseDateRange).filter(Boolean);
}

// Number/duration: every numeric value at a path.
function numbersAtPath(data, path, isDuration) {
  const vals = valuesAtPath(data, path);
  return isDuration
    ? vals.map(durationSeconds).filter((v) => v != null)
    : vals.filter((v) => typeof v === 'number');
}

// Does an artwork carry any value at this facet's path?
export function hasValueAtPath(data, facet) {
  if (facet.kind === 'enum') return idsAtPath(data, facet.path).length > 0;
  if (facet.kind === 'date') return rangesAtPath(data, facet.path).length > 0;
  if (facet.kind === 'number' || facet.kind === 'duration')
    return numbersAtPath(data, facet.path, facet.isDuration).length > 0;
  return false;
}

// Sort key for a facet: dates -> earliest start; numbers/durations -> minimum.
// null when the artwork has no value at the path.
export function sortValueForFacet(facet, data) {
  if (facet.kind === 'date') {
    const rs = rangesAtPath(data, facet.path);
    return rs.length ? Math.min(...rs.map((r) => r.start)) : null;
  }
  if (facet.kind === 'number' || facet.kind === 'duration') {
    const ns = numbersAtPath(data, facet.path, facet.isDuration);
    return ns.length ? Math.min(...ns) : null;
  }
  return null;
}

// Does any value at a facet's path fall inside the [min, max] range filter?
export function rangeMatchesFacet(facet, data, r) {
  if (facet.kind === 'date') {
    return rangesAtPath(data, facet.path).some(
      (rg) => rg.start <= r.max && rg.end >= r.min,
    );
  }
  const ns = numbersAtPath(data, facet.path, facet.isDuration);
  return ns.some((n) => n >= r.min && n <= r.max);
}

// Could any artwork carry every one of these enum ids at `path` at once? If not,
// the values are mutually exclusive and an AND ("All") filter is meaningless.
export function valuesCanCoexist(artworks, path, ids) {
  if (ids.length < 2) return true;
  return artworks.some((a) => {
    const own = idsAtPath(a.data, path);
    return ids.every((id) => own.includes(id));
  });
}

// ---- Facet building (from the explicit schema, not inference) ----------

// Distinct enum values (with occurrence counts), sorted by canonical id.
function enumValues(values) {
  const map = new Map();
  for (const v of values) {
    const id = canonicalOf(v);
    if (id === '') continue;
    if (!map.has(id)) map.set(id, { id, raw: v, count: 0 });
    map.get(id).count++;
  }
  return [...map.values()].sort((a, b) => a.id.localeCompare(b.id));
}

// Direct child schema paths of a group path (e.g. releases -> releases.event…).
function childPaths(path) {
  const prefix = `${path}.`;
  return Object.keys(PROPERTY_SCHEMA).filter(
    (p) => p.startsWith(prefix) && !p.slice(prefix.length).includes('.'),
  );
}

// Build a facet for a single schema path, or null if it carries no values.
function buildFacet(path, depth, objs) {
  const type = typeForPath(path);
  const key = path.split('.').pop();

  if (type === 'group') {
    const children = childPaths(path)
      .map((c) => buildFacet(c, depth + 1, objs))
      .filter(Boolean)
      .sort((a, b) => a.path.localeCompare(b.path));
    if (!children.length) return null;
    return { path, key, kind: 'nested', depth, children };
  }

  if (type === 'enum') {
    const values = enumValues(objs.flatMap((o) => valuesAtPath(o, path)));
    if (!values.length) return null;
    return { path, key, kind: 'enum', depth, values };
  }

  if (type === 'date') {
    const ranges = objs.flatMap((o) => rangesAtPath(o, path));
    if (!ranges.length) return null;
    const starts = [...new Set(ranges.map((r) => r.start))].sort((a, b) => a - b);
    const ends = [...new Set(ranges.map((r) => r.end))].sort((a, b) => a - b);
    if (starts.length < 2 && ends.length < 2) return null;
    return {
      path,
      key,
      kind: 'date',
      depth,
      isDate: true,
      minOptions: starts,
      maxOptions: ends,
      min: starts[0],
      max: ends[ends.length - 1],
    };
  }

  if (type === 'number' || type === 'duration') {
    const isDuration = type === 'duration';
    const nums = objs.flatMap((o) => numbersAtPath(o, path, isDuration));
    const options = [...new Set(nums)].sort((a, b) => a - b);
    if (options.length < 2) return null;
    return {
      path,
      key,
      kind: type === 'duration' ? 'duration' : 'number',
      depth,
      isDuration,
      minOptions: options,
      maxOptions: options,
      min: options[0],
      max: options[options.length - 1],
    };
  }

  return null; // text → not a facet
}

// Built once: content is static and loaded eagerly at build time. Root facets
// are the depth-0 schema keys (title is excluded — it has a dedicated sort row).
export const schema = (() => {
  const objs = artworks.map((a) => a.data);
  const rootKeys = Object.keys(PROPERTY_SCHEMA).filter(
    (p) => !p.includes('.') && p !== 'title',
  );
  return rootKeys
    .map((p) => buildFacet(p, 0, objs))
    .filter(Boolean)
    .sort((a, b) => a.path.localeCompare(b.path));
})();

// Flat lookup of every facet (including nested children) by its path.
export const facetByPath = (() => {
  const m = new Map();
  const walk = (fs) =>
    fs.forEach((f) => {
      m.set(f.path, f);
      if (f.children) walk(f.children);
    });
  walk(schema);
  return m;
})();

export function isEnumFacet(path) {
  return typeForPath(path) === 'enum';
}

// Display unit appended to numeric values at a path (from the schema config).
export function unitForPath(path) {
  return PROPERTY_SCHEMA[path]?.unit || '';
}
