import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

const MANIFEST = "src/data/geo/layers.json";
const PUBLIC_DIR = "public/geo";
const failures = [];
const layers = JSON.parse(readFileSync(MANIFEST, "utf8"));
const ids = new Set();
const files = new Set();

const geometryTypes = {
  polygon: new Set(["Polygon", "MultiPolygon"]),
  line: new Set(["LineString", "MultiLineString"]),
  point: new Set(["Point", "MultiPoint"]),
};

function nonempty(value) {
  return typeof value === "string" && value.trim() !== "";
}

function validCoordinates(value) {
  if (!Array.isArray(value) || value.length === 0) return false;
  if (value.every((item) => typeof item === "number")) {
    return (
      value.length >= 2 &&
      value.every(Number.isFinite) &&
      value[0] >= -180 &&
      value[0] <= 180 &&
      value[1] >= -90 &&
      value[1] <= 90
    );
  }
  return value.every(validCoordinates);
}

if (!Array.isArray(layers)) {
  failures.push(`${MANIFEST}: root value must be an array`);
} else {
  for (const layer of layers) {
    if (!layer || typeof layer !== "object") {
      failures.push(`${MANIFEST}: every layer must be an object`);
      continue;
    }
    const label = nonempty(layer.id) ? layer.id : "<unknown>";
    if (!/^[a-z0-9][a-z0-9-]*$/.test(layer.id ?? "")) {
      failures.push(`${label}: id must be a lowercase URL-safe slug`);
    } else if (ids.has(layer.id)) {
      failures.push(`${label}: duplicate layer id`);
    }
    ids.add(layer.id);

    if (
      !nonempty(layer.file) ||
      basename(layer.file) !== layer.file ||
      !layer.file.endsWith(".geojson")
    ) {
      failures.push(`${label}: file must be a safe .geojson basename`);
    } else if (files.has(layer.file)) {
      failures.push(`${label}: duplicate layer file ${layer.file}`);
    }
    files.add(layer.file);

    for (const field of ["label", "description", "attribution"]) {
      if (!nonempty(layer[field])) failures.push(`${label}: ${field} is required`);
    }
    if (!Object.hasOwn(geometryTypes, layer.geometry)) {
      failures.push(`${label}: geometry must be polygon, line, or point`);
    }
    if (!Array.isArray(layer.publicFields) || layer.publicFields.length === 0) {
      failures.push(`${label}: publicFields must contain at least one approved field`);
    }
    const publicKeys = new Set();
    for (const field of layer.publicFields ?? []) {
      if (!nonempty(field?.key) || !nonempty(field?.label)) {
        failures.push(`${label}: every public field needs a key and label`);
      } else if (publicKeys.has(field.key)) {
        failures.push(`${label}: duplicate public field ${field.key}`);
      }
      publicKeys.add(field?.key);
    }

    const clearance = layer.clearance;
    if (clearance?.requirement === "none") {
      if (!nonempty(clearance.basis)) failures.push(`${label}: public-data basis is required`);
    } else if (clearance?.requirement === "dofps") {
      if (!nonempty(clearance.approvalRef)) failures.push(`${label}: DoFPS approvalRef is required`);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(clearance.approvedOn ?? "") ||
        Number.isNaN(Date.parse(`${clearance.approvedOn}T00:00:00Z`))
      ) {
        failures.push(`${label}: approvedOn must be a valid ISO date`);
      }
    } else {
      failures.push(`${label}: clearance must explicitly be none or dofps-approved`);
    }

    if (!nonempty(layer.file) || basename(layer.file) !== layer.file) continue;
    const path = join(PUBLIC_DIR, layer.file);
    if (!existsSync(path)) {
      failures.push(`${label}: approved GeoJSON file is missing at ${path}`);
      continue;
    }

    let geojson;
    try {
      geojson = JSON.parse(readFileSync(path, "utf8"));
    } catch (error) {
      failures.push(`${label}: invalid JSON (${error.message})`);
      continue;
    }
    if (geojson?.type !== "FeatureCollection" || !Array.isArray(geojson.features)) {
      failures.push(`${label}: GeoJSON must be a FeatureCollection`);
      continue;
    }
    if (Object.hasOwn(geojson, "crs")) {
      failures.push(`${label}: explicit CRS is not allowed; publish RFC 7946 WGS84 GeoJSON`);
    }
    for (const [index, feature] of geojson.features.entries()) {
      const prefix = `${label}: feature ${index + 1}`;
      if (feature?.type !== "Feature" || !feature.geometry || typeof feature.properties !== "object" || Array.isArray(feature.properties)) {
        failures.push(`${prefix} is not a valid GeoJSON Feature`);
        continue;
      }
      if (!geometryTypes[layer.geometry]?.has(feature.geometry.type)) {
        failures.push(`${prefix} has ${feature.geometry.type}; expected ${layer.geometry}`);
      }
      if (!validCoordinates(feature.geometry.coordinates)) {
        failures.push(`${prefix} has invalid or out-of-range WGS84 coordinates`);
      }
      for (const key of Object.keys(feature.properties ?? {})) {
        if (!publicKeys.has(key)) failures.push(`${prefix} exposes undeclared property ${key}`);
      }
    }
  }
}

const publicFiles = existsSync(PUBLIC_DIR)
  ? readdirSync(PUBLIC_DIR, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name !== ".gitkeep")
      .map((entry) => entry.name)
  : [];

for (const name of publicFiles) {
  if (!files.has(name)) failures.push(`${PUBLIC_DIR}/${name}: public GeoJSON is not approved in ${MANIFEST}`);
}

if (failures.length > 0) {
  console.error("Geo disclosure violations:\n" + failures.map((failure) => `  - ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Geo layers OK: ${layers.length} approved public layer(s)`);
