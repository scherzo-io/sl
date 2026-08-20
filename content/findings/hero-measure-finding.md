# Hero-capable project count is 35/58 on disk, not PLAN's 34

Found 2026-08-20, via `node scripts/build-image-manifest.mjs --uploads wp-content/uploads`
measuring the 887 chosen sources under `wp-content/uploads` with macOS `sips`.
PLAN §7's **34 of 58** hero-capable figure is stale; the export + disk measure both say **35**.

## What's there

| Measure | PLAN §7 | EXTRACT-REPORT | This run |
|---|---|---|---|
| Referenced union | 887 | 887 | 887 |
| Larger originals (referenced) | 388 (387 gallery + 1 featured-only) | 387 gallery + flag on union | **388** |
| Gallery `post: 0` | 137 | 137 | **137** |
| Hero-capable **projects** (max width ≥1920) | **34** | **35** (widest gallery, WP served dims) | **35** (measured originals) |
| Hero-capable **images** | — | 445 gallery (WP served ≥1920) | **480** (measured chosen sources) |

Unchanged vs PLAN/EXTRACT baselines: **887**, **388**, **137**. Only the hero **project** count moves relative to PLAN.

## Measured evidence

- Manifest: `content/images/image-manifest.tsv` — 887 data rows; `hero_capable=yes` when `measured_w >= 1920`.
- Stdout of the builder: `hero_capable_projects: 35`, `missing_source: 0`.
- EXTRACT-REPORT already recorded 35 projects whose widest *gallery* image is ≥1920 on WordPress metadata; measuring hidden originals does not drop that set below 35.
- Image-level hero count rises 445 → 480 because originals are wider than served `-scaled` / derivative dims and featured-only rows are included.

## The catch

- PLAN §7's "34" came from the earlier live audit (`content/image-audit.tsv` era) and was never re-asserted against the 2026-08-20 WXR extract.
- Hero-capable ≠ "good hero crop": square-heavy projects and weak featured images still need DESIGN §8 treatment.
- Do not edit PLAN §1 rows; supersede with a new decision-table row if the build lane adopts 35 formally.

## Decision / rule

Treat **35 / 58** as the reproducible hero-capable project count for migration gating until a human supersedes PLAN. Source selection remains: prefer `original_file` when `has_larger_original=yes`, else `file`; never Imagify `.webp`. An image is hero-capable iff measured width ≥ 1920 on that chosen source.

## Reproducing

```bash
node scripts/build-image-manifest.mjs --uploads wp-content/uploads
# expect: hero_capable_projects: 35
awk -F'\t' 'NR==1{next} $12=="yes"{p[$2]=1} END{print length(p)}' content/images/image-manifest.tsv
```
