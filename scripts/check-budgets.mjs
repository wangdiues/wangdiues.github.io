import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIR = "public/publications";
const MAX_FILE = 2_000_000;
const MAX_TOTAL = 10_000_000;
const EXCEPTIONS = {
  "forest-gradient-bhutan-main.pdf": 2_300_000,
  "fundamental-realized-habitat.pdf": 2_450_000,
};

const failures = [];
let total = 0;

for (const name of readdirSync(DIR)) {
  const size = statSync(join(DIR, name)).size;
  total += size;
  const limit = EXCEPTIONS[name] ?? MAX_FILE;
  if (size > limit) {
    failures.push(
      `${name}: ${(size / 1e6).toFixed(2)} MB exceeds ${(limit / 1e6).toFixed(
        1
      )} MB`
    );
  }
}

if (total > MAX_TOTAL) {
  failures.push(`directory total ${(total / 1e6).toFixed(2)} MB exceeds 10 MB`);
}

if (failures.length > 0) {
  console.error(
    "Budget violations:\n" + failures.map((f) => `  - ${f}`).join("\n")
  );
  process.exit(1);
}

console.log(
  `Publication PDFs OK: ${readdirSync(DIR).length} files, ${(
    total / 1e6
  ).toFixed(2)} MB / 10 MB`
);
