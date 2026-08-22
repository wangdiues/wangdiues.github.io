# Geospatial Data Disclosure Policy (Decision D1)

_Status: policy adopted 2026-08-22. Clearance conversations with DoFPS not yet held._

Fine-resolution occurrence data for tigers and elephants must not be openly published: the
poaching-facilitation pathway from published occurrence records is documented in the
conservation literature, and survey coordinates collected under DoFPS/RGoB programmes are
institutional data, not personal data.

## Per-layer rules

| Layer                               | Publishable form                                        | Clearance needed        |
| ----------------------------------- | ------------------------------------------------------- | ----------------------- |
| Protected areas, BC-03              | Full resolution (public boundaries)                     | None                    |
| SDM / habitat suitability surfaces  | Full resolution (modelled, not detections)              | Author's own outputs    |
| Camera-trap network                 | 10 × 10 km grid cells or survey-extent polygon only     | DoFPS written sign-off  |
| Tiger detections / occupancy inputs | Not openly publishable; aggregated results only         | DoFPS written sign-off  |
| Elephant movement ranges            | Extents already published in peer-reviewed figures only | DoFPS + co-author check |
| Great Hornbill routes (telemetry)   | Published extents only                                  | DoFPS + collaborators   |
| Cordyceps harvesting areas          | Gewog-level aggregation minimum                         | DoFPS/division input    |
| NFI plots                           | Aggregate or omit (institutional coordinates)           | DoFPS written sign-off  |
| Land cover                          | Full resolution (public national dataset)               | Attribution only        |

## M3 content overlap

`elephant-movement-habitat-selection` and `elephant-seasonal-search-dynamics` are built on GPS
collar telemetry (four individuals, 39,578 validated fixes, Gelephu–Sarpang). Their entries carry
a `geo` flag; any future public map layer derived from them follows the "published extents only"
rule and requires DoFPS + co-author clearance before appearing anywhere on the site.

If clearance never arrives, V2.1 ships with public boundaries and the author's own SDM outputs only.
