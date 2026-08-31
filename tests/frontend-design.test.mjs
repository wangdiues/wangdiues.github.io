import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(path, 'utf8');

function luminance(hex) {
  const channels = [1, 3, 5]
    .map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(first, second) {
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function tokenValue(tokens, path) {
  const parts = path.split('.');
  let node = tokens.color;
  for (const part of parts) node = node[part];
  return node.value;
}

test('the NVIDIA NIM-inspired design system is persisted and token-driven, in both themes', () => {
  const master = read('design-system/wangdi-portfolio/MASTER.md');
  const tokens = JSON.parse(read('tokens/tokens.json'));

  assert.match(master, /conservation-research portfolio/i);
  assert.match(master, /4\.5:1 minimum contrast/);

  // Dark (default)
  const darkBg = tokenValue(tokens, 'ink.900');
  const darkRaised = tokenValue(tokens, 'ink.800');
  assert.equal(darkBg, '#0a0c0b');
  assert.equal(tokenValue(tokens, 'paper.50'), '#ffffff');
  assert.equal(tokenValue(tokens, 'nvidia-green.500'), '#76b900');
  assert.ok(contrast(tokenValue(tokens, 'paper.50'), darkBg) >= 7);
  assert.ok(contrast(tokenValue(tokens, 'slate.400'), darkBg) >= 4.5);
  assert.ok(contrast(tokenValue(tokens, 'nvidia-green.400'), darkBg) >= 4.5);
  assert.ok(contrast(tokenValue(tokens, 'paper.50'), darkRaised) >= 7);
  assert.ok(contrast(tokenValue(tokens, 'nvidia-green.400'), darkRaised) >= 4.5);
  assert.ok(contrast(tokenValue(tokens, 'tag-blue.400'), darkBg) >= 4.5);
  assert.ok(contrast(tokenValue(tokens, 'tag-purple.400'), darkBg) >= 4.5);

  // Light (toggle) — a genuinely designed second theme, not an inversion trick
  const lightBg = tokenValue(tokens, 'light.bg-base');
  const lightRaised = tokenValue(tokens, 'light.bg-raised');
  assert.ok(contrast(tokenValue(tokens, 'light.text-primary'), lightBg) >= 7);
  assert.ok(contrast(tokenValue(tokens, 'light.text-muted'), lightBg) >= 4.5);
  assert.ok(contrast(tokenValue(tokens, 'light.accent'), lightBg) >= 4.5);
  assert.ok(contrast(tokenValue(tokens, 'light.text-muted'), lightRaised) >= 4.5);
  assert.ok(contrast(tokenValue(tokens, 'light.accent'), lightRaised) >= 4.5);
});

test('the type pairing keeps the validated serif/sans identity', () => {
  const tokens = JSON.parse(read('tokens/tokens.json'));
  assert.match(tokens.font.heading.value, /Source Serif 4/);
  assert.match(tokens.font.body.value, /Inter/);
});

test('the light/dark toggle is present, wired, and reversible — an owner-selected mechanism, not optional', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  const nav = read('src/components/Nav.astro');
  const globalStyles = read('src/styles/global.css');

  // No-FOUC init: reads persisted choice, else prefers-color-scheme, defaults dark.
  assert.match(layout, /dataset\.theme = theme/);
  assert.match(layout, /prefers-color-scheme: light/);
  assert.match(nav, /id="theme-toggle"/);
  assert.doesNotMatch(nav, /display:\s*none/);
  assert.match(nav, /localStorage\.setItem\('theme'/);
  assert.match(nav, /prefers-reduced-motion: reduce/);

  // The theme block must actually exist and must not be neutralized by an
  // unconditional !important layer forcing one theme regardless of data-theme.
  assert.match(globalStyles, /:root\[data-theme='light'\]/);
  assert.doesNotMatch(globalStyles, /--color-[\w-]+:[^;]+!important/);
});

test('shared UI foundations preserve keyboard and reduced-motion access', () => {
  const globalStyles = read('src/styles/global.css');
  const navigation = read('src/components/Nav.astro');

  assert.match(globalStyles, /:focus-visible/);
  assert.match(globalStyles, /prefers-reduced-motion: reduce/);
  assert.match(globalStyles, /\.site-shell/);
  assert.match(navigation, /aria-expanded="false"/);
  assert.match(navigation, /event\.key === 'Escape'/);
  assert.match(navigation, /h-11 w-11/);
  assert.match(navigation, /Open Science & Reproducible Research/);
  assert.match(navigation, /xl:hidden/);
  assert.match(navigation, /max-width: 1279px/);
});

test('the hero is professionally structured, portrait-led, semantic, and image-optimized', () => {
  const hero = read('src/components/sections/Hero.astro');
  const homepage = read('src/pages/index.astro');

  assert.doesNotMatch(hero, /Wangdi · Senior Forestry Officer/);
  assert.doesNotMatch(hero, /26\.85° N, 89\.38° E/);
  assert.doesNotMatch(hero, /Not a species list/);
  assert.doesNotMatch(hero, /I turn field evidence into decisions for living landscapes/);
  assert.match(hero, /<h1[^>]*>[\s\S]*Wangdi[\s\S]*<\/h1>/);
  assert.match(hero, /Senior Forestry Officer/);
  assert.match(hero, /Biodiversity, Climate &amp; Forest Governance/);
  assert.match(hero, /Community-Based NWFP Management/);
  assert.match(hero, /2026 CLP Future Conservationist Team Award Winner/);
  assert.match(hero, /Meritorious Promotion/);
  assert.match(hero, /Professional Profile/);
  assert.match(hero, /ResearchGate/);
  assert.match(hero, /import \{ Image \} from 'astro:assets'/);
  assert.match(hero, /wangdi-profile-cutout-hd\.png/);
  assert.match(hero, /alt="Portrait of Wangdi"/);
  assert.match(hero, /object-fit:\s*cover/);
  assert.match(hero, /fetchpriority="high"/);
  assert.match(hero, /sizes="\(min-width: 1024px\)/);
  assert.match(homepage, /title="Wangdi \| Conservation research/);
});

test('the homepage explains the evidence-to-action method and foregrounds project outcomes', () => {
  const approach = read('src/components/sections/Approach.astro');
  const homepage = read('src/pages/index.astro');
  const projects = read('src/components/sections/CaseStudies.astro');

  assert.match(approach, /<ol[^>]*>/);
  assert.match(approach, /Observe the system/);
  assert.match(approach, /Test the evidence/);
  assert.match(approach, /Move evidence into action/);
  assert.match(approach, /flex min-h-80 flex-col/);
  assert.match(approach, /mt-auto border-t/);
  assert.doesNotMatch(approach, /absolute inset-x-6 bottom-6/);
  assert.match(homepage, /<Approach \/>/);
  assert.match(projects, /study\.data\.impact/);
  assert.match(projects, /data-work-item/);
});

test('career highlights are an accessible, indexed evidence summary linked to the full CV', () => {
  const homepage = read('src/pages/index.astro');
  const highlights = read('src/components/sections/CareerHighlights.astro');

  assert.match(homepage, /<CareerHighlights \/>/);
  assert.match(highlights, /<section id="highlights"/);
  assert.match(highlights, /<dl class=/);
  assert.match(highlights, /<dt class=/);
  assert.match(highlights, /<dd class=/);
  assert.match(highlights, /href="\/cv"/);
  assert.equal((highlights.match(/label:/g) ?? []).length, 8);
});

test('the constellation canvas is ambient, non-blocking, and respects reduced motion', () => {
  const canvas = read('src/components/ConstellationCanvas.astro');
  const layout = read('src/layouts/BaseLayout.astro');

  assert.match(layout, /<ConstellationCanvas \/>/);
  assert.match(canvas, /pointer-events:\s*none/);
  assert.match(canvas, /prefers-reduced-motion:\s*reduce\)\s*\{\s*#constellation-canvas\s*\{\s*display:\s*none/);
  assert.match(canvas, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches/);
  assert.match(canvas, /document\.addEventListener\('visibilitychange'/);
  assert.match(canvas, /aria-hidden="true"/);

  // body has no stacking context of its own by default, so a z-index: -1
  // canvas (or the grid decor) paints BEHIND body's own opaque background
  // instead of above it — confirmed live: the canvas drew real pixels but
  // nothing appeared on screen until body got a stacking-context trigger.
  const globalStyles = read('src/styles/global.css');
  assert.match(globalStyles, /body\s*\{[^}]*isolation:\s*isolate/);
});

test('publication status badges use the three-accent NVIDIA palette with real semantic meaning', () => {
  const badge = read('src/components/ui/StatusBadge.astro');

  assert.match(badge, /published: 'border-nvidia-green-500\/30 bg-nvidia-green-500\/15/);
  assert.match(badge, /'under-review': 'border-tag-blue-500\/45 bg-tag-blue-500\/10/);
  assert.match(badge, /'in-preparation': 'border-tag-purple-500\/45 bg-tag-purple-500\/10/);
  assert.doesNotMatch(badge, /ember|amber-/);
});

test('selected work is a hover-preview list where every item is a real, always-focusable link', () => {
  const work = read('src/components/sections/CaseStudies.astro');

  assert.match(work, /data-panel/);
  assert.match(work, /addEventListener\('mouseenter'/);
  assert.match(work, /addEventListener\('focus'/);
  // Every list item must be a genuine <a href>, not a script-dependent control —
  // no roving tabindex needed, and no JS means the list still fully navigates.
  assert.match(work, /<a\s+[^>]*href=\{href\}[^>]*data-work-item/s);
});
