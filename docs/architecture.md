# Architecture

Decisions of record for this repository. Each ADR is immutable; superseding decisions get new numbers.

## ADR-001 — Astro 5 over Gatsby 3 and Next.js

**Status:** accepted (rev 1 planning, 2026-08-22)

Gatsby 3 was EOL, required Node-compatibility hacks, and its plugin ecosystem was in churn.
Next.js exceeded the needs of a static research portfolio. Astro ships zero JS by default,
first-class content collections with Zod validation, islands for selective interactivity
(filter bar, future map), and fast builds (~5 s). React is not used anywhere; interactivity
is vanilla TypeScript where needed.

## ADR-002 — Tailwind CSS 4 driven by token CSS variables

**Status:** accepted

`tokens/tokens.json` is the single source of truth. `scripts/build-tokens.mjs` flattens it to
`src/styles/tokens.css`; `global.css` maps tokens into Tailwind's `@theme inline`. No raw hex,
px spacing, or type sizes exist outside `tokens/`. Light mode and Figma mirroring are deferred
but structurally supported (token JSON is Tokens Studio-shaped).

## ADR-003 — Fonts self-hosted via Fontsource variable packages

**Status:** accepted

Source Serif 4 (headings) + Inter (UI/body) as `@fontsource-variable/*` npm packages: bundled
locally (no Google CDN), unicode-range subsetting gives Latin/Latin-Ext-only delivery for free.

## ADR-004 — Content model: three MDX-ready collections with strict schemas

**Status:** accepted (M3)

`publications`, `case-studies`, `experience` live in `src/content/`, validated by Zod
(`src/content.config.ts`) — invalid frontmatter fails the build. Publication entries carry
rights metadata (`rightsLicense`, `rightsNote`) reflecting decision D3. The V0 site's
first-person copy is the canonical editorial voice.

## ADR-005 — Hosting: GitHub Pages user site, no pathPrefix

**Status:** accepted (D2)

Repository renamed to `wangdiues.github.io`; deploys from `main` via workflow build. No `base`
config anywhere. Old V0/V1 URLs are preserved through static meta-refresh + canonical stubs
(GitHub Pages has no server-side redirects).

## ADR-006 — PDF hosting policy (decision D3)

**Status:** accepted

DOI-first linking; only CC-licensed publisher versions and author-owned submitted manuscripts
are hosted; institutional DoFPS documents require written clearance; per-file ≤ 2 MB and
directory ≤ 10 MB enforced by `scripts/check-budgets.mjs` in CI (two named preprint exceptions).
See `docs/RIGHTS.md`.

## ADR-007 — GIS deferred to V2.1 behind disclosure clearance (decision D1)

**Status:** accepted

MapLibre GL JS + PMTiles planned for `/explore`, gated on DoFPS sign-off per
`docs/GEODATA.md`. Species occurrence layers degrade to grid cells or published extents only.

## Pipeline

```
tokens/tokens.json ─build-tokens─► src/styles/tokens.css ─┐
src/content/** ─Zod validation─► typed collections        ├─► astro build ─► dist/
scripts/check-budgets.mjs ─CI gate────────────────────────┘        │
                                                        GH Actions deploy-pages.yml
```
