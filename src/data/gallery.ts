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
  "FB_IMG_1343123537148313029.jpg": { alt: "" },
  "FB_IMG_1717953694678933410.jpg": { alt: "" },
  "FB_IMG_1767277303216.jpg": { alt: "" },
  "FB_IMG_1772460282070.jpg": { alt: "" },
  "FB_IMG_1772460352159.jpg": { alt: "" },
  "FB_IMG_1772460986741.jpg": { alt: "" },
  "FB_IMG_1772460995282.jpg": { alt: "" },
  "FB_IMG_1772461002598.jpg": { alt: "" },
  "FB_IMG_1772461012364.jpg": { alt: "" },
  "FB_IMG_1772461029670.jpg": { alt: "" },
  "FB_IMG_1772461032955.jpg": { alt: "" },
  "FB_IMG_1772461042319.jpg": { alt: "" },
  "FB_IMG_1772461050325.jpg": { alt: "" },
  "FB_IMG_1772461052947.jpg": { alt: "" },
  "FB_IMG_1772461061605.jpg": { alt: "" },
  "FB_IMG_1772461071812.jpg": { alt: "" },
  "FB_IMG_2992331926967076181.jpg": { alt: "" },
  "FB_IMG_3129677369276556777.jpg": { alt: "" },
  "FB_IMG_3349306116838487353.jpg": { alt: "" },
  "FB_IMG_5147352463128233676.jpg": { alt: "" },
  "FB_IMG_5709250295833179563.jpg": { alt: "" },
  "FB_IMG_5816322693780937056.jpg": { alt: "" },
  "FB_IMG_6175297709211037040.jpg": { alt: "" },
  "FB_IMG_7334813338938230187.jpg": { alt: "" },
  "FB_IMG_7407087828112269316.jpg": { alt: "" },
  "FB_IMG_7444807213143393354.jpg": { alt: "" },
  "FB_IMG_7913367842923587300.jpg": { alt: "" },
  "FB_IMG_7966588469327882744.jpg": { alt: "" },
  "FB_IMG_8037715989370687531.jpg": { alt: "" },
  "FB_IMG_8461036346354499884.jpg": { alt: "" },
  "IMG-20251018-WA0006.jpg": { alt: "" },
  "IMG-20260103-WA0016.jpg": { alt: "" },
  "IMG-20260103-WA0018.jpg": { alt: "" },
  "W2_-1-.jpg": { alt: "" },
};
