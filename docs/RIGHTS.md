# Publication Rights Register (Decision D3)

_Last reviewed: 2026-08-22 (rev 3 — adds image rights). Sources: Elsevier sharing policy,
Wiley self-archiving terms, BJNRD editorial policies, International Journal of Environment
(NepJOL) policies, and owner direction on public RGoB documents._

## Policy summary

1. Every publication links to its **DOI** as the primary destination once one exists.
2. Self-hosted files are limited to: CC-licensed publisher versions, **author-owned
   submitted/draft manuscripts** (preprints — permitted by Elsevier and Wiley prior to
   acceptance), and **public RGoB institutional documents** (DoFPS plans and strategies are
   openly distributed public documents; hosted at the owner's direction).
3. Manuscripts in preparation are hosted **as author-owned drafts**, clearly labelled.
4. Any single hosted PDF defaults to ≤ 2 MB; named exceptions in
   `scripts/check-budgets.mjs` cover author submissions and public institutional documents.
   Directory total ≤ 60 MB (CI-enforced).
5. **Map layers remain gated by DoFPS clearance** — see `docs/GEODATA.md`. Document hosting
   no longer waits on that clearance.

## Per-item verdicts

| Item                                    | Venue                                        | Rights basis                                   | Hosted?                                                                                                                   | File(s)                                                        |
| --------------------------------------- | -------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| salt-licks                              | BJNRD 9(2), 2022                             | CC BY 4.0 publisher version                    | Yes                                                                                                                       | salt-licks.pdf                                                 |
| aquatic-beetles                         | Int. J. Environment 12(1), 2023              | CC BY-NC publisher version                     | Yes                                                                                                                       | aquatic-beetles.pdf                                            |
| wild-edible-medicinal-plants            | BJNRD 13(1), 14–36, 2026 — **PUBLISHED**     | Open access (BJNRD), DOI 10.17102/cnr.2026.111 | Yes (publisher version)                                                                                                   | wild-edible-medicinal-plants.pdf                               |
| forest-gradient-bhutan                  | Forest Ecology and Management (under review) | Author-owned submitted manuscript              | Yes (main + supplement + FEM compilation)                                                                                 | forest-gradient-bhutan-main/-supplementary/-fem-submission.pdf |
| vegetation-community                    | Journal of Vegetation Science (under review) | Author-owned submitted manuscript              | Yes                                                                                                                       | vegetation-community-main.pdf (= 01_manuscript_jvs.pdf)        |
| ecosystem-integrity                     | Ecology & Evolution (under review)           | Author-owned submitted manuscript              | Yes (revised version)                                                                                                     | ecosystem-integrity.pdf (= Manuscript_revised_MAIN.pdf)        |
| climate-habitat-elephants               | Ecology & Evolution (under review)           | Author-owned submitted manuscript              | Yes (main + supplement + CMIP6-titled compilation)                                                                        | climate-refugia-asian-elephants-main/-supplementary/-cmip6.pdf |
| fundamental-realized-habitat            | Venue TBD (under review)                     | Author-owned submitted manuscript              | Yes — **now the 01_manuscript.pdf version** (four-author, "Transferable" subtitle) per the 2026-08-22 evidence resolution | fundamental-realized-habitat.pdf                               |
| bc03-conservation-management-plan       | DoFPS, 2023                                  | Public RGoB document                           | Yes                                                                                                                       | bc03-conservation-management-plan.pdf                          |
| sarpang-forest-division-management-plan | DoFPS, 2024                                  | Public RGoB document                           | Yes                                                                                                                       | sarpang-forest-division-management-plan.pdf                    |
| coexistence-strategy-dekiling           | DFO Sarpang, 2025                            | Public RGoB document                           | Yes                                                                                                                       | coexistence-strategy-dekiling.pdf                              |
| coexistence-strategy-gakiling           | DFO Sarpang, 2025                            | Public RGoB document                           | Yes                                                                                                                       | coexistence-strategy-gakiling.pdf                              |
| climate-vulnerability-adaptive-capacity | In preparation                               | Author-owned draft                             | Yes                                                                                                                       | climate-vulnerability-adaptive-capacity-bhutan.pdf             |
| community-assembly                      | In preparation                               | Author-owned draft                             | Yes                                                                                                                       | community-assembly-disturbance-climate-gradient.pdf            |
| elephant-movement-habitat-selection     | In preparation                               | Author-owned draft                             | Yes                                                                                                                       | elephant-movement-habitat-selection.pdf                        |
| elephant-seasonal-search-dynamics       | In preparation                               | Author-owned draft                             | Yes                                                                                                                       | elephant-seasonal-search-dynamics.pdf                          |
| forest-carbon-sequestration-cmip6       | In preparation                               | Author-owned draft                             | Yes                                                                                                                       | forest-carbon-sequestration-cmip6.pdf                          |
| risk-partitioning                       | In preparation                               | Author-owned draft                             | Yes                                                                                                                       | tiger-risk-partitioning.pdf                                    |

## Image rights

The 34 field photographs in `src/assets/gallery/` are **Wangdi's own work**, confirmed
2026-08-22. No attribution or licence notice is required, and no third-party or
institutional images are included.

The `FB_IMG_*` and `IMG-*-WA*` filenames are an artefact of the originals being
re-downloaded from Wangdi's own Facebook and WhatsApp posts — they are **not** evidence
of third-party sourcing. Filenames are load-bearing: they key the alt-text and caption
manifest in `src/data/gallery.ts`, so they must not be renamed without updating it.

Before adding any photograph taken by a colleague or supplied by DoFPS, record it here
with its photographer and permission basis first.

## Post-acceptance rules (apply when acceptances arrive)

- **Elsevier** (Forest Ecology and Management): accepted manuscript may be posted to a
  personal non-commercial website immediately upon acceptance.
- **Wiley** (Journal of Vegetation Science, Ecology & Evolution): accepted version must remain
  a closed deposit for **12 months** post-publication (STM terms) — switch these entries to
  DOI-only on acceptance until the embargo lifts.
- Update this register and the entry's `rightsLicense`/`pdf` frontmatter at each acceptance.

## Open items requiring Wangdi

1. ~~wild-edible-medicinal-plants~~ **RESOLVED (2026-08-22)**: published — Orong, K., Dorjee, S.
   & Wangdi (2026). _BJNRD_ 13(1), 14–36. DOI 10.17102/cnr.2026.111. Wangdi is the **third and
   final author**; corresponding author Sangay Dorjee. Entry updated to `published` with full
   metadata; publisher PDF hosted.
2. ~~DoFPS clearance for document hosting~~ **RESOLVED by owner direction (2026-08-22)**: the
   four plans/strategies are public RGoB documents and are hosted. DoFPS clearance remains
   required **only for map layers** (`docs/GEODATA.md`, draft request in
   `docs/DRAFT_DOFPS_REQUEST.md`).
3. **fundamental-realized-habitat** — hosted PDF now matches `01_manuscript.pdf` byte-for-byte
   (the evidence-resolved version). **Veto window remains open**: if a different current version
   exists, say so and the entry reverts.
