export interface GeoLayer {
  id: string;
  label: string;
  file: string;
  description: string;
  clearance: "none" | "dofps";
}

export const LAYERS: GeoLayer[] = [];
