import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';

const slug = 'connected-skies-great-hornbills';
const content = readFileSync(`src/content/case-studies/${slug}.md`, 'utf8');
const route = readFileSync('src/pages/case-studies/[slug].astro', 'utf8');
const gallery = readFileSync('src/components/case-studies/ProjectGallery.astro', 'utf8');

test('Connected Skies is an additive rich case study', () => {
  assert.match(content, /Connected Skies: Bhutan's First GPS-AI Study/);
  assert.match(content, /Future Conservationist Award/);
  assert.match(content, /30 trained Hornbill Guardians/);
  assert.match(content, /Download CLP Project Proposal/);
  assert.equal(readdirSync('src/content/case-studies').filter((name) => name.endsWith('.md')).length, 6);
});

test('the project template exposes all required semantic sections', () => {
  for (const heading of ['Project Overview', 'Research Approach', 'Community Conservation', 'Expected Outputs']) {
    assert.match(route, new RegExp(heading));
  }
  assert.match(gallery, /Project gallery/);
  assert.match(route, /rel="noopener noreferrer"/);
  assert.match(route, /download/);
});

test('all nine supplied project images are tracked through Astro assets', () => {
  const expected = ['GH1.jpeg', 'GH2.jpeg', 'GH3.jpeg', 'GH4.jpeg', 'GH6.jpeg', 'WB1.jpeg', 'SC3.jpeg', 'W1.jpg', 'W2.jpg'];
  const actual = readdirSync('src/assets/projects/connected-skies').sort();
  assert.deepEqual(actual, expected.sort());
});

test('only the public-safe PDF is placed in the CLP public directory', () => {
  assert.equal(existsSync('public/CLP/Application-20636_CLP_Final.pdf'), true);
  assert.equal(existsSync('public/CLP/Application-20636_CLP_Final.docx'), false);
  assert.deepEqual(readdirSync('public/CLP'), ['Application-20636_CLP_Final.pdf']);
  const pdf = readFileSync('public/CLP/Application-20636_CLP_Final.pdf', 'latin1');
  for (const privateLabel of ['PRIVATE AND CONFIDENTIAL', 'passport', 'date of birth', 'referee', 'mobile number']) {
    assert.equal(pdf.toLowerCase().includes(privateLabel.toLowerCase()), false);
  }
});

test('the public project document is covered by the deployment allowlist', () => {
  const budgetCheck = readFileSync('scripts/check-budgets.mjs', 'utf8');
  assert.match(budgetCheck, /public\/CLP/);
  assert.match(budgetCheck, /case-study-document-assets\.json/);
});
