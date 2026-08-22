# Approved map-layer publication

Only disclosure-cleared, generalized GeoJSON may be published. Raw coordinates, candidate
layers, and files awaiting review must remain outside this public repository.

To publish a layer:

1. Confirm its permitted resolution and clearance under `docs/GEODATA.md`.
2. Remove every property that is not approved for public release.
3. Put the final RFC 7946 WGS84 file in `public/geo/`.
4. Add its approved metadata to `layers.json`. `publicFields` is an allowlist: CI rejects
   a GeoJSON feature containing any other property.
5. Run `npm run verify`.

`clearance.requirement: "dofps"` requires both an approval reference and approval date.
Entries with no institutional requirement use `"none"` and document their public-data basis.
An unregistered file in `public/geo/` fails the build.

The registry is empty by design until the first layer completes this process.
