import { works, titleForTarget } from './content.js';
import { loc, isLocalized } from '../i18n.jsx';
import { PROPERTY_SCHEMA, typeForPath } from './schema.js';

// `releases` is kept as a named constant for the few call sites that special-case
// it (e.g. WorkPage skips its enum pills when seeding footnotes).
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

// Strip footnote reference markers "[^label]" from a string. They are an
// annotation, not part of the value's identity or its sidebar label — only the
// frontmatter pill renders them (as a superscript). Stripping must run before
// any [text](url) link parsing, since a [^label] inside link text contains a
// "]" that would otherwise break the link matcher.
const FN_REF_RE = /\[\^[A-Za-z0-9_-]+\]/g;
const stripFootnotes = (s) => String(s).replace(FN_REF_RE, '');

// Replace [[wikilink]] / [[wikilink|alias]] markers with their visible text. The
// page-icon link is rendered separately on the pill; the text stays in the label
// and the value's identity (unlike footnotes, whose markers are removed). Text
// precedence: (1) an explicit alias right of "|"; else (2) the referenced page's
// localized title (via titleForTarget — current language with en/ko/ja fallback);
// else (3) the raw target (filename) when it doesn't resolve to a work.
const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
const wikiLinkText = (s, lang = 'en') =>
  String(s).replace(WIKILINK_RE, (_, t, a) => a?.trim() || titleForTarget(t, lang) || t.trim());

// Language-independent identity for an enum value, so the same value groups
// across works and survives language switches.
export function canonicalOf(v) {
  if (v == null) return '';
  if (v instanceof Date) return v.toISOString();
  if (isLocalized(v)) return wikiLinkText(stripFootnotes(loc(v, 'en') || ''), 'en');
  return wikiLinkText(stripFootnotes(String(v)), 'en');
}

// Strip markdown link syntax from a string, returning just the display text.
// Handles both [text](url) and [text](url1)(url2)... forms.
function stripMdLink(s) {
  const m = s.match(/^\[([^\]]+)\](?:\([^)]+\))+$/);
  return m ? m[1] : s;
}

// Human-facing label for an enum value in the active language. Markdown link
// syntax "[text](url)" and footnote markers "[^label]" are stripped to just the
// plain text; wikilink markers "[[target|alias]]" are replaced by their visible
// text — alias, else the referenced page's title, else the target — since that
// text is the label (the page icon is a separate marker on the frontmatter pill).
export function labelOf(v, lang) {
  if (v == null) return '';
  const s = isLocalized(v) ? loc(v, lang) : String(v);
  return stripMdLink(wikiLinkText(stripFootnotes(s), lang || 'en'));
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
// A date value is either a YAML Date, a "YYYY-MM-DD" string, an inclusive range
// "YYYY-MM-DD ~ YYYY-MM-DD", or a WILDCARD date where a trailing run of digits
// (across the year, month and day, ignoring the "-" separators) is masked with
// "x"/"X" — e.g. "2022-XX-XX" (any day of 2022), "2022-06-XX" (any day of June
// 2022), or "205x-xx-xx" (any day of the 2050s). A wildcard expands to the full
// { start, end } span it could represent (205x-xx-xx → 2050-01-01 … 2059-12-31)
// for sorting/filtering, but renders masked as "205?-??-??".

// A single date token: year (4), month (2), day (2), each character a digit or
// a wildcard "x"/"X". The trailing-run rule is validated in parseDateToken.
const TOKEN_RE = /^([0-9Xx]{4})-([0-9Xx]{2})-([0-9Xx]{2})$/;
const isWildChar = (c) => c === 'x' || c === 'X';

// Last calendar day of a 1-based month in a given year (leap-aware).
const lastDayOfMonth = (year, month) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

export function formatDate(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

// Parse one date token into { start, end, display }, or null. Wildcards must
// form a clean suffix of the digit sequence (a masked digit followed by a
// concrete one, e.g. "2022-XX-06" or "20x4-xx-xx", is rejected). Tokens that
// don't match the date shape fall back to generic Date parsing.
function parseDateToken(tok) {
  const s = String(tok).trim();
  const m = TOKEN_RE.exec(s);
  if (!m) {
    const t = new Date(s).getTime();
    if (Number.isNaN(t)) return null;
    return { start: t, end: t, display: formatDate(t) };
  }
  const [, yStr, moStr, dStr] = m;

  // Trailing-run check over the 8 digit positions (yyyymmdd): once a wildcard
  // appears, everything to its right must also be a wildcard.
  const seq = yStr + moStr + dStr;
  const firstWild = [...seq].findIndex(isWildChar);
  if (firstWild !== -1) {
    for (let i = firstWild + 1; i < seq.length; i++) {
      if (!isWildChar(seq[i])) return null;
    }
  }

  // A field's smallest/largest value: replace its wildcards with 0s / 9s.
  const minField = (f) => Number(f.replace(/[Xx]/g, '0'));
  const maxField = (f) => Number(f.replace(/[Xx]/g, '9'));
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

  const startYear = minField(yStr);
  const endYear = maxField(yStr);
  const startMonth = clamp(minField(moStr) || 1, 1, 12);
  const endMonth = clamp(maxField(moStr) || 1, 1, 12);
  const startDay = clamp(minField(dStr) || 1, 1, lastDayOfMonth(startYear, startMonth));
  const endDay = clamp(maxField(dStr) || 1, 1, lastDayOfMonth(endYear, endMonth));

  return {
    start: Date.UTC(startYear, startMonth - 1, startDay),
    end: Date.UTC(endYear, endMonth - 1, endDay),
    display: s.replace(/[Xx]/g, '?'),
  };
}

// Parse a date value into { start, end } epoch ms plus a `display` string, or
// null if unparseable. `display` masks wildcards ("2022-??-??") and joins a two-
// token range with " → ". start/end always span the full representable range so
// sorting, grouping, and range-filtering treat a wildcard as its whole window.
export function parseDateRange(value) {
  if (value instanceof Date) {
    const ms = value.getTime();
    return { start: ms, end: ms, display: formatDate(ms) };
  }
  const parts = String(value).split('~').map((p) => p.trim());
  if (parts.length > 2) return null;
  const a = parseDateToken(parts[0]);
  if (!a) return null;
  if (parts.length === 1) return { start: a.start, end: a.end, display: a.display };
  const b = parseDateToken(parts[1]);
  if (!b) return null;
  return {
    start: a.start,
    end: b.end,
    display: a.display === b.display ? a.display : `${a.display} → ${b.display}`,
  };
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

// Does a work carry any value at this facet's path?
export function hasValueAtPath(data, facet) {
  if (facet.kind === 'enum') return idsAtPath(data, facet.path).length > 0;
  if (facet.kind === 'date') return rangesAtPath(data, facet.path).length > 0;
  if (facet.kind === 'number' || facet.kind === 'duration')
    return numbersAtPath(data, facet.path, facet.isDuration).length > 0;
  return false;
}

// Sort key for a facet: dates -> earliest start; numbers/durations -> minimum.
// null when the work has no value at the path.
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

// Could any work carry every one of these enum ids at `path` at once? If not,
// the values are mutually exclusive and an AND ("All") filter is meaningless.
export function valuesCanCoexist(works, path, ids) {
  if (ids.length < 2) return true;
  return works.some((a) => {
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
  const objs = works.map((a) => a.data);
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
