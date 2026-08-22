import { readdirSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// V2.0 published publication and case-study URLs carried the source file
// extension (/publications/salt-licks.md/). The canonical routes are now
// extensionless, so every legacy URL gets a noindex redirect stub rather than
// a 404 — GitHub Pages has no server-side redirect support.
//
// Contract is asserted by scripts/check-routes.mjs.

const DIST = "dist";
const CONTENT = "src/content";
const ROUTED_COLLECTIONS = ["publications", "case-studies"];

let written = 0;

for (const collection of ROUTED_COLLECTIONS) {
  const slugs = readdirSync(join(CONTENT, collection))
    .filter((name) => /\.mdx?$/.test(name))
    .map((name) => name.replace(/\.mdx?$/, ""));

  for (const slug of slugs) {
    const target = `/${collection}/${slug}/`;
    const dir = join(DIST, collection, `${slug}.md`);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, "index.html"),
      `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting to ${target}</title>
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="${target}" />
    <meta http-equiv="refresh" content="0;url=${target}" />
  </head>
  <body>
    <a href="${target}">This page has moved to ${target}</a>
  </body>
</html>
`
    );
    written += 1;
  }
}

if (!existsSync(DIST)) {
  console.error("dist/ does not exist — run the build first");
  process.exit(1);
}

console.log(`Legacy redirects written: ${written}`);
