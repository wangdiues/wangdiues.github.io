import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const detailPage = readFileSync('src/pages/publications/[slug].astro', 'utf8');
const indexPage = readFileSync('src/pages/publications/index.astro', 'utf8');

test('publication detail titles use a shared length-aware responsive scale', () => {
  assert.match(detailPage, /titleLength > 150 \? 'long' : titleLength > 95 \? 'medium' : 'standard'/);
  assert.match(detailPage, /class="publication-title" data-title-scale=\{titleScale\}/);
  assert.match(detailPage, /font-size: clamp\(2\.4rem, 1\.55rem \+ 3\.5vw, 4\.5rem\)/);
  assert.match(detailPage, /font-size: clamp\(1\.875rem, 1\.4rem \+ 2\.2vw, 3rem\)/);
});

test('long scholarly titles wrap naturally and remain start-aligned', () => {
  assert.match(detailPage, /\.publication-title\[data-title-scale='long'\][\s\S]*text-wrap: pretty/);
  assert.match(detailPage, /\.publication-title[\s\S]*overflow-wrap: break-word/);
  assert.match(detailPage, /\.publication-title[\s\S]*text-align: start/);
  assert.doesNotMatch(detailPage, /<br\s*\/?>/);
});

test('the publication index applies the same natural wrapping treatment', () => {
  assert.match(indexPage, /class="publication-list-title/);
  assert.match(indexPage, /\.publication-list-title[\s\S]*text-wrap: pretty/);
  assert.match(indexPage, /\.publication-list-title[\s\S]*text-align: start/);
});
