# Wangdi Portfolio — Front-end design system

## Intent

A conservation-research portfolio rooted in Bhutan, currently running an
NVIDIA NIM-derived dark tech identity — near-black dark-gray surfaces, an
ambient animated constellation canvas, and a high-contrast green/blue/purple
accent system — per explicit owner direction: "replace the whole portfolio
theme." This supersedes the prior terracotta/ember "princepal.in transplant"
identity, which itself superseded an earlier forest-green system. Each swap
was a deliberate, confirmed owner choice, not a default.

Two things in the NVIDIA NIM reference don't map onto this site literally, and
were resolved with the owner directly rather than guessed:

- NVIDIA NIM's own product pages are dark-only. This portfolio keeps its
  light/dark toggle (an owner-selected feature from an earlier round) — dark
  is the new NVIDIA-derived look by default, and light is a genuinely
  designed second variant, not an inverted palette.
- NVIDIA NIM's blue "Downloadable" / purple "Free Endpoint" catalog tags have
  no equivalent content on this site. The three accents (green/blue/purple)
  are applied instead to the one real fixed-enum status system that exists:
  publication status badges (`StatusBadge.astro`) — Published = solid green,
  Under review = blue, In preparation = purple, Report = neutral outline.
  Every other tag/pill stays neutral so the accents keep meaning instead of
  becoming decoration.

## Direction

- Pattern: concise portrait-led introduction → measured proof →
  numbered approach → indexed selected work with sticky preview → technical depth → contact.
- Style: high-contrast dark tech theme by default (near-black surfaces, one
  primary accent, two secondary status accents), with a genuine second,
  fully-designed light theme reachable via a working toggle — not an inverted
  palette.
- Density: spacious; preserve readable long-form pages and decisive section changes.
- Motion: an ambient animated constellation canvas behind all content
  (paused when the tab is hidden, skipped entirely under
  `prefers-reduced-motion`), short opacity/translate transitions, work-preview
  crossfades, and a circular-reveal theme-switch animation (View Transitions
  API, also skipped under `prefers-reduced-motion`); never required to
  understand content.
- Theme: cool near-black ground, pure-white text, NVIDIA green (`#76b900`)
  primary accent, blue and purple secondary accents reserved for status
  semantics.
- Typography: Source Serif 4 Variable for headings, Inter Variable for body —
  kept from the prior identity since the serif pairing is validated for this
  content and the theme swap was about palette/atmosphere, not typography.
- Imagery: documentary field photography with natural crops and factual captions; a
  designed (non-photographic) placeholder panel for the case studies without hero imagery.

## Tokens

Dark (default):

- Base: `#0a0c0b` · Raised surface: `#131715` · Fixed dark (on-accent text,
  scrims, placeholder panels): `#050605`
- Primary text: `#ffffff` · Muted text: `#8f9891` (slate)
- NVIDIA green accent: `#8ed400` (400) / `#a6e639` (300, hover) / `#76b900`
  (500, solid fills)
- Tag blue (status: under review): `#4d94ff` (text) / `#0066ff` (border/fill)
- Tag purple (status: in preparation): `#b26eff` (text) / `#8a2be2` (border/fill)
- Borders: white at 12% opacity.

Light (toggle):

- Base: `#ffffff` · Raised surface: `#f2f4f2`
- Primary text: `#12140f` · Muted text: `#5b625d`
- NVIDIA green accent (darkened for on-light contrast): `#345600` (text/links)
  / `#3e6600` (solid fills, white text on top)
- Tag blue: `#0047b3` · Tag purple: `#5c1a9c`
- Borders: near-black at 12% opacity.

Every pair re-measured against its actual background (not assumed); see
`tests/frontend-design.test.mjs`.

- Body size: 16px minimum with 1.65–1.75 line height.
- Content widths: 72rem shell, 46rem prose.
- Touch targets: 44px minimum.
- Radius: 6/12/20px (unchanged from the prior identity — geometry wasn't part
  of this swap).

## Component rules

- Navigation is a floating, translucent pill bar with a working theme toggle
  (sun/moon icon, circular-reveal transition) and a fully operable mobile menu.
- A fixed, full-viewport `<canvas>` (`ConstellationCanvas.astro`) renders
  ~45 slowly drifting nodes with connecting lines within 140px, using the
  NVIDIA green accent at reducing opacity by distance — `z-index: -1`,
  `pointer-events: none`, paused via `visibilitychange` when the tab is
  hidden, skipped entirely (not just paused) under `prefers-reduced-motion`.
- Buttons use clear filled, outlined, and text treatments with visible focus and at
  least 44px height.
- Selected work is an indexed, keyboard-accessible link list with a sticky visual
  preview on large screens (hover or focus swaps the preview; every item is a real
  `<a href>`, so navigation works with zero JavaScript).
- A section that must stay legible over photography or a placeholder panel opts into
  `.dark-section`, which restates fixed-dark values so it does not flip with the toggle.
- The portrait-led hero layers identity, professional specializations, recognition,
  affiliation/contact, and a readable professional profile before its practice tags and CTAs;
  it must not collapse those elements into one undifferentiated paragraph.
- Career highlights use an indexed, border-led evidence matrix with one outcome per entry and
  a direct route to the detailed on-site CV; the matrix stacks without hover dependencies.
- Homepage storytelling: portrait-led introduction → evidence at a glance → research
  approach (a genuine 3-step sequence, numbered because it is actually ordered) → about →
  career highlights → indexed selected work → experience → code → gallery → contact.
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
  the toggle, the theme-switch animation, and the constellation canvas all respect
  `prefers-reduced-motion`.
- Validate at 375px, 768px, 1024px, and 1440px without horizontal scrolling.

## Avoid

- Silently removing an owner-selected feature (e.g. hiding the toggle) in favor of a
  different, unrequested interpretation of the reference — surface the disagreement
  instead of overriding the explicit choice.
- Recoloring generic/multi-purpose tags (`TagPill.astro`) with the status
  accent system — those colors carry meaning only where the underlying data
  is genuinely a fixed enum (publication status), not as decoration everywhere.
- Decorative glass cards, radial glows used as the *only* visual interest, and
  excessive corner rounding.
- Repeated identical card grids across every section.
- Large animation libraries; the constellation canvas is hand-rolled canvas
  code, not a decorative dependency.
- Replacing semantic HTML with client-side framework components.
- Changing content routes, collection schemas, rights controls, or published
  documents as part of visual work.
