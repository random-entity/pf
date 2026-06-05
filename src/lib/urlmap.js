// URL map — the `[text](^label)` link syntax.
//
// A link whose target starts with `^` is a *reference*: the real URL is looked
// up by `label`, resolved **page-local first, then the shared glossary** (mirrors
// the footnote glossary). Definitions live at the bottom of a page (or in
// glossary/glossary.md) as their own line:
//
//   (^label): https://example.com
//
// Unlike footnotes, a URL ref produces no marker or list entry — it just turns
// the `[text]` into an ordinary external link. It also composes with the
// multi-link syntax: `[text](^a)(^b)` yields one ↗ per resolved URL.
import { pickLanguage } from './markdown.js';
import { globalUrl } from './glossary.js';

// A URL-map definition line: `(^label): url`.
const URL_DEF_RE = /^\(\^([A-Za-z0-9_-]+)\):[ \t]*(.*)$/gm;
// A URL-map reference used as a link target: `(^label)`.
const URL_REF_RE = /\(\^([A-Za-z0-9_-]+)\)/g;

function parseUrlDefs(text) {
  const map = new Map();
  for (const m of text.matchAll(URL_DEF_RE)) if (!map.has(m[1])) map.set(m[1], m[2].trim());
  return map;
}

// Build a resolver for one page + language. Page-local `(^label): url` defs win
// (current language first, then any fence as a cross-language fallback); the
// shared glossary is the final fallback. Returns `(label) => url | null`.
export function buildUrlResolver(rawBody, lang) {
  const cur = parseUrlDefs(pickLanguage(rawBody || '', lang));
  const all = parseUrlDefs(rawBody || '');
  return (label) => cur.get(label) ?? all.get(label) ?? globalUrl(label, lang) ?? null;
}

// Remove `(^label): url` definition lines so they never render as prose. Run
// this BEFORE resolveUrlRefs (a def line itself contains a `(^label)` token).
export function stripUrlDefs(text) {
  return (text || '').replace(URL_DEF_RE, '').replace(/\n{3,}/g, '\n\n');
}

// Replace every `(^label)` link target with its resolved URL. An unresolved
// label is left untouched (the link then points at the literal `^label`, a
// visibly broken target that flags the authoring error).
export function resolveUrlRefs(text, resolve) {
  if (!text || !resolve) return text;
  return text.replace(URL_REF_RE, (full, label) => {
    const url = resolve(label);
    return url ? `(${url})` : full;
  });
}
