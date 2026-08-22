# Content guide

Everything on the site is generated from `src/content/`. If a file here is wrong, the site
is wrong; if frontmatter is invalid, **the build fails** (Zod schemas in `src/content.config.ts`).

## Adding a publication

Create `src/content/publications/<slug>.md` (slug = URL). Required frontmatter:

```yaml
---
title: "Full title in Title Case"
status: "published" # published | under-review | in-preparation | report
year: 2026 # number
date: 2026-04-16 # used for sorting
venue: "Journal name (submitted)"
authors: "Author A, Author B & Wangdi"
doi: "10.xxxx/xxxxx" # optional but strongly preferred once assigned
external: "https://..." # optional publisher/landing link
pdf: "/publications/file.pdf" # ONLY if rights-cleared — see docs/RIGHTS.md
rightsLicense: "CC BY 4.0 (publisher version)" # or author preprint / institutional
rightsNote: "Any hosting caveat shown publicly"
geo: "layer-key" # only if tied to a map layer (V2.1, see docs/GEODATA.md)
tags:
  - Topic
---

```

The body (below `---`) is the abstract/description shown on the detail page. Write it as a
factual summary with concrete numbers where available.

**Rights check before adding any PDF:** confirm the entry against `docs/RIGHTS.md`.
Publisher-version PDFs of subscription journals are never committed. Files must be ≤ 2 MB
(`npm run budgets` enforces).

## Narrative template for case studies

Case studies (`src/content/case-studies/*.md`) follow an evidence structure:

> Research question → data sources → methods → analysis → results → conservation impact → output

Frontmatter: `title, date, region, focus, impact, methods[]`. The body expands the story.

## Experience entries

Bullet lists under `src/content/experience/*.md`; rendered verbatim on home + CV.

## After editing content

```sh
npm run build      # validates schemas + rebuilds
npm run budgets    # PDF size gates
npm run orcid      # optional: flag ORCID works missing from site
```

Commit and push — CI deploys automatically.
