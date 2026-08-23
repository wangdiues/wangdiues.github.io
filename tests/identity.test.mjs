import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import test from 'node:test';

const duplicateName = new RegExp(['Wangdi', 'Wangdi'].join(' '), 'i');
const textExtensions = new Set(['.astro', '.js', '.json', '.md', '.mjs', '.ts']);

function textFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return textFiles(path);
    return textExtensions.has(extname(entry.name)) ? [path] : [];
  });
}

test('the portfolio consistently uses the mononym Wangdi', () => {
  const files = ['package.json', ...textFiles('src'), 'scripts/build-clp-public-brief.mjs'];
  for (const file of files) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), duplicateName, file);
  }
  assert.doesNotMatch(
    readFileSync('public/CLP/Application-20636_CLP_Final.pdf', 'latin1'),
    duplicateName,
    'public Connected Skies brief'
  );
});

test('the website reflects the current 2026 CV profile', () => {
  const hero = readFileSync('src/components/sections/Hero.astro', 'utf8');
  const currentRole = readFileSync('src/content/experience/nwfp-section.md', 'utf8');
  const teaching = readFileSync('src/content/experience/adjunct-lecturer.md', 'utf8');
  const project = readFileSync('src/content/case-studies/connected-skies-great-hornbills.md', 'utf8');

  assert.match(hero, /<h1 class="sr-only">Wangdi<\/h1>/);
  assert.match(hero, /wangdi-profile\.jpg/);
  assert.doesNotMatch(hero, /Senior Forestry Officer/);
  assert.match(currentRole, /March 2026 - Present/);
  assert.match(teaching, /August 2026 - December 2026/);
  assert.match(project, /role: Team Leader/);
  assert.match(project, /Future Conservationist Award/);

  if (existsSync('static/Wangdi_CV_2026.pdf')) {
    assert.deepEqual(
      readFileSync('public/Wangdi_CV_2026.pdf'),
      readFileSync('static/Wangdi_CV_2026.pdf')
    );
  }

  const socialCard = readFileSync('public/og.png');
  assert.equal(socialCard.readUInt32BE(16), 1200);
  assert.equal(socialCard.readUInt32BE(20), 630);
});
