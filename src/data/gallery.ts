/**
 * Per-photograph alt text and captions for the field gallery.
 *
 * Keyed by bare filename in `src/assets/gallery/`. The `FB_IMG_*` names are an
 * artefact of the originals being re-downloaded from Wangdi's own Facebook posts;
 * see docs/RIGHTS.md. Filenames are stable keys — do not rename them.
 *
 * Leave `alt` empty to fall back to the generic description in Gallery.astro.
 * Write alt text that describes what is in the frame, not that it is a photograph.
 * `caption` is optional and renders visibly beneath the image.
 */
export type GalleryEntry = { alt: string; caption?: string };

export const galleryMeta: Record<string, GalleryEntry> = {
  "FB_IMG_1717953694678933410.jpg": {
    alt: "Nine forestry officers in uniform standing on a dry braided riverbed, forested foothills rising behind them",
  },
  "FB_IMG_1767277303216.jpg": {
    alt: "Forestry officers in dress uniform at night outside a building with painted Bhutanese eaves",
  },
  "FB_IMG_1772460282070.jpg": {
    alt: "Schoolchildren in gho and kira seated with forestry staff during a conservation outreach session in a community hall",
  },
  "FB_IMG_1772460986741.jpg": {
    alt: "Mist breaking over forested ridges above a valley settlement",
  },
  "FB_IMG_1772461012364.jpg": {
    alt: "Cloud rolling across a broadleaf forest ridge, a track cut into the slope below",
  },
  "FB_IMG_1772461029670.jpg": {
    alt: "View from a ridge across forested foothills to a braided river on the plains beyond",
  },
  "FB_IMG_1772461032955.jpg": {
    alt: "Forest canopy lit by a spotlight at night, two figures silhouetted at the edge of the beam",
  },
  "FB_IMG_1772461071812.jpg": {
    alt: "Clear water running through a rocky gorge below steep forested cliffs",
  },
  "FB_IMG_5147352463128233676.jpg": {
    alt: "Timber field camp raised on stilts beside a gravel riverbed, chairs and a washing line outside",
  },
  "FB_IMG_5816322693780937056.jpg": {
    alt: "Suspension footbridge strung with prayer flags crossing a wide river",
  },
  "FB_IMG_6175297709211037040.jpg": {
    alt: "Around forty forestry officers in dress uniform with service medals assembled before an ornate painted facade",
  },
  "FB_IMG_7334813338938230187.jpg": {
    alt: "Forest patrol team assembled on an airstrip under heavy cloud",
  },
  "FB_IMG_7913367842923587300.jpg": {
    alt: "The stilted field camp under moonlight, a tree silhouetted against cloud",
  },
  "FB_IMG_7966588469327882744.jpg": {
    alt: "Two foresters in wet-weather gear during a survey in dripping broadleaf forest",
  },
  "FB_IMG_8461036346354499884.jpg": {
    alt: "A forest patrol working along a rocky streambed in dense forest",
  },
  "IMG-20251018-WA0006.jpg": {
    alt: "Divisional forestry staff assembled outside the divisional forest office",
  },
};
