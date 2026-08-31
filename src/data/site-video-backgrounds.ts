// Manifest of the 5 site-wide ambient background clips, transcoded from
// background_Videos/ (gitignored raw source) into public/video/site/.
// Each entry maps a stable slug -> its web-ready mp4/webm/poster triplet,
// a default focal point for object-fit: cover, and a short factual
// description of what the footage actually shows (source-footage names
// and the slugs fixed for this project don't always agree with the
// literal subject — descriptions here are the ground truth).
export interface SiteVideo {
  mp4: string;
  webm: string;
  poster: string;
  objectPosition: string;
  description: string;
}

export const SITE_VIDEOS = {
  'aerial-canopy': {
    mp4: '/video/site/aerial-canopy.mp4',
    webm: '/video/site/aerial-canopy.webm',
    poster: '/video/site/aerial-canopy-poster.jpg',
    objectPosition: '50% 42%',
    description:
      'Aerial drone shot over a forested mountain valley with a bare scree/landslide scar and ridgelines receding into haze.',
  },
  'river-flow': {
    mp4: '/video/site/river-flow.mp4',
    webm: '/video/site/river-flow.webm',
    poster: '/video/site/river-flow-poster.jpg',
    objectPosition: '50% 45%',
    description: 'Low-angle ocean sunset time-lapse: sun sitting on the horizon, warm reflection across rolling waves.',
  },
  'forest-mist': {
    mp4: '/video/site/forest-mist.mp4',
    webm: '/video/site/forest-mist.webm',
    poster: '/video/site/forest-mist-poster.jpg',
    objectPosition: '50% 50%',
    description: 'Time-lapse looking straight up through drifting cumulus and cirrus clouds against open blue sky.',
  },
  'valley-vista': {
    mp4: '/video/site/valley-vista.mp4',
    webm: '/video/site/valley-vista.webm',
    poster: '/video/site/valley-vista-poster.jpg',
    objectPosition: '50% 50%',
    description: 'Aerial top-down shot of a rocky coastline: turquoise reef water, breaking surf, and a sandy shoreline.',
  },
  'canopy-detail': {
    mp4: '/video/site/canopy-detail.mp4',
    webm: '/video/site/canopy-detail.webm',
    poster: '/video/site/canopy-detail-poster.jpg',
    objectPosition: '60% 40%',
    description: 'Macro close-up of a blue butterfly perched on a grass blade, wings open, soft green bokeh background.',
  },
} as const satisfies Record<string, SiteVideo>;

export type SiteVideoSlug = keyof typeof SITE_VIDEOS;
