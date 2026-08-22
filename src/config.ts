export const SOCIAL = [
  {
    label: "Email",
    value: "wangdiues@gmail.com",
    href: "mailto:wangdiues@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "/in/wangdiues",
    href: "https://www.linkedin.com/in/wangdiues/",
  },
  {
    label: "ORCID",
    value: "0009-0007-7726-1742",
    href: "https://orcid.org/0009-0007-7726-1742",
  },
  {
    label: "GitHub",
    value: "@wangdiues",
    href: "https://github.com/wangdiues",
  },
];

export type Repository = {
  name: string;
  description: string;
  language?: string;
};

export const GITHUB_PROFILE = "https://github.com/wangdiues";

export const REPOSITORIES: Repository[] = [
  {
    name: "camtrap_ecology_analytics",
    description:
      "Reproducible R pipeline for camera-trap community ecology in South-Central Bhutan — occupancy modelling, diel activity, spatial disturbance, and community structure across 15 analysis stages.",
    language: "R",
  },
  {
    name: "elephant_movement_ecology",
    description:
      "Movement ecology analysis pipeline for elephant tracking, habitat use, resource selection, and conflict risk modelling.",
    language: "Python",
  },
  {
    name: "Elephas_maximus_SDM_Project_v4",
    description:
      "Species distribution modelling pipeline for Asian elephants in Bhutan under CMIP6 climate-change scenarios.",
    language: "R",
  },
  {
    name: "forest-carbon-modelling-climate-change-scenarios",
    description:
      "Forest carbon stock modelling and climate-change scenario analysis using Google Earth Engine, NFI data, and ensemble machine learning.",
    language: "Python",
  },
  {
    name: "Bhutan_Forest_Stratification",
    description:
      "Forest stratification and vertical zonation analysis across environmental gradients using National Forest Inventory data.",
    language: "Python",
  },
  {
    name: "BhutanBioClims",
    description:
      "Processing pipeline and metadata for 250 m bioclimatic variables (BIO1–BIO19) computed for Bhutan from CMIP6 climate projections.",
    language: "HTML",
  },
  {
    name: "Vegetation_Ecology",
    description:
      "Analysis pipeline for vegetation community data — trees, shrubs, herbs, and regeneration — with environmental correlates.",
    language: "R",
  },
  {
    name: "EII_Bhutan_Protected_Areas",
    description:
      "Reproducible analysis of Ecosystem Integrity Index patterns across Bhutan's protected-area network.",
    language: "Python",
  },
  {
    name: "bhutan-nwfp-platform",
    description:
      "Web marketplace and management platform for Bhutan's non-wood forest product sector.",
    language: "HTML",
  },
  {
    name: "men201-forest-mensuration",
    description:
      "MEN 201 Forest Mensuration teaching materials — seven decks, 343 slides for BSc Forestry at the College of Natural Resources.",
    language: "HTML",
  },
  {
    name: "Bhutan_HFLD_Readiness_Training",
    description:
      "Training materials supporting Bhutan's High Forest Cover, Low Deforestation (HFLD) readiness.",
  },
];

export const FIELD_METHODS = [
  "Camera-trap surveys",
  "Occupancy modelling",
  "Species distribution modelling",
  "Forest inventory",
  "Climate vulnerability assessment",
  "Human–wildlife coexistence planning",
];

export const PLATFORMS = [
  "R",
  "Python",
  "QGIS",
  "ArcGIS",
  "Google Earth Engine",
  "MaxEnt",
  "MODIS / Sentinel",
  "GEDI",
];
