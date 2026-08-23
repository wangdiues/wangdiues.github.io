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

test('the princepal-inspired design system is persisted and token-driven, in both themes', () => {
  const master = read('design-system/wangdi-portfolio/MASTER.md');
  const tokens = JSON.parse(read('tokens/tokens.json'));

  assert.match(master, /conservation-research portfolio/i);
  assert.match(master, /4\.5:1 minimum contrast/);

  // Dark (default)
  const darkBg = tokenValue(tokens, 'ink.900');
  const darkRaised = tokenValue(tokens, 'ink.800');
  assert.equal(darkBg, '#1a130b');
  assert.equal(tokenValue(tokens, 'paper.50'), '#f5eedd');
  assert.equal(tokenValue(tokens, 'ember.500'), '#d9701e');
  assert.ok(contrast(tokenValue(tokens, 'paper.50'), darkBg) >= 7);
  assert.ok(contrast(tokenValue(tokens, 'taupe.400'), darkBg) >= 4.5);
  assert.ok(contrast(tokenValue(tokens, 'ember.400'), darkBg) >= 4.5);
  assert.ok(contrast(tokenValue(tokens, 'paper.50'), darkRaised) >= 7);
  assert.ok(contrast(tokenValue(tokens, 'ember.400'), darkRaised) >= 4.5);

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
});

test('the hero is concise, portrait-led, semantic, and image-optimized', () => {
  const hero = read('src/components/sections/Hero.astro');
  const homepage = read('src/pages/index.astro');

  assert.doesNotMatch(hero, /Wangdi · Senior Forestry Officer/);
  assert.doesNotMatch(hero, /26\.85° N, 89\.38° E/);
  assert.doesNotMatch(hero, /Not a species list/);
  assert.doesNotMatch(hero, /I turn field evidence into decisions for living landscapes/);
  assert.match(hero, /<h1 class="sr-only">Wangdi<\/h1>/);
  assert.match(hero, /import \{ Image \} from 'astro:assets'/);
  assert.match(hero, /wangdi-profile\.jpg/);
  assert.match(hero, /alt="Portrait of Wangdi"/);
  assert.match(hero, /aspect-\[3\/4\]/);
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
  assert.match(homepage, /<Approach \/>/);
  assert.match(projects, /study\.data\.impact/);
  assert.match(projects, /data-work-item/);
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
