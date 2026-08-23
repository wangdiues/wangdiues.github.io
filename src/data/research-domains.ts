import { REPOSITORIES, type Repository } from '../config';

export type ResearchDomain = {
  id: string;
  title: string;
  icon: 'wildlife' | 'camtrap' | 'forest' | 'climate' | 'ecosystem' | 'education';
  blurb: string;
  repos: { name: string; tags: string[] }[];
};

// Domain groupings are curated, not derived from GitHub topics — none of these
// repos have topics set. Tags for elephant_movement_ecology,
// Elephas_maximus_SDM_Project_v4, camtrap_ecology_analytics, BhutanBioClims,
// and men201-forest-mensuration are given verbatim. The rest are written from
// each repo's actual GitHub description (checked via `gh api`, not guessed).
export const RESEARCH_DOMAINS: ResearchDomain[] = [
  {
    id: 'wildlife-movement',
    title: 'Wildlife Movement & Conservation Analytics',
    icon: 'wildlife',
    blurb: 'Movement ecology and species distribution modelling for large mammal conservation.',
    repos: [
      { name: 'elephant_movement_ecology', tags: ['Python', 'GIS', 'Movement Ecology'] },
      { name: 'Elephas_maximus_SDM_Project_v4', tags: ['R', 'SDM', 'Climate Modelling', 'GIS'] },
    ],
  },
  {
    id: 'camtrap-biodiversity',
    title: 'Camera-trap & Biodiversity Analytics',
    icon: 'camtrap',
    blurb: 'Community ecology and occupancy modelling from multi-site camera-trap networks.',
    repos: [{ name: 'camtrap_ecology_analytics', tags: ['R', 'Occupancy Models', 'Community Ecology'] }],
  },
  {
    id: 'forest-carbon',
    title: 'Forest Ecology & Carbon Science',
    icon: 'forest',
    blurb: 'Forest structure, stratification, and carbon-stock modelling from national inventory data.',
    repos: [
      {
        name: 'forest-carbon-modelling-climate-change-scenarios',
        tags: ['Python', 'Google Earth Engine', 'Machine Learning'],
      },
      { name: 'Bhutan_Forest_Stratification', tags: ['Python', 'Forest Inventory', 'GIS'] },
      { name: 'Vegetation_Ecology', tags: ['R', 'Community Ecology', 'Vegetation'] },
    ],
  },
  {
    id: 'climate-data',
    title: 'Climate Data Infrastructure',
    icon: 'climate',
    blurb: 'High-resolution bioclimatic data processing from CMIP6 climate projections.',
    repos: [{ name: 'BhutanBioClims', tags: ['Climate Data', 'CMIP6', 'Spatial Analysis'] }],
  },
  {
    id: 'ecosystem-assessment',
    title: 'Ecosystem Assessment & Conservation Planning',
    icon: 'ecosystem',
    blurb: 'Protected-area integrity assessment and community forest-resource governance.',
    repos: [
      { name: 'EII_Bhutan_Protected_Areas', tags: ['Python', 'Ecosystem Integrity Index', 'Protected Areas'] },
      { name: 'bhutan-nwfp-platform', tags: ['Web Platform', 'Community Forestry'] },
    ],
  },
  {
    id: 'education',
    title: 'Education & Knowledge Sharing',
    icon: 'education',
    blurb: 'Open teaching materials and institutional readiness training.',
    repos: [
      { name: 'men201-forest-mensuration', tags: ['HTML', 'Forestry Education'] },
      { name: 'Bhutan_HFLD_Readiness_Training', tags: ['Policy', 'Training'] },
    ],
  },
];

export type DomainRepo = Repository & { href: string; tags: string[] };

export function domainRepos(domain: ResearchDomain): DomainRepo[] {
  return domain.repos
    .map(({ name, tags }) => {
      const repo = REPOSITORIES.find((r) => r.name === name);
      return repo ? { ...repo, tags, href: `https://github.com/wangdiues/${repo.name}` } : null;
    })
    .filter((repo): repo is DomainRepo => Boolean(repo));
}

export const TECH_ECOSYSTEM: { label: string; items: string[] }[] = [
  { label: 'Programming', items: ['R', 'Python', 'JavaScript', 'HTML'] },
  {
    label: 'Ecological Modelling',
    items: ['SDM', 'MaxEnt', 'BART', 'Occupancy Models', 'Bayesian Models'],
  },
  { label: 'Spatial', items: ['QGIS', 'ArcGIS', 'Google Earth Engine'] },
  { label: 'Field Data', items: ['Camera traps', 'GPS telemetry', 'Bioacoustics', 'Drones'] },
];
