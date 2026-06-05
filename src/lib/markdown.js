import GithubSlugger from 'github-slugger';
import { resolveSlug } from './content.js';

// Extract the body for one language from text that may contain language
// fences:
//
//   ::: en
//   English prose
//   :::
//   ::: ko
//   한국어
//   :::
//
// Lines outside any fence are shared across all languages. If the text has
// no fences at all, it is returned unchanged.
const OPEN = /^:::\s*([a-z]{2})\s*$/;
const CLOSE = /^:::\s*$/;

export function pickLanguage(body, lang) {
  const lines = body.split('\n');
  const hasFences = lines.some((l) => OPEN.test(l.trim()));
  if (!hasFences) return body;

  const out = [];
  let current = null; // null = shared region
  for (const line of lines) {
    const trimmed = line.trim();
    const open = OPEN.exec(trimmed);
    if (open) {
      current = open[1];
      continue;
    }
    if (current !== null && CLOSE.test(trimmed)) {
      current = null;
      continue;
    }
    if (current === null || current === lang) out.push(line);
  }
  return out.join('\n').trim();
}

// Rewrite [[target]] and [[target|alias]] into standard markdown links
// pointing at the hash route for the resolved work. Unresolved links are
// rendered as plain text so dead links are visible but not broken anchors.
const WIKILINK = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

export function wikiLinks(body) {
  return body.replace(WIKILINK, (_, target, alias) => {
    const label = (alias ?? target).trim();
    const slug = resolveSlug(target);
    if (!slug) return label;
    return `[${label}](#/${encodeURI(slug)})`;
  });
}

// Expand [text](url1)(url2)... multi-link syntax: two or more consecutive URL
// groups after a link label are converted to plain text followed by individual
// ↗ links, one per URL. Single-URL links are left unchanged for normal rendering.
const MULTI_LINK = /\[([^\]]+)\]((?:\([^)]+\)){2,})/g;

export function expandMultiLinks(str) {
  return str.replace(MULTI_LINK, (_, text, urlPart) => {
    const urls = [...urlPart.matchAll(/\(([^)]+)\)/g)].map((m) => m[1]);
    return text + ' ' + urls.map((u) => `[↗](${u})`).join(' ');
  });
}

// Extract all URLs from [text](url1)(url2)... syntax. Returns [] if no match.
export function mdLinkUrls(s) {
  const m = String(s ?? '').match(/^\[([^\]]+)\]((?:\([^)]+\))+)$/);
  if (!m) return [];
  return [...m[2].matchAll(/\(([^)]+)\)/g)].map((g) => g[1]);
}

// Extract every [[target]] / [[target|alias]] wikilink from a string, resolving
// each to its work slug. Returns [{ target, alias, slug }] in order of
// appearance; `slug` is null when the target doesn't resolve. Used to render
// wikilinks attached to enum pills as page-icon links.
export function mdWikiLinks(s) {
  const out = [];
  for (const m of String(s ?? '').matchAll(WIKILINK)) {
    out.push({ target: m[1].trim(), alias: m[2]?.trim() || null, slug: resolveSlug(m[1]) });
  }
  return out;
}

export function prepare(body, lang) {
  return expandMultiLinks(wikiLinks(pickLanguage(body, lang)));
}

export function firstH1Text(body) {
  const m = /^#\s+(.+?)\s*#*\s*$/m.exec(body);
  return m ? plainText(m[1]) : '';
}

export function stripFirstH1(body) {
  return body.replace(/^#\s+.+?\s*#*\s*$(?:\r?\n)?/m, '');
}

// Strip inline markdown so a heading reads cleanly in an outline.
export function plainText(s) {
  return s
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, t, a) => a ?? t) // wikilinks
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // [label](url) -> label
    .replace(/[*_`~]/g, '') // emphasis / code / strikethrough markers
    .trim();
}

// Extract the ATX heading outline (# .. ######) from a body, for the given
// language. Headings inside fenced code blocks are ignored. Returns a flat
// list of { level, text, id }; use buildHeadingTree to nest it. `id` is the
// slug github-slugger/rehype-slug assigns to the same heading in the rendered
// article, so the outline can deep-link to it. The slugger is stateful (it
// dedupes repeats with -1, -2, …) and must see headings in document order —
// which mirrors how rehype-slug runs over the article.
const ATX = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const FENCE = /^\s*(```|~~~)/;

export function extractHeadings(body, lang) {
  const lines = pickLanguage(body, lang).split('\n');
  const slugger = new GithubSlugger();
  const out = [];
  let inFence = false;
  for (const line of lines) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = ATX.exec(line);
    if (m) {
      const text = plainText(m[2]);
      out.push({ level: m[1].length, text, id: slugger.slug(text) });
    }
  }
  return out;
}

// Nest a flat heading list by level into { level, text, children } nodes.
export function buildHeadingTree(headings) {
  const root = { children: [] };
  const stack = [{ level: 0, node: root }];
  for (const h of headings) {
    const node = { ...h, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].level >= h.level)
      stack.pop();
    stack[stack.length - 1].node.children.push(node);
    stack.push({ level: h.level, node });
  }
  return root.children;
}
