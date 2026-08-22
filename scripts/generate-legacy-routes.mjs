import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const COLLECTIONS = ["publications", "case-studies"];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

for (const collection of COLLECTIONS) {
  const sourceDir = join("src/content", collection);
  for (const filename of readdirSync(sourceDir)) {
    if (!/\.mdx?$/.test(filename)) continue;
    const slug = filename.replace(/\.mdx?$/, "");
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
      throw new Error(`${sourceDir}/${filename}: unsafe route slug`);
    }

    const target = `/${collection}/${slug}/`;
    const outputDir = join("dist", collection, `${slug}.md`);
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(
      join(outputDir, "index.html"),
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${escapeHtml(target)}"><link rel="canonical" href="${escapeHtml(target)}"><title>Redirecting…</title></head><body><p>This page has moved to <a href="${escapeHtml(target)}">${escapeHtml(target)}</a>.</p><script>location.replace(${JSON.stringify(target)}+location.search+location.hash)</script></body></html>`,
      "utf8"
    );
  }
}

console.log("Legacy .md route redirects generated");
