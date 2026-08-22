# Geo layer drop-in (V2.1)

Layers activate in three steps — no code changes elsewhere:

1. **Add the file** to this folder as GeoJSON (`WGS84`, EPSG:4326), respecting the
   resolution rules in `docs/GEODATA.md`. Sensitive layers (camera-trap grids, telemetry)
   additionally require DoFPS written clearance — see `docs/DRAFT_DOFPS_REQUEST.md`.
2. **Register it** in `layers.ts`:

```ts
export interface GeoLayer {
  id: string; // unique
  label: string; // shown in the layer panel
  file: string; // e.g. 'protected-areas.geojson'
  description: string; // shown in the data table caption
  clearance: "none" | "dofps";
}
```

3. **Rebuild.** The layer appears as a toggle on `/explore`, and its properties render in
   the accessible data-table view automatically.

## Current registry

Empty by design: no layer ships until its file exists here and its clearance column is
satisfied. Protected-area boundaries and Wangdi's own SDM surfaces need no clearance;
everything occurrence-based does.
