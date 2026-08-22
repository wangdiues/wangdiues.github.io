import layerData from "./layers.json";

export interface GeoField {
  key: string;
  label: string;
}

export type GeoClearance =
  | { requirement: "none"; basis: string }
  | {
      requirement: "dofps";
      approvalRef: string;
      approvedOn: string;
    };

export interface GeoLayer {
  id: string;
  label: string;
  file: string;
  description: string;
  attribution: string;
  geometry: "polygon" | "line" | "point";
  publicFields: GeoField[];
  clearance: GeoClearance;
}

export const LAYERS = layerData as GeoLayer[];
