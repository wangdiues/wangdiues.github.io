import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const CONTENT = "src/content";
const ROUTED_COLLECTIONS = ["publications", "case-studies"];
const failures = [];

function dirNames(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

for (const collection of ROUTED_COLLECTIONS) {
  const slugs = readdirSync(join(CONTENT, collection))
    .filter((name) => /\.mdx?$/.test(name))
    .map((name) => name.replace(/\.mdx?$/, ""));
  const routeDir = join(DIST, collection);

  try {
    dirNames(routeDir);
  } catch {
    failures.push(`${routeDir} does not exist — collection did not render`);
    continue;
  }

  for (const slug of slugs) {
    const canonical = join(routeDir, slug, "index.html");
    const legacy = join(routeDir, `${slug}.md`, "index.html");
    try {
      readFileSync(canonical, "utf8");
    } catch {
      failures.push(`${collection}/${slug}: canonical extensionless route is missing`);
    }
    try {
      const html = readFileSync(legacy, "utf8");
      const target = `/${collection}/${slug}/`;
      if (!html.includes('name="robots" content="noindex"')) {
        failures.push(`${collection}/${slug}.md: redirect must be noindex`);
      }
      if (!html.includes(`rel="canonical" href="${target}"`)) {
        failures.push(`${collection}/${slug}.md: redirect has the wrong canonical target`);
      }
    } catch {
      failures.push(`${collection}/${slug}.md: legacy redirect is missing`);
    }
  }

  const allowed = new Set(slugs.flatMap((slug) => [slug, `${slug}.md`]));
  for (const name of dirNames(routeDir)) {
    if (!allowed.has(name)) failures.push(`${collection}: unexpected route directory ${name}`);
  }
}

if (failures.length > 0) {
  console.error(
    "Route violations:\n" + failures.map((failure) => `  - ${failure}`).join("\n")
  );
  process.exit(1);
}

console.log(
  `Routes OK: canonical pages and legacy redirects validated for ${ROUTED_COLLECTIONS.join(", ")}`
);
