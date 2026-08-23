import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

const failures = [];

// Walk recursively so nested files cannot bypass manifest or size validation.
function collect(dir, prefix = '') {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...collect(join(dir, entry.name), rel));
    } else if (entry.isFile()) {
      files.push({ name: rel, size: statSync(join(dir, entry.name)).size });
    }
  }
  return files;
}

function checkRegistry({ label, dir, contentDir, manifestFile, contentKey }) {
  if (!existsSync(dir)) {
    failures.push(`${dir}: approved public document directory is missing`);
    return { label, count: 0, total: 0, totalMaxBytes: 0 };
  }

  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
  const files = collect(dir);
  const approved = new Map();
  const contentSlugs = new Set(
    readdirSync(contentDir)
      .filter((name) => name.endsWith('.md'))
      .map((name) => name.replace(/\.md$/, ''))
  );
  let total = 0;

  if (!Number.isInteger(manifest.totalMaxBytes) || manifest.totalMaxBytes <= 0) {
    failures.push(`${manifestFile}: totalMaxBytes must be a positive integer`);
  }

  if (!Array.isArray(manifest.files)) {
    failures.push(`${manifestFile}: files must be an array`);
  } else {
    for (const asset of manifest.files) {
      if (!asset || typeof asset !== 'object') {
        failures.push(`${manifestFile}: every files entry must be an object`);
        continue;
      }
      if (
        typeof asset.file !== 'string' ||
        basename(asset.file) !== asset.file ||
        !/\.(pdf|png|jpe?g|webp)$/i.test(asset.file)
      ) {
        failures.push(`${manifestFile}: invalid asset filename ${JSON.stringify(asset.file)}`);
        continue;
      }
      if (approved.has(asset.file)) {
        failures.push(`${manifestFile}: duplicate entry for ${asset.file}`);
        continue;
      }
      if (!contentSlugs.has(asset[contentKey])) {
        failures.push(`${asset.file}: unknown ${label} slug ${JSON.stringify(asset[contentKey])}`);
      }
      if (typeof asset.rightsBasis !== 'string' || asset.rightsBasis.trim() === '') {
        failures.push(`${asset.file}: rightsBasis is required`);
      }
      if (typeof asset.approvalRef !== 'string' || asset.approvalRef.trim() === '') {
        failures.push(`${asset.file}: approvalRef is required`);
      } else if (!existsSync(asset.approvalRef.split('#')[0])) {
        failures.push(`${asset.file}: approvalRef does not point to an existing file`);
      }
      if (!Number.isInteger(asset.maxBytes) || asset.maxBytes <= 0) {
        failures.push(`${asset.file}: maxBytes must be a positive integer`);
      }
      approved.set(asset.file, asset);
    }
  }

  for (const { name, size } of files) {
    total += size;
    const asset = approved.get(name);
    if (!asset) {
      failures.push(`${dir}/${name}: public file is not present in the approved asset manifest`);
      continue;
    }
    if (size > asset.maxBytes) {
      failures.push(
        `${dir}/${name}: ${(size / 1e6).toFixed(2)} MB exceeds ${(asset.maxBytes / 1e6).toFixed(1)} MB`
      );
    }
  }

  const publicNames = new Set(files.map(({ name }) => name));
  for (const name of approved.keys()) {
    if (!publicNames.has(name)) failures.push(`${name}: approved file is missing from ${dir}`);
  }

  if (Number.isInteger(manifest.totalMaxBytes) && total > manifest.totalMaxBytes) {
    failures.push(
      `${dir}: directory total ${(total / 1e6).toFixed(2)} MB exceeds ${(manifest.totalMaxBytes / 1e6).toFixed(0)} MB`
    );
  }

  return { label, count: files.length, total, totalMaxBytes: manifest.totalMaxBytes };
}

const results = [
  checkRegistry({
    label: 'publication',
    dir: 'public/publications',
    contentDir: 'src/content/publications',
    manifestFile: 'src/data/publication-assets.json',
    contentKey: 'publication',
  }),
  checkRegistry({
    label: 'case study',
    dir: 'public/CLP',
    contentDir: 'src/content/case-studies',
    manifestFile: 'src/data/case-study-document-assets.json',
    contentKey: 'caseStudy',
  }),
];

if (failures.length > 0) {
  console.error(`Budget violations:\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log(
  results
    .map(
      ({ label, count, total, totalMaxBytes }) =>
        `${label} PDFs: ${count} files, ${(total / 1e6).toFixed(2)} MB / ${(totalMaxBytes / 1e6).toFixed(0)} MB`
    )
    .join('\n')
);
