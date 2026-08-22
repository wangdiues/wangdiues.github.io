import type { ImageMetadata } from 'astro';
import GH1 from '../assets/projects/connected-skies/GH1.jpeg';
import GH2 from '../assets/projects/connected-skies/GH2.jpeg';
import GH3 from '../assets/projects/connected-skies/GH3.jpeg';
import GH4 from '../assets/projects/connected-skies/GH4.jpeg';
import GH6 from '../assets/projects/connected-skies/GH6.jpeg';
import SC3 from '../assets/projects/connected-skies/SC3.jpeg';
import W1 from '../assets/projects/connected-skies/W1.jpg';
import W2 from '../assets/projects/connected-skies/W2.jpg';
import WB1 from '../assets/projects/connected-skies/WB1.jpeg';

export const caseStudyAssets: Record<string, Record<string, ImageMetadata>> = {
  'connected-skies': { GH1, GH2, GH3, GH4, GH6, SC3, W1, W2, WB1 },
};
