# Wangdi Portfolio — Version 2 Development Strategy

> **Status:** Revision 3 · **Date:** 2026-08-22 · **Prepared by:** ox-alpha planning sessions (rev 1–2) + reviewer revision 2, integrated
>
> Supersedes `V2_DEVELOPMENT_PLAN.md` revs 1–2 and `IMPROVEMENT_PLAN.md` (Apr 2026).
> Rev 3 integrates Revision 2's corrections — blocking pre-code decisions (D1–D3), the success
> criterion, reordered roadmap, numeric budgets, collapsed workstreams — and retains a slimmed
> design-quality loop. No implementation has started.

---

## PURPOSE AND SUCCESS CRITERIA

This site exists to support PhD applications, scholarship applications, and professional
credibility as a forestry and conservation researcher. Every decision is checkable against:

> **A reviewer landing cold on a phone can find the CV, three publications with resolving DOIs,
> and contact details within 30 seconds — and the page is fully readable in under 2.5 seconds
> on a throttled connection.**

Anything that does not serve that test is a nice-to-have and belongs in Appendix A.

---

## PHASE 0 — Pre-Code Decisions (must resolve before dependent milestones)

### D1 — Geospatial data disclosure policy · **BLOCKING for M7 (V2.1)**

Fine-resolution occurrence data for tigers and elephants must not be openly published — the
poaching-facilitation pathway from published occurrence records is well documented, and DoFPS/RGoB
survey coordinates are institutional data, not personal data.

| Layer                               | Publishable form                                                                  | Clearance needed        |
| ----------------------------------- | --------------------------------------------------------------------------------- | ----------------------- |
| Protected areas, BC-03              | Full resolution (public boundaries)                                               | None                    |
| SDM / habitat suitability surfaces  | Full resolution (modelled, not detections)                                        | Author's own outputs    |
| Camera-trap network                 | 10 × 10 km grid cells or survey-extent polygon only                               | DoFPS written sign-off  |
| Tiger detections / occupancy inputs | **Not openly publishable**; aggregated results only                               | DoFPS written sign-off  |
| Elephant movement ranges            | Extents already published in peer-reviewed figures only                           | DoFPS + co-author check |
| Great Hornbill routes (telemetry)   | Same rule as elephant telemetry — published extents only                          | DoFPS + collaborators   |
| Cordyceps harvesting areas          | Gewog-level aggregation minimum (livelihood-sensitive locations)                  | DoFPS/division input    |
| NFI plots                           | National inventory coordinates are institutional/confidential — aggregate or omit | DoFPS written sign-off  |
| Land cover                          | Full resolution (public national dataset)                                         | Attribution only        |

**Decision required:** confirm degradation rules above; obtain written DoFPS clearance for
anything institutional. If clearance never arrives, V2.1 ships with the first two rows only —
still a worthwhile map. Full policy recorded in `docs/GEODATA.md` (review gate before any M7 merge).

### D2 — Hosting and URL · **BLOCKING for M1**

Publishing to `wangdiues.github.io/Wangdi-portfolio-v7` reproduces the pathPrefix coupling listed
as a V1 weakness and ships an application-facing site at a URL containing "v7".

**Recommendation:** root user site `wangdiues.github.io`, with a custom domain (≈ USD 12/yr,
e.g. `wangdi.bt` / `wangdiwangchuk.com`) preferred. A clean URL on a CV outranks most engineering here.

Consequences folded into M1:

- No `pathPrefix` / `base` configuration anywhere — removes a class of asset-path bugs
- GitHub Pages has no server-side redirects → old-URL preservation via HTML stub pages with
  `<meta http-equiv="refresh">` + `<link rel="canonical">`, one stub per V0/V1 URL
- V0 repository retired at M6 release, not left live

### D3 — PDF hosting and publisher rights · **BLOCKING for M3**

The ~50 MB of hosted PDFs is a rights problem, not just a performance problem: publisher-version
PDFs of papers submitted to Elsevier titles (Forest Ecology and Management) generally breach the
copyright transfer agreement.

**Policy:**

1. Every publication links to its **DOI** as primary destination
2. Self-host **accepted manuscripts only**, and only where green-OA terms permit (Sherpa Romeo
   check per journal during M3, logged)
3. Reports, theses, grey literature owned outright: self-host freely
4. Anything self-hosted compressed to ≤ 2 MB before commit

Expected effect: hosted payload drops from ~50 MB to ~5–10 MB; rev 1's bulk compress-and-dedupe
task disappears.

---

## PHASE 1 — Repository Analysis (carried forward)

### V0 — `wangdiues.github.io/My_portfolio/`

Hand-written HTML/CSS/vanilla JS; Inter + Font Awesome via CDN. Semantic markup, skip-link +
ARIA basics, real DOIs, first-person voice. Weaknesses: no templating, render-blocking CDN
assets, no sitemap/structured data, publications capped at 3, manual maintenance.

### V1 — `Wangdi-portfolio-v7`

| Aspect    | Finding                                                                                       |
| --------- | --------------------------------------------------------------------------------------------- |
| Framework | Gatsby 3.4 (EOL) + React 17; `--openssl-legacy-provider` needed on Node 24                    |
| Styling   | styled-components 5; breakpoints (480/768/1080) duplicated across components                  |
| Identity  | Brittany Chiang v4 derivative — borrowed, not Wangdi's                                        |
| Content   | **Strong** — 17 publication MDs with rich frontmatter, 5 case studies, 2 experience entries   |
| Hooks     | `usePrefersReducedMotion`, `useScrollDirection`, `useOnClickOutside` — carry forward          |
| SEO       | Sitemap/robots/GA present; template-default OG, no per-page metadata, no JSON-LD              |
| Testing   | None                                                                                          |
| Assets    | 50 MB PDFs duplicated across `content/` and `static/`; 9.6 MB images; stray `ghallery` folder |

**The content layer is the asset. The framework is disposable.** V2 preserves 100% of the
markdown/frontmatter and discards everything else.

**Canonical voice:** V0's first-person copy — resolves V0/V1/V2 drift permanently.

---

## PHASE 2 — Design System (code-first)

```
tokens/*.json  ──►  build script  ──►  src/styles/tokens.css  ──►  Tailwind 4 theme
```

No hex or px value hardcoded outside `tokens/`.

- **Typography:** self-hosted variable fonts — **Source Serif 4** for headings (editorial
  gravitas), Inter for UI/body only. Fluid scale (~1.22 ratio) via `clamp()`. Subset Latin + Latin-Ext.
- **Colour:** deep forest ink base, moss/mountain accent; amber = under review, slate = in
  preparation, green = published. WCAG AA: 4.5:1 body text, 3:1 large text/UI components.
- **Spacing / radii / elevation:** 4 px base scale, centralized tokens.
- **Breakpoints:** 640 / 768 / 1024 / 1280 — defined once in tokens (fixes V1 scatter).
- **Interaction:** reduced-motion-first; `focus-visible` rings everywhere; sticky nav with
  active-section indicator.

**Anti-generic-AI-design mandate** (enforced in review): no default-font identity, no purple/blue
gradient clichés, no nested cards, no gray-on-colour text, tinted neutrals only, purposeful motion
only. Distinctive serif identity is itself the defence against the generic-AI look.

**Design quality loop (slim, per milestone — runs inside Workstreams 2/4):**

| Review   | When                   | Method                                                             |
| -------- | ---------------------- | ------------------------------------------------------------------ |
| Shape    | Before building a page | `/impeccable shape` — hierarchy, journey, storytelling flow        |
| Critique | After building         | `/impeccable critique` — typography, spacing, balance, consistency |
| Audit    | Before release         | `/impeccable audit` + `npx impeccable detect --json` in CI         |
| Polish   | Final refinement       | `/impeccable polish` at M6                                         |

One-time `npx impeccable install` + `/impeccable init` writes `PRODUCT.md`/`DESIGN.md` — the
design source of truth (audience, brand lane, voice, anti-references). Component reference lives
at `/styleguide`; no separate master document needed.

**Component library** at `/styleguide`: buttons, status badges, cards (publication / case study /
program), nav + mobile menu, timeline nodes, metric strip, tag pills, footer.

---

## PHASE 3 — Development Architecture

### Frontend

- **Astro 5**, static output, **TypeScript** throughout
- **Tailwind CSS 4**, configured entirely from CSS-variable tokens
- Hierarchy: `Layout → Page → Section → Card/Primitive`
- Islands only where interaction demands it: `PublicationFilter`, `MobileMenu`, later `MapExplorer`
- No global store. Filter state in URL query params (`?status=published`) — shareable, statically renderable

### Content

- Astro **Content Collections** + **MDX**, **Zod**-validated — invalid frontmatter fails the build
- Schema: `title`, `authors`, `coAuthors`, `venue`, `year`, `status` (`published | under-review | in-preparation | report`), `doi`, `citation`, `abstract`, `tags`, `pdf` (optional, per D3),
  `external`, `geo` (optional layer key)
- **Per-publication pages** `/publications/[slug]`: abstract, methods summary, citation block with
  copy button, DOI link (primary destination), related case studies, JSON-LD `ScholarlyArticle`
- RSS feed for publications
- CV auto-generated from the experience collection, print stylesheet included
- **ORCID sync**: build-time script pulls the ORCID record and flags publications present there
  but missing from the collection — so the list does not rot during fieldwork. Flag only, never auto-writes.
- **Narrative authoring template** (in `docs/CONTENT.md`, not a schema mandate): case studies and
  research pages follow _Research Question → Data Sources → Methods → Analysis → Results →
  Conservation Impact → Publication/Output_

### GIS explorer (V2.1 — after launch, gated on D1)

- **MapLibre GL JS** lazy-loaded island; no API key, no tile server; **PMTiles** same-origin
- GeoJSON in `src/data/geo/` at resolutions fixed by D1
- Popups cross-link to publication pages; static image fallback covers no-JS/print
- **Accessibility is a hard requirement:** keyboard-operable layer toggles AND a data-table view
  of every layer conveying the same information without the canvas — the fallback alone does not satisfy this

### Budgets (gates, with numbers)

| Metric                     | Budget       | Enforced by          |
| -------------------------- | ------------ | -------------------- |
| Total page weight (home)   | ≤ 1.5 MB     | CI size check        |
| LCP                        | < 2.5 s @ 4G | Lighthouse CI        |
| CLS                        | < 0.1        | Lighthouse CI        |
| Lighthouse a11y / SEO      | ≥ 95         | Lighthouse CI        |
| axe-core violations        | 0            | Playwright + axe     |
| Hosted PDF directory total | ≤ 10 MB      | CI size check        |
| Any single hosted PDF      | ≤ 2 MB       | CI size check        |
| PMTiles total              | ≤ 50 MB      | CI size check        |
| Repository total           | ≤ 250 MB     | Manual, each release |

---

## PHASE 4 — Workstreams (four, shared `v2` branch)

Branch-per-domain agents with PR gates serialise a solo project. Collapsed accordingly.

| #   | Workstream           | Owns                                                                                  | Produces                      |
| --- | -------------------- | ------------------------------------------------------------------------------------- | ----------------------------- |
| 1   | Architecture & build | Scaffold, tokens pipeline, CI, deploy, docs                                           | Contracts for everything else |
| 2   | Design & frontend    | Token JSON, style guide, sections, pages, islands, responsive, shape/critique reviews | The visible site              |
| 3   | Research content     | Migration, abstracts, methods summaries, citations, CV, ORCID sync, Sherpa Romeo log  | Canonical content collections |
| 4   | Quality & release    | Playwright e2e + axe, Lighthouse CI, budget gates, audit/polish reviews, sign-off     | Merge-blocking reports        |

**Rule:** workstream 4's checks run on every push to `v2` and must be green before a release tag.
Nothing else blocks.

---

## PHASE 5 — Implementation Roadmap

**V2.0 launches at M6. GIS is V2.1** — highest-risk, lowest-launch-value work moves after deploy,
and gives D1 clearance time to resolve without holding up launch.

| #   | Milestone               | Depends on | Key tasks                                                                                                                                                          | Effort  |
| --- | ----------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| 1   | Foundation              | **D2**     | Astro + TS + Tailwind scaffold, tokens pipeline, ESLint/Prettier, CI build, GH Pages deploy, Impeccable install/init, **no pathPrefix**                            | 0.5 d   |
| 2   | Design system           | M1         | Token JSON → tokens.css, font self-hosting + subsetting, primitives, `/styleguide`, shape review                                                                   | 1.5 d   |
| 3   | **Content authoring**   | **D3**     | Migrate 17 pubs + 5 case studies; write abstracts + methods summaries (narrative template); Sherpa Romeo rights check per journal; citations; CV data; Zod schemas | **3 d** |
| 4   | Homepage & portfolio    | M2, M3     | Hero (V0 first-person copy), build-derived metrics, about, experience timeline, case studies, nav + footer, reduced motion; critique review                        | 1.5 d   |
| 5   | Publication system      | M3, M4     | Collection pages, filter bar (URL params), status badges, `/publications/[slug]`, citation copy, RSS, JSON-LD, ORCID sync script                                   | 2 d     |
| 6   | **Launch (V2.0)**       | M5         | OG images, print CV stylesheet, privacy analytics, redirect stubs (V0/V1 URLs), sitemap/robots, docs set, V0 retirement, audit + polish reviews, **release tag**   | 1.5 d   |
| 7   | GIS explorer (**V2.1**) | M6, **D1** | GeoJSON at cleared resolutions, PMTiles build, MapLibre island, layer toggles, **data-table views**, popup cross-links, static fallback                            | 3 d     |

**Effort: ≈ 10 focused days to V2.0 launch, + 3 for V2.1.**
_Focused days ≠ calendar days:_ at evenings/weekends alongside a full-time post, V2.0 lands in
~6–8 weeks. Note the estimate now includes the writing — 17 abstracts and methods summaries is
the single largest line item and is not engineering work.

**Cut line if time is short:** M5's RSS + ORCID sync, and M6's custom OG images, can slip without
touching the success criterion. Nothing in M1–M4 can.

---

## PHASE 6 — Documentation

| File                       | Contents                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| `README.md`                | Stack, quickstart, scripts, doc index                                                         |
| `PRODUCT.md` / `DESIGN.md` | Design source of truth (written by `/impeccable init`)                                        |
| `docs/architecture.md`     | ADRs: why Astro, why MapLibre + PMTiles, tokens pipeline, content model                       |
| `docs/CONTENT.md`          | Frontmatter reference, validation rules, adding a publication, PDF policy, narrative template |
| `docs/DEPLOYMENT.md`       | Pages workflow, custom domain, redirect stubs, rollback                                       |
| `docs/GEODATA.md`          | **D1 policy, per-layer resolution rules, clearance record**                                   |
| `docs/MAINTENANCE.md`      | Dependency updates, Lighthouse re-runs, budget checks, debt register                          |

---

## RISK REGISTER

| Risk                           | Trigger / threshold                         | Owner        | Mitigation                                                           |
| ------------------------------ | ------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| Species location disclosure    | Any layer finer than 10 km without sign-off | Wangdi       | D1 policy; `docs/GEODATA.md` review gate before M7 merge             |
| Publisher rights breach        | Any publisher-version PDF committed         | Wangdi       | D3 policy; Sherpa Romeo check logged per journal in M3               |
| Content authoring stalls M4/M5 | M3 not complete by day 5                    | Wangdi       | Ship pubs with citation + DOI only; abstracts added incrementally    |
| Repo/page weight creep         | Any budget in Phase 3 exceeded              | CI           | Build fails; no manual override                                      |
| Old-URL SEO loss               | V0 retirement                               | Wangdi       | Meta-refresh stubs + canonical tags, mapped 1:1 before M6 release    |
| D1 clearance never arrives     | No response by M6 completion                | Wangdi       | V2.1 ships with public boundaries + own SDM outputs only             |
| Astro maintenance friction     | Post-launch                                 | Wangdi       | `docs/CONTENT.md` covers the only routine task: adding a publication |
| Generic AI-generated look      | Design review findings                      | Workstream 2 | Serif identity + anti-pattern mandate + detector in CI               |

---

## SUMMARY OF CHANGES FROM REVISION 2 (this integration, rev 3)

1. Design-quality loop retained in slimmed form: `PRODUCT.md`/`DESIGN.md` replaces the separate
   master design document; shape/critique/audit/polish reviews run inside Workstreams 2/4 at M2/M4/M6
2. Anti-generic-AI-design mandate kept as explicit design rules
3. D1 layer table expanded: tiger detections, Great Hornbill telemetry, cordyceps areas
   (gewog-level minimum), NFI plots (institutional — aggregate or omit)
4. Evidence-based narrative structure moved into `docs/CONTENT.md` as authoring template
   (guidance, not schema enforcement)
5. Research Lab Mode and AI-assistant readiness deferred to Appendix A
6. All Revision 2 decisions otherwise adopted unchanged: success criterion, D1–D3, four
   workstreams, reordered roadmap, numeric budgets, risk register, cut line

---

## APPENDIX A — Deferred (revisit after V2.0)

- Light-mode theme (tokens already structured for it)
- Figma mirroring via Tokens Studio; Figma Dev Mode MCP
- Vitest unit suite (revisit if logic accumulates beyond citation formatting)
- Embedded PDF viewer on publication pages — link-out is sufficient and lighter
- Interactive co-author network / bibliometrics
- **Research Lab Mode** (`/lab` dual-surface: methods, data, maps, code)
- **AI research assistant readiness** (JSON knowledge base export, `llms.txt`, Pagefind index)

---

## DECISIONS STATUS

| Decision                                             | Status                                                                         |
| ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| Stack (Astro 5 + TS + Tailwind 4 + MapLibre/PMTiles) | Locked                                                                         |
| D1 geodata disclosure                                | **Open** — DoFPS conversation required; long pole, start now; gates V2.1 only  |
| D2 hosting                                           | **Open** — recommend root user site, custom domain preferred; decide before M1 |
| D3 PDF rights                                        | Policy adopted; per-journal Sherpa Romeo checks executed in M3                 |

## NEXT STEP

Resolve **D1, D2, D3**. D2 can be decided today. D1 requires a DoFPS conversation and is the
long pole — start it now, because it gates V2.1 and nothing else waits on it.

Then begin **Milestone 1 — Foundation**.
