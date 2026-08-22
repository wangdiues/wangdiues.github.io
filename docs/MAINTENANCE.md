# Maintenance

## Routine tasks

| Task                                 | Frequency                                       | How                                                          |
| ------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------ |
| Add publication                      | As it happens                                   | `docs/CONTENT.md`                                            |
| Dependency updates (astro, tailwind) | Monthly                                         | `npm outdated` → minor/patch only → build + visual check     |
| Lighthouse re-run                    | Monthly / after changes                         | DevTools → Lighthouse on home, publications, one detail page |
| Budget check                         | Automatic in CI; manually via `npm run budgets` | —                                                            |
| ORCID sync                           | After each acceptance/publication               | `npm run orcid` (flags missing works)                        |

## Known debt register

- Two hosted preprints exceed the 2 MB single-file budget under named exceptions
  (`scripts/check-budgets.mjs`); install Ghostscript to compress below budget and remove exceptions.
- `fundamental-realized-habitat`: two manuscript versions exist locally — pending Wangdi's
  confirmation of which is current (`docs/RIGHTS.md` open items).
- Author lists flagged "et al." in aquatic-beetles, climate-vulnerability, WEMP entries need
  final author orders.
- Institutional PDFs unhosted pending DoFPS clearance; revisit alongside D1 map work.
- Light mode, Figma mirroring, Vitest suite: deferred (plan Appendix A).

## Design system rules

- Never hardcode colours/spacing/type sizes outside `tokens/tokens.json`.
- Run a shape/critique pass before and after building any new page
  (Impeccable commands if installed; manual checklist otherwise):
  contrast ≥ AA, focus-visible reachable, reduced-motion safe, no nested cards,
  no colour-only signals.
- OG card regeneration after branding changes: `node scripts/generate-og.mjs`.

## When something breaks

1. Check the Actions run log for the failing step (build vs budgets vs deploy).
2. Schema error → fix frontmatter per `docs/CONTENT.md`.
3. Budget error → compress/remove the named PDF.
4. Site up but stale → confirm latest commit on `main`, re-run workflow.
