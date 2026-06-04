#!/usr/bin/env node
// Rename an enum value across all artwork Markdown files.
//
//   node scripts/rename-value.mjs <key> <oldValue> <newValue> [--dry]
//
// Examples:
//   node scripts/rename-value.mjs tags oil "oil paint"
//   node scripts/rename-value.mjs tools Csound Faust --dry
//
// Works on list-of-strings keys (e.g. tags, tools) and plain scalar string
// keys. Only files whose frontmatter actually carries the value are touched,
// and the edit is scoped to that key's line(s) so the rest of the hand-authored
// frontmatter (flow style, comments, ordering) is preserved. Localized values
// (e.g. genre) are reported but not rewritten — edit those by hand.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = join(
  fileURLToPath(new URL('.', import.meta.url)),
  '..',
  'src',
  'content',
);
const FM = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n[\s\S]*)?$/;

const [key, oldValue, newValue, ...rest] = process.argv.slice(2);
const dry = rest.includes('--dry');

if (!key || oldValue == null || newValue == null) {
  console.error(
    'Usage: node scripts/rename-value.mjs <key> <oldValue> <newValue> [--dry]',
  );
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (extname(p) === '.md') out.push(p);
  }
  return out;
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const unquote = (s) => s.replace(/^["']|["']$/g, '');
// Quote a YAML scalar only when it contains characters that would break parsing.
const quoteIfNeeded = (s) =>
  /[,:#[\]{}&*!|>'"%@`]|^\s|\s$/.test(s) ? JSON.stringify(s) : s;

// Replace within the matched key's value region only.
function rewriteFrontmatter(fm) {
  let changed = false;

  // Flow array:  key: [a, b, c]
  const flow = new RegExp(`^(\\s*${escapeRe(key)}:\\s*\\[)([^\\]]*)(\\])`, 'm');
  if (flow.test(fm)) {
    fm = fm.replace(flow, (_m, pre, inner, post) => {
      const items = inner
        .split(',')
        .map((s) => unquote(s.trim()))
        .filter(Boolean);
      const next = [];
      const seen = new Set();
      for (const it of items) {
        const v = it === oldValue ? newValue : it;
        if (!seen.has(v)) {
          seen.add(v);
          next.push(v);
        }
        if (it === oldValue) changed = true;
      }
      return pre + next.map(quoteIfNeeded).join(', ') + post;
    });
    return { fm, changed };
  }

  // Block sequence:
  //   key:
  //     - a
  //     - b
  const lines = fm.split('\n');
  const keyLine = lines.findIndex((l) =>
    new RegExp(`^\\s*${escapeRe(key)}:\\s*$`).test(l),
  );
  if (keyLine !== -1) {
    for (let i = keyLine + 1; i < lines.length; i++) {
      const m = lines[i].match(/^(\s*-\s*)(["']?)(.*?)\2\s*$/);
      if (!m) break; // end of the block sequence
      if (m[3] === oldValue) {
        lines[i] = m[1] + quoteIfNeeded(newValue);
        changed = true;
      }
    }
    return { fm: lines.join('\n'), changed };
  }

  // Scalar:  key: value
  const scalar = new RegExp(
    `^(\\s*${escapeRe(key)}:\\s*)(["']?)${escapeRe(oldValue)}\\2\\s*$`,
    'm',
  );
  if (scalar.test(fm)) {
    fm = fm.replace(scalar, (_m, pre) => pre + quoteIfNeeded(newValue));
    changed = true;
  }
  return { fm, changed };
}

// Does this file's parsed frontmatter actually carry the value under `key`?
function carriesValue(data) {
  const v = data?.[key];
  if (v == null) return false;
  if (Array.isArray(v)) return v.includes(oldValue);
  if (typeof v === 'string') return v === oldValue;
  if (v && typeof v === 'object') return 'localized'; // signal: needs manual edit
  return false;
}

let touched = 0;
const localizedHits = [];

for (const file of walk(ROOT)) {
  const raw = readFileSync(file, 'utf8');
  const m = FM.exec(raw);
  if (!m) continue;
  let data;
  try {
    data = yaml.load(m[1]) || {};
  } catch {
    continue;
  }

  const carries = carriesValue(data);
  if (!carries) continue;
  if (carries === 'localized') {
    localizedHits.push(file);
    continue;
  }

  const { fm, changed } = rewriteFrontmatter(m[1]);
  if (!changed) continue;
  touched++;
  const next = `---\n${fm}\n---${m[2] ?? ''}`;
  if (dry) console.log(`would update: ${file}`);
  else {
    writeFileSync(file, next);
    console.log(`updated: ${file}`);
  }
}

if (localizedHits.length) {
  console.log(
    `\nSkipped ${localizedHits.length} file(s) where '${key}' is a localized object (edit by hand):`,
  );
  for (const f of localizedHits) console.log(`  ${f}`);
}
console.log(
  `\n${dry ? '[dry run] ' : ''}${touched} file(s) ${dry ? 'would change' : 'changed'}.`,
);
