# Wangdi Portfolio — Front-end design system

## Intent

A calm, authoritative conservation-research portfolio rooted in Bhutan. The interface should feel editorial and field-led rather than corporate: rigorous enough for reviewers and institutions, but visually connected to forests, landscapes, and applied conservation work.

## Direction

- Pattern: modular editorial grid with asymmetric feature moments.
- Style: restrained Swiss modernism adapted to conservation storytelling.
- Density: spacious-to-standard; preserve readable long-form pages.
- Motion: subtle opacity/translate transitions only; never require motion to understand content.
- Theme: dark evergreen with warm paper text and moss/amber accents.
- Imagery: documentary field photography, natural crops, clear captions, no decorative stock imagery.

## Tokens

- Base: `#081511`
- Surface: `#10251e`
- Raised surface: `#173129`
- Primary text: `#f5f2e9`
- Muted text: `#a9b9b1`
- Moss accent: `#78c99a`
- Moss hover: `#a1deba`
- Warm accent: `#d8aa5f`
- Borders: translucent warm paper at 14–20% opacity.
- Heading type: Source Serif 4 Variable.
- Body type: Inter Variable.
- Body size: 16px minimum with 1.65–1.75 line height.
- Content widths: 72rem shell, 42rem prose.
- Touch targets: 44px minimum.

## Component rules

- Navigation is a floating, translucent field bar with a fully operable mobile menu.
- Buttons use clear filled, outlined, and text treatments with visible focus and at least 44px height.
- Cards use hierarchy, indexing, and restrained elevation; hover is never the only signal.
- Homepage storytelling follows: precise purpose → evidence at a glance → research approach → experience → outcome-led selected work.
- Method sequences use semantic ordered lists and concise evidence-to-action language rather than decorative process diagrams.
- Project cards explicitly label the applied outcome so readers can scan the consequence before opening the full case study.
- Section headings pair a numbered/label eyebrow with a strong editorial title and optional lede.
- Long-form pages retain a narrow reading measure and use consistent article surfaces.
- Local images use `astro:assets`; below-fold images remain lazy-loaded.

## Accessibility and behavior

- Maintain 4.5:1 minimum contrast for normal text.
- Keep DOM and visual tab order aligned.
- Every operable control retains a visible focus ring.
- Mobile navigation exposes `aria-expanded`, closes on Escape and link activation, and does not create a keyboard trap.
- Respect `prefers-reduced-motion` and render all content in its final visible state.
- Validate at 375px, 768px, 1024px, and 1440px without horizontal scrolling.

## Avoid

- Generic institutional blue or editorial pink palettes.
- Glass effects that reduce text contrast.
- Repeated identical card grids across every section.
- Large animation libraries or decorative motion.
- Replacing semantic HTML with client-side framework components.
- Changing content routes, collection schemas, rights controls, or published documents as part of visual work.
