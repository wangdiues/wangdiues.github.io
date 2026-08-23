import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('the divisional management plan uses its aligned Sarpang DFO preview image', () => {
  const assets = readFileSync('src/data/case-study-assets.ts', 'utf8');
  const selectedWork = readFileSync('src/components/sections/CaseStudies.astro', 'utf8');

  assert.match(assets, /wangdi-dfo-sarpang\.jpg/);
  assert.match(assets, /'divisional-forest-office-management-plan'/);
  assert.match(assets, /objectPosition: '50% 35%'/);
  assert.match(assets, /alt: 'Wangdi in forestry uniform outside the Divisional Forest Office/);
  assert.match(selectedWork, /caseStudyPreviewAssets\[slug\]/);
  assert.match(selectedWork, /object-position: \$\{objectPosition\}/);
});
