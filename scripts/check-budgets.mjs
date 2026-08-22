import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIR = "public/publications";
const MAX_FILE = 2_000_000;
const MAX_TOTAL = 60_000_000;
// Per-file allowances above the 2 MB default. Oversized entries are either
// author-owned submissions (FRH, forest-gradient) or public RGoB documents
// openly distributed by DoFPS (plans, strategies, supplementary material).
const EXCEPTIONS = {
  "sarpang-forest-division-management-plan.pdf": 13_000_000,
  "climate-refugia-asian-elephants-supplementary.pdf": 4_800_000,
  "coexistence-strategy-gakiling.pdf": 4_500_000,
  "coexistence-strategy-dekiling.pdf": 4_300_000,
  "bc03-conservation-management-plan.pdf": 3_200_000,
  "fundamental-realized-habitat.pdf": 2_600_000,
  "forest-gradient-bhutan-fem-submission.pdf": 2_300_000,
  "forest-gradient-bhutan-main.pdf": 2_250_000,
  "community-assembly-disturbance-climate-gradient.pdf": 2_200_000,
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
  ).toFixed(2)} MB / ${MAX_TOTAL / 1e6} MB`
);
