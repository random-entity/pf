import yaml from 'js-yaml';
import { loc } from '../i18n.jsx';
import { pickLanguage, plainText } from './markdown.js';

// Eagerly load every work's markdown file as a raw string at build time.
// A "work" is anything in the portfolio — an artwork, a module, a toy, etc.;
// its kind is the `type` frontmatter property, NOT its folder. The subdirectories
// under src/content/ (personal-works/, modules/, toys/, …) are just a loose
// authoring convenience, so we glob ALL of them (home.md is the site intro, not a
// work, and is loaded separately by Home.jsx — exclude it here).
const files = import.meta.glob(['../content/**/*.md', '!../content/home.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

const FM = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function parse(raw) {
  const m = FM.exec(raw);
  if (!m) return { data: {}, body: raw };
  let data = {};
  try {
    data = yaml.load(m[1]) || {};
  } catch (e) {
    console.warn('Frontmatter parse error:', e);
  }
  return { data, body: m[2] };
}

function firstH1Text(body, lang) {
  const m = /^#\s+(.+?)\s*#*\s*$/m.exec(pickLanguage(body, lang));
  return m ? plainText(m[1]) : '';
}

// Conversion factors to meters for `dimensions`. Authors may write any of
// these units; the app normalizes everything to meters.
const UNIT_TO_M = {
  m: 1,
  cm: 0.01,
  mm: 0.001,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
};

// Convert a `{ width, height, …, unit }` object to plain meters, dropping the
// `unit` key (so it is never surfaced as its own property/facet).
function dimensionsToMeters(dim) {
  if (!dim || typeof dim !== 'object' || Array.isArray(dim)) return dim;
  const factor = UNIT_TO_M[String(dim.unit).toLowerCase()] ?? 1;
  const out = {};
  for (const [k, v] of Object.entries(dim)) {
    if (k === 'unit') continue;
    out[k] = typeof v === 'number' ? Math.round(v * factor * 1e4) / 1e4 : v;
  }
  return out;
}

export const works = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.replace('../content/', '').replace(/\.md$/, '');
    const { data, body } = parse(raw);
    if (data.dimensions) data.dimensions = dimensionsToMeters(data.dimensions);
    return {
      slug,
      name: slug.split('/').pop(),
      dirs: slug.split('/').slice(0, -1),
      data,
      body,
    };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

export const bySlug = Object.fromEntries(
  works.flatMap((w) => {
    const legacyDir = w.data.type === 'Module' ? 'modules' : 'works';
    return [
      [w.slug, w],
      // Backward compatibility for routes from the pre-refactor structure.
      [`${legacyDir}/${w.name}`, w],
    ];
  }),
);

// Resolve a wikilink target to a work's slug. Matches by exact slug,
// by trailing path segment, or by basename (case-insensitive).
export function resolveSlug(target) {
  const t = target.trim();
  if (bySlug[t]) return t;
  const lower = t.toLowerCase();
  const hit = works.find(
    (w) =>
      w.slug.toLowerCase() === lower ||
      w.slug.toLowerCase().endsWith('/' + lower) ||
      w.name.toLowerCase() === lower,
  );
  return hit ? hit.slug : null;
}

// Display title for a work in the given language.
export function titleOf(w, lang) {
  return loc(w.data.title, lang) || firstH1Text(w.body, lang) || w.name;
}
