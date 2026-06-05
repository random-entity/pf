// Global footnote / glossary source.
//
// There is no special reference syntax: a normal `[^label]` footnote reference
// in any work falls back to this file when the page defines no local `[^label]:`
// definition (see `footnotePlan` in WorkPage). Resolution is local-first — a
// page-local definition always overrides the glossary.
//
// The source is authored as markdown footnote definitions with the same
// `::: en|ko|ja` language fences as page content (see glossary/glossary.md). To
// later swap this for a real external repository, replace the `glossary/`
// directory with a git submodule — this import stays the same.
import { LANGS } from '../i18n.jsx';
import { pickLanguage } from './markdown.js';
import glossaryRaw from '../../glossary/glossary.md?raw';

// A single-line footnote definition: `[^label]: text`.
const DEF_RE = /^\[\^([A-Za-z0-9_-]+)\]:[ \t]*(.*)$/gm;
// A single-line URL-map definition: `(^label): https://…`.
const URL_DEF_RE = /^\(\^([A-Za-z0-9_-]+)\):[ \t]*(.*)$/gm;

function parseMatches(text, re) {
  const map = new Map();
  for (const m of text.matchAll(re)) if (!map.has(m[1])) map.set(m[1], m[2].trim());
  return map;
}
const parseDefs = (text) => parseMatches(text, DEF_RE);
const parseUrlDefs = (text) => parseMatches(text, URL_DEF_RE);

// Per-language definition maps. The file is static, so build them once at load.
// `pickLanguage` keeps the requested fence plus any unfenced (shared) text, so a
// definition written outside a fence is available in every language.
const defsByLang = Object.fromEntries(
  LANGS.map((lang) => [lang, parseDefs(pickLanguage(glossaryRaw, lang))]),
);

// Every label defined in any language — drives the existence check that decides
// whether a `[^label]` reference falls back to the glossary (only when the page
// has no local definition for it).
const allLabels = new Set(LANGS.flatMap((lang) => [...defsByLang[lang].keys()]));

export function hasGlobalFootnote(label) {
  return allLabels.has(label);
}

// Definition text for `label` in `lang`, falling back to English then to any
// language that defines it; null if the glossary doesn't define `label` at all.
export function globalFootnoteDef(label, lang) {
  for (const l of [lang, 'en', ...LANGS]) {
    const v = defsByLang[l]?.get(label);
    if (v != null) return v;
  }
  return null;
}

// --- URL map ---------------------------------------------------------------
// Shared `(^label): url` definitions, resolved the same way as footnotes
// (current language → English → any). Used by the `[text](^label)` link syntax.
const urlsByLang = Object.fromEntries(
  LANGS.map((lang) => [lang, parseUrlDefs(pickLanguage(glossaryRaw, lang))]),
);

export function globalUrl(label, lang) {
  for (const l of [lang, 'en', ...LANGS]) {
    const v = urlsByLang[l]?.get(label);
    if (v != null) return v;
  }
  return null;
}
