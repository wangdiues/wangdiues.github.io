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

test('the conservation-editorial design system is persisted and token-driven', () => {
  const master = read('design-system/wangdi-portfolio/MASTER.md');
  const tokens = JSON.parse(read('tokens/tokens.json'));

  assert.match(master, /conservation-research portfolio/i);
  assert.match(master, /4\.5:1 minimum contrast/);
  assert.equal(tokens.color.ink['900'].value, '#081511');
  assert.equal(tokens.color.moss['400'].value, '#78c99a');
  assert.equal(tokens.color.slate['400'].value, '#a9b9b1');
  assert.ok(contrast(tokens.color.paper['50'].value, tokens.color.ink['900'].value) >= 7);
  assert.ok(contrast(tokens.color.slate['400'].value, tokens.color.ink['900'].value) >= 7);
  assert.ok(contrast(tokens.color.moss['400'].value, tokens.color.ink['900'].value) >= 7);
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

test('the redesigned hero remains semantic, responsive, and image optimized', () => {
  const hero = read('src/components/sections/Hero.astro');
  const homepage = read('src/pages/index.astro');

  assert.match(hero, /<h1[^>]*>Wangdi<\/h1>/);
  assert.match(hero, /import \{ Image \} from 'astro:assets'/);
  assert.match(hero, /fetchpriority="high"/);
  assert.match(hero, /sizes="\(min-width: 1024px\)/);
  assert.match(homepage, /title="Wangdi \| Conservation research/);
});
