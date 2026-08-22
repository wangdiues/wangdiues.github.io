# Wangdi Portfolio V8

Version 3 research portfolio for Wangdi Wangdi — biodiversity, climate science, GIS, remote sensing, conservation, and forest governance.

Built with [Astro](https://astro.build) + TypeScript + Tailwind CSS 4, deployed to GitHub Pages.
Development follows `V2_DEVELOPMENT_PLAN.md` (7 milestones; GIS explorer ships as V2.1 after launch).

## Quickstart

```sh
npm install
npm run dev       # local dev server
npm run build     # tokens + production build → dist/
npm run preview   # serve the production build locally
```

## Architecture at a glance

```
tokens/tokens.json ─► scripts/build-tokens.mjs ─► src/styles/tokens.css ─► Tailwind 4 theme
src/content/        publications · case-studies · experience (MDX, Zod-validated)
src/data/geo/       map layers (V2.1, disclosure-cleared only — see plan D1)
```

No hardcoded colours, spacing, or type sizes outside `tokens/`.

## Docs

| File                     | Purpose                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `V2_DEVELOPMENT_PLAN.md` | Strategy, decisions D1–D3, roadmap, budgets, risk register |
| `docs/architecture.md`   | ADRs (planned, M6)                                         |
| `docs/CONTENT.md`        | How to add a publication (planned, M3)                     |

## Deployment

This repository is the GitHub Pages **user site**: pushes to `main` build and deploy via
GitHub Actions (`.github/workflows/deploy-pages.yml`) to `https://wangdiues.github.io`.
No `base` / pathPrefix configuration exists anywhere (decision D2).
