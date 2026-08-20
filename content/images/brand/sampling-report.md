# Streamline wordmark red — sampling report

Source: `inputs/raw/brand/streamline-logo.png` (2048×566 PNG, black canvas).

## Dominant wordmark red

| Metric | Value |
|---|---|
| **Modal / dominant hex** | `#DE2426` (62,258 of 66,785 sampled pixels) |
| **Sampling region** | STREAMLINE letter fills only — y 8–62%, x 2–72% of canvas; excludes white tagline, USA outline, swoosh, and background |
| **R spread** | 222–234 |
| **G spread** | 36–118 |
| **B spread** | 38–119 |

Top non-modal reds (anti-aliased edge tints): `#DF2E30`, `#DF2D2F`, `#E65B5C`, `#E75F60`, `#DE2628`.

## Relation to locked / retired reds

| Reference | Hex | ΔR,ΔG,ΔB vs modal `#DE2426` |
|---|---|---|
| Locked (DESIGN) | `#DA2128` | +4, +3, −2 — slightly darker / deeper than master PNG fill |
| Retired | `#D42E12` | +10, −10, +20 — much oranger; not a match |
| Remembered | `#DE2426` | 0, 0, 0 — **exact match** to modal wordmark fill |

**Read:** The logo master’s filled STREAMLINE pixels match remembered `#DE2426`, not locked `#DA2128`. Edge anti-alias pulls toward `#DF2E30` / `#E65B5C`. Do not average the full canvas (white + black would wash out red).

## Reproduce

```bash
/Users/alexeyetcheverry/sl/content/images/brand/sample-logo-red.py
```

Writes `content/images/brand/sampling-report.json` plus interim rasters:

- `streamline-logo-trimmed.png` — black → transparent, bbox-trimmed
- `streamline-logo-trimmed-2x.png` — 2× retina of trimmed mark (Lanczos from master)
- `streamline-logo-sidebar-1A1A1A.png` — wordmark pixels preserved on `#1A1A1A` ground (no new red invented)

Sampled 2026-08-20.
