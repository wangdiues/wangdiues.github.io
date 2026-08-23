import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const detailPage = readFileSync('src/pages/case-studies/[slug].astro', 'utf8');
const selectedWork = readFileSync('src/components/sections/CaseStudies.astro', 'utf8');

test('all project detail pages use a shared length-aware responsive title scale', () => {
  assert.match(detailPage, /titleLength > 80 \? 'long' : titleLength > 55 \? 'medium' : 'standard'/);
  assert.equal((detailPage.match(/class="project-title" data-title-scale=\{titleScale\}/g) ?? []).length, 2);
  assert.match(detailPage, /font-size: clamp\(2\.4rem, 1\.55rem \+ 3\.5vw, 4\.5rem\)/);
  assert.match(detailPage, /font-size: clamp\(1\.95rem, 1\.42rem \+ 2\.4vw, 3\.35rem\)/);
});

test('long project titles wrap naturally and remain start-aligned', () => {
  assert.match(detailPage, /\.project-title\[data-title-scale='long'\][\s\S]*text-wrap: pretty/);
  assert.match(detailPage, /\.project-title[\s\S]*overflow-wrap: break-word/);
  assert.match(detailPage, /\.project-title[\s\S]*text-align: start/);
  assert.doesNotMatch(detailPage, /<br\s*\/?>/);
});

test('selected-work project titles wrap instead of being truncated', () => {
  assert.match(selectedWork, /class="project-list-title/);
  assert.doesNotMatch(selectedWork, /class="[^\"]*project-list-title[^\"]*truncate/);
  assert.match(selectedWork, /\.project-list-title,[\s\S]*text-wrap: pretty/);
  assert.match(selectedWork, /class="project-preview-title/);
  assert.match(selectedWork, /class="group flex items-start/);
});
