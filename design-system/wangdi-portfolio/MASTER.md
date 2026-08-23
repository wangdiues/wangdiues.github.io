# Wangdi Portfolio — Front-end design system

## Intent

A conservation-research portfolio rooted in Bhutan that fully adopts Prince Pal Singh's
(princepal.in) visual identity — palette, structure, and interaction mechanisms — per
explicit owner direction: "full transplant, his palette too." This supersedes the prior
forest-green "conservation-editorial" system and any lighter, no-toggle alternative
considered along the way; those directions were evaluated and set aside in favor of this
one, at the owner's explicit choice, not by default.

## Direction

- Pattern: stat-led hero (a real number before the name) → identity → measured proof →
  numbered approach → indexed selected work with sticky preview → technical depth → contact.
- Style: warm, high-contrast dark editorial theme by default, with a genuine second,
  fully-designed light theme reachable via a working toggle — not an inverted palette.
- Density: spacious; preserve readable long-form pages and decisive section changes.
- Motion: short opacity/translate transitions, work-preview crossfades, and a
  circular-reveal theme-switch animation (View Transitions API, skipped entirely under
  `prefers-reduced-motion`); never required to understand content.
- Theme: warm near-black ground, cream/ivory text, terracotta-orange ("ember") primary
  accent, muted gold ("amber") secondary accent — the direct adaptation of princepal.in's
  own dark, amber/terracotta identity.
- Typography: Source Serif 4 Variable for headings (restrained editorial serif, matches
  the pre-existing site identity), Inter Variable for body — deliberately kept rather than
  copying Prince Pal's all-sans system, since the serif pairing was already validated for
  this content and the owner's transplant request was about palette and structural
  mechanisms, not typography.
- Imagery: documentary field photography with natural crops and factual captions; a
  designed (non-photographic) placeholder panel for the case studies without hero imagery.

## Tokens

Dark (default):

- Base: `#1a130b` · Raised surface: `#241a0e` · Fixed dark (on-accent text, scrims,
  placeholder panels): `#120d08`
- Primary text: `#f5eedd` · Muted text: `#b3a78f`
- Ember accent: `#e8934a` (400) / `#f0b27a` (300, hover) / `#d9701e` (500, solid fills)
- Amber (status/secondary): `#d8a548`
- Borders: warm ivory at 14% opacity.

Light (toggle):

- Base: `#fbf6ec` · Raised surface: `#f4ebda`
- Primary text: `#1e160d` · Muted text: `#6b5e49`
- Ember accent (darkened for on-light contrast): `#a8500f` (text/links) / `#d9701e`
  (solid fills, dark text on top)
- Borders: near-black at 14% opacity.

Every pair re-measured against its actual background (not assumed): worst case 4.42:1
tightened to 5.10:1+ across both themes; see `tests/frontend-design.test.mjs`.

- Body size: 16px minimum with 1.65–1.75 line height.
- Content widths: 72rem shell, 46rem prose.
- Touch targets: 44px minimum.
- Radius: 6/12/20px (soft, not sharp) — matches the pre-existing site geometry.

## Component rules

- Navigation is a floating, translucent pill bar with a working theme toggle
  (sun/moon icon, circular-reveal transition) and a fully operable mobile menu.
- Buttons use clear filled, outlined, and text treatments with visible focus and at
  least 44px height.
- Selected work is an indexed, keyboard-accessible link list with a sticky visual
  preview on large screens (hover or focus swaps the preview; every item is a real
  `<a href>`, so navigation works with zero JavaScript).
- A section that must stay legible over photography or a placeholder panel opts into
  `.dark-section`, which restates fixed-dark values so it does not flip with the toggle.
- Homepage storytelling: stat-led hero → evidence at a glance → about → research
  approach (a genuine 3-step sequence, numbered because it is actually ordered) →
  experience → indexed selected work → code → gallery → contact.
- Project cards explicitly label the applied outcome so readers can scan the
  consequence before opening the full case study.
- Long-form pages retain a narrow reading measure and use consistent article surfaces.
- Local images use `astro:assets`; below-fold images remain lazy-loaded.

## Accessibility and behavior

- Maintain 4.5:1 minimum contrast for normal text, in both themes.
- Keep DOM and visual tab order aligned; the work list needs no roving-tabindex
  pattern because every item is already a natively focusable link.
- Every operable control retains a visible focus ring in both themes.
- Mobile navigation exposes `aria-expanded`, closes on Escape and link activation, and
  does not create a keyboard trap.
- Theme preference persists (`localStorage`) and falls back to `prefers-color-scheme`;
  the toggle and the theme-switch animation both respect `prefers-reduced-motion`.
- Validate at 375px, 768px, 1024px, and 1440px without horizontal scrolling.

## Avoid

- Silently removing an owner-selected feature (e.g. hiding the toggle) in favor of a
  different, unrequested interpretation of the reference — surface the disagreement
  instead of overriding the explicit choice.
- Decorative glass cards, radial glows used as the *only* visual interest, and
  excessive corner rounding.
- Repeated identical card grids across every section.
- Large animation libraries or decorative motion.
- Replacing semantic HTML with client-side framework components.
- Changing content routes, collection schemas, rights controls, or published
  documents as part of visual work.
