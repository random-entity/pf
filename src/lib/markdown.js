import { resolveSlug } from './content.js'

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
const OPEN = /^:::\s*([a-z]{2})\s*$/
const CLOSE = /^:::\s*$/

export function pickLanguage(body, lang) {
  const lines = body.split('\n')
  const hasFences = lines.some((l) => OPEN.test(l.trim()))
  if (!hasFences) return body

  const out = []
  let current = null // null = shared region
  for (const line of lines) {
    const trimmed = line.trim()
    const open = OPEN.exec(trimmed)
    if (open) {
      current = open[1]
      continue
    }
    if (current !== null && CLOSE.test(trimmed)) {
      current = null
      continue
    }
    if (current === null || current === lang) out.push(line)
  }
  return out.join('\n').trim()
}

// Rewrite [[target]] and [[target|alias]] into standard markdown links
// pointing at the hash route for the resolved artwork. Unresolved links are
// rendered as plain text so dead links are visible but not broken anchors.
const WIKILINK = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g

export function wikiLinks(body) {
  return body.replace(WIKILINK, (_, target, alias) => {
    const label = (alias ?? target).trim()
    const slug = resolveSlug(target)
    if (!slug) return label
    return `[${label}](#/artwork/${encodeURI(slug)})`
  })
}

export function prepare(body, lang) {
  return wikiLinks(pickLanguage(body, lang))
}
