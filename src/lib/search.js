import { LANGS } from '../i18n.jsx';
import { pickLanguage } from './markdown.js';

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
    const text = stripMd(pickLanguage(body, lang));
    for (const hit of snippetsForText(text, query)) {
      if (seen.has(hit.snippet)) continue;
      seen.add(hit.snippet);
      out.push({ lang, ...hit });
    }
  }
  return out;
}
