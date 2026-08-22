const ORCID = "0009-0007-7726-1742";
const { readdirSync, readFileSync } = await import("node:fs");
const { join } = await import("node:path");

function localTitles() {
  const dir = "src/content/publications";
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const fm = readFileSync(join(dir, f), "utf8").match(/^title:\s*'(.+)'$/m);
      return fm ? fm[1] : null;
    })
    .filter(Boolean)
    .map((t) => t.toLowerCase().replace(/[^a-z0-9 ]/g, ""));
}

function normalise(s) {
  return (s ?? "").toLowerCase().replace(/[^a-z0-9 ]/g, "");
}

console.log(`Fetching ORCID works for ${ORCID}...`);
try {
  const res = await fetch(`https://pub.orcid.org/v3.0/${ORCID}/works`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`ORCID API responded ${res.status}`);
  const data = await res.json();
  const group = data["activities-summary"] ?? data.bulk ?? [];
  const works = (group.groups ?? []).map((g) => {
    const summary = g["work-summary"]?.at(-1);
    const titles = summary?.title?.title?.value ?? [];
    return Array.isArray(titles) ? titles[0] : titles;
  });

  const site = localTitles();
  const missing = works.filter((w) => {
    const n = normalise(w);
    return (
      n &&
      !site.some(
        (t) => t.includes(n.slice(0, 40)) || n.includes(t.slice(0, 40))
      )
    );
  });

  console.log(`ORCID works found: ${works.length}`);
  if (missing.length === 0) {
    console.log(
      "Site is in sync — no ORCID works missing from src/content/publications."
    );
  } else {
    console.log(
      "FLAG — works on ORCID missing from the site (add manually, never auto-write):"
    );
    for (const m of missing) console.log(`  - ${m}`);
  }
} catch (err) {
  console.warn(`ORCID check skipped: ${err.message}`);
}
