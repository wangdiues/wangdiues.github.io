import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";

const DIR = "public/publications";
const CONTENT_DIR = "src/content/publications";
const MANIFEST = "src/data/publication-assets.json";
const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));

const failures = [];
let total = 0;

// Walk recursively: a nested folder of PDFs must not escape the per-file check.
// `statSync` on a directory reports a near-zero size, so counting entries blindly
// would let an arbitrarily large subtree through while reporting the tree as empty.
function collect(dir, prefix = "") {
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

const files = collect(DIR);
const approved = new Map();
const contentSlugs = new Set(
  readdirSync(CONTENT_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""))
);

if (!Number.isInteger(manifest.totalMaxBytes) || manifest.totalMaxBytes <= 0) {
  failures.push(`${MANIFEST}: totalMaxBytes must be a positive integer`);
}

if (!Array.isArray(manifest.files)) {
  failures.push(`${MANIFEST}: files must be an array`);
} else {
  for (const asset of manifest.files) {
    if (!asset || typeof asset !== "object") {
      failures.push(`${MANIFEST}: every files entry must be an object`);
      continue;
    }
    if (
      typeof asset.file !== "string" ||
      basename(asset.file) !== asset.file ||
      !asset.file.toLowerCase().endsWith(".pdf")
    ) {
      failures.push(`${MANIFEST}: invalid PDF filename ${JSON.stringify(asset.file)}`);
      continue;
    }
    if (approved.has(asset.file)) {
      failures.push(`${MANIFEST}: duplicate entry for ${asset.file}`);
      continue;
    }
    if (!contentSlugs.has(asset.publication)) {
      failures.push(`${asset.file}: unknown publication slug ${JSON.stringify(asset.publication)}`);
    }
    if (typeof asset.rightsBasis !== "string" || asset.rightsBasis.trim() === "") {
      failures.push(`${asset.file}: rightsBasis is required`);
    }
    if (typeof asset.approvalRef !== "string" || asset.approvalRef.trim() === "") {
      failures.push(`${asset.file}: approvalRef is required`);
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
    failures.push(`${name}: public file is not present in the approved asset manifest`);
    continue;
  }
  if (size > asset.maxBytes) {
    failures.push(
      `${name}: ${(size / 1e6).toFixed(2)} MB exceeds ${(asset.maxBytes / 1e6).toFixed(
        1
      )} MB`
    );
  }
}

const publicNames = new Set(files.map(({ name }) => name));
for (const name of approved.keys()) {
  if (!publicNames.has(name)) failures.push(`${name}: approved file is missing from ${DIR}`);
}

if (Number.isInteger(manifest.totalMaxBytes) && total > manifest.totalMaxBytes) {
  failures.push(
    `directory total ${(total / 1e6).toFixed(2)} MB exceeds ${(
      manifest.totalMaxBytes / 1e6
    ).toFixed(0)} MB`
  );
}

if (failures.length > 0) {
  console.error(
    "Budget violations:\n" + failures.map((f) => `  - ${f}`).join("\n")
  );
  process.exit(1);
}

console.log(
  `Publication PDFs OK: ${files.length} files, ${(total / 1e6).toFixed(2)} MB / ${(
    manifest.totalMaxBytes / 1e6
  ).toFixed(0)} MB`
);
