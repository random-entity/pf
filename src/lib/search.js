import { LANGS } from '../i18n.jsx';
import { pickLanguage } from './markdown.js';

// Detect a localized object {en?, ko?, ja?} — all keys must be language codes.
function isLocalizedObj(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v) || v instanceof Date) return false;
  const keys = Object.keys(v);
  return keys.length > 0 && keys.every((k) => LANGS.includes(k));
}

// Detect a duration object {hours?, minutes?, seconds?}.
const DURATION_KEYS = new Set(['hours', 'minutes', 'seconds']);
function isDurationObj(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v) || v instanceof Date) return false;
  const keys = Object.keys(v);
  return keys.length > 0 && keys.every((k) => DURATION_KEYS.has(k));
}

// Flatten all user-visible string values from a frontmatter data object into
// a single searchable text for the given language. Mirrors the rendering order
// of the Properties block closely enough for occurrence-based jump to work.
function extractPropText(data, lang) {
  const parts = [];

  function walk(value) {
    if (value == null || value instanceof Date) return;
    if (typeof value === 'number' || typeof value === 'boolean') return;
    if (isDurationObj(value)) return;
    if (isLocalizedObj(value)) {
      const v = value[lang] ?? value.en ?? Object.values(value).find((x) => x != null) ?? '';
      if (v) parts.push(stripMd(String(v)));
      return;
    }
    if (Array.isArray(value)) { value.forEach(walk); return; }
    if (typeof value === 'object') { Object.values(value).forEach(walk); return; }
    if (typeof value === 'string') parts.push(stripMd(value));
  }

  for (const [key, val] of Object.entries(data)) {
    if (key === 'title') continue; // searched via the title mechanism
    // Generic walk handles releases too: it descends the array of release
    // objects and collects event / venue / version strings (Date values for
    // `date` are skipped). Event names that are localized objects are picked.
    walk(val);
  }
  return parts.filter(Boolean).join(' ');
}

function stripMd(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/gs, '$1')
    .replace(/\*(.+?)\*/gs, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/:::\s*\w*/g, '')
    .replace(/\[\^[^\]]+\]:[^\n]*/g, '')
    .replace(/\[\^[^\]]+\]/g, '')
    .replace(/\n{2,}/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const WINDOW = 150;

// Build a snippet window around the character at `idx`.
function snippetAt(text, idx, queryLen) {
  const before = Math.max(0, idx - Math.round(WINDOW / 3));
  const after = Math.min(
    text.length,
    idx + queryLen + Math.round((WINDOW * 2) / 3),
  );
  const prefix = before > 0 ? '…' : '';
  const suffix = after < text.length ? '…' : '';
  const snippet = prefix + text.slice(before, after) + suffix;
  const mStart = prefix.length + (idx - before);
  const mEnd = mStart + queryLen;
  return { snippet, mStart, mEnd };
}

// All start indices of `q` in `textLo`, in order.
function allIndices(textLo, q) {
  const out = [];
  let s = 0;
  while (true) {
    const i = textLo.indexOf(q, s);
    if (i === -1) break;
    out.push(i);
    s = i + q.length;
  }
  return out;
}

// Snippets for one language's stripped body. Occurrences closer than WINDOW
// chars are merged into a single snippet (so two nearby matches don't produce
// near-duplicate previews). Each snippet carries `occ` — the 0-based rank of
// its representative match among ALL occurrences in this text — so the jump
// target can locate the exact occurrence in the rendered article, not just the
// first one.
function snippetsForText(text, query) {
  const q = query.toLowerCase();
  if (!q) return [];
  const idxs = allIndices(text.toLowerCase(), q);
  if (!idxs.length) return [];

  const results = [];
  let i = 0;
  while (i < idxs.length) {
    const groupStart = i;
    while (i + 1 < idxs.length && idxs[i + 1] - idxs[i] < WINDOW) i++;
    const repIdx = idxs[groupStart];
    results.push({
      ...snippetAt(text, repIdx, q.length),
      matchText: text.slice(repIdx, repIdx + q.length),
      occ: groupStart, // rank among all occurrences in this language's body
    });
    i++;
  }
  return results;
}

// Search all frontmatter property values (except title) across all languages.
// Returns snippets in the same { lang, snippet, mStart, mEnd, matchText, occ }
// format as bodyMatchAll. `occ` is the occurrence rank within that language's
// concatenated prop text, used by ArtworkPage to jump to the right occurrence
// inside the rendered .properties block.
export function propMatchAll(data, query, currentLang) {
  if (!query.trim()) return [];
  const langs = currentLang
    ? [currentLang, ...LANGS.filter((l) => l !== currentLang)]
    : LANGS;

  const seen = new Set();
  const out = [];
  for (const lang of langs) {
    const text = extractPropText(data, lang);
    for (const hit of snippetsForText(text, query)) {
      if (seen.has(hit.snippet)) continue;
      seen.add(hit.snippet);
      out.push({ lang, ...hit });
    }
  }
  return out;
}

// YouTube links in body markdown render as <iframe> with no text children
// (see Markdown.jsx youTubeId / components.a). Strip them before building the
// searchable text so occurrence counts stay in sync with the DOM.
const YOUTUBE_LINK_RE = /\[[^\]]*\]\(https?:\/\/(?:youtu\.be|(?:www\.)?youtube\.com)\/[^)]*\)/g;

// Search body content across all languages. The current language is searched
// first so that, when text is shared across languages (outside ::: fences),
// the kept (deduped) snippet belongs to the current language and needs no
// language switch. Returns { lang, snippet, mStart, mEnd, matchText, occ }.
export function bodyMatchAll(body, query, currentLang) {
  if (!query.trim()) return [];
  const langs = currentLang
    ? [currentLang, ...LANGS.filter((l) => l !== currentLang)]
    : LANGS;

  const seen = new Set(); // dedup identical snippet text (shared content)
  const out = [];
  for (const lang of langs) {
    const text = stripMd(pickLanguage(body, lang).replace(YOUTUBE_LINK_RE, ''));
    for (const hit of snippetsForText(text, query)) {
      if (seen.has(hit.snippet)) continue;
      seen.add(hit.snippet);
      out.push({ lang, ...hit });
    }
  }
  return out;
}
