# content/images/

Migration-ready ledger for the **887** referenced WordPress files
(`project_gallery` ∪ `_thumbnail_id`). Photographs stay in the git-ignored dump.
This tree also holds brand interim rasters and partner ID-crops (the small,
deliberate exceptions in the work order). No project photography.

## Regenerate

From the repo root, with the local dump present:

```bash
node scripts/build-image-manifest.mjs --uploads wp-content/uploads
```

Requires macOS `sips` (pixel measure) and Node stdlib only — no npm install, no network.
Reads `inputs/derived/project-images.tsv` (never hand-edit that file; re-run
`python3 scripts/wxr-extract.py` if the extract must change).

Outputs:

| File | Role |
|---|---|
| `image-manifest.tsv` | one row per referenced attachment: served vs chosen source, measured dims, aspect, orientation, hero flag, notes |
| `checksums-887.tsv` | sha256 + bytes of the **chosen source** (original when larger) |

## Source selection rule

- If `has_larger_original=yes` → measure and hash `original_file` (hidden full-size).
- Else → `file` (the path WordPress serves).
- Never use Imagify `.webp` derivatives.

## Hero rule

An image is **hero-capable** when `measured_w >= 1920` on the chosen source.
A **project** is hero-capable when its max measured width across referenced images is ≥1920.

## What a reviewer checks

1. Manifest and checksums each have **887 data rows** (888 lines with header).
2. `missing` notes: **should be none** — every chosen source exists under uploads.
3. Counts hold: **388** `larger_original`, **137** `parent_is_zero`, **887** rows.
4. Never filtered on attachment parent — the 137 `post: 0` gallery images are real photos and present.
5. Hero-capable **project** count vs baselines (see below).
6. The eight featured-∉-own-gallery projects resolve a real source on disk (table below).
7. Spot-check: a `has_larger_original=yes` row uses the unscaled path and `measured_w` ≥ `wp_w`.

## Measured results (this run)

| Measure | Value |
|---|---|
| Referenced rows | 887 |
| Missing chosen sources | 0 |
| Served paths missing | 0 |
| Flagged originals missing | 0 |
| `has_larger_original=yes` | 388 |
| `parent_is_zero=yes` | 137 |
| `featured_only=yes` rows | 7 |
| Hero-capable **images** (`measured_w ≥ 1920`) | 480 |
| Hero-capable **projects** (max measured_w ≥ 1920) | **35** |

### Hero count vs PLAN / EXTRACT

| Source | Hero-capable projects |
|---|---|
| PLAN §7 | 34 / 58 |
| EXTRACT-REPORT (widest gallery, WP served dims) | 35 / 58 |
| This measurement (chosen originals on disk) | **35 / 58** |

PLAN's 34 is stale relative to the export + disk measure. See
`content/findings/hero-measure-finding.md`. Counts 887 / 388 / 137 are unchanged.

### Featured outside own gallery (8 projects)

EXTRACT counts **7** attachments that are featured and in no gallery at all
(`featured_only=yes`). CLAUDE / the work order still list **8 projects** whose
featured image is outside *that project's* gallery — the eighth is
`madison-ave-duplex-2`, whose `_thumbnail_id` **727** appears in another project's
gallery (`53rd-st-studio`), so it is not `featured_only` in `project-images.tsv`.

| Project slug | Source exists | Chosen source |
|---|---|---|
| free-people-retail-store | yes | `2019/12/Free-People-Updated-Featured.jpg` |
| hudson-street-penthouse | yes | `2019/12/Hudson-Featured-1.jpg` |
| madison-ave-duplex-2 | yes | `2019/12/SL-_-Residential-_-215-Madision-_-Residence-3.425x3.jpg` (attachment 727, shared) |
| st-lukes-place-townhouse | yes | `2019/12/1-1.jpg` |
| west-23rd-townhouse-2 | yes | `2019/12/W23-Featured.jpg.png` |
| indeed-corporate-office-suite | yes | `2019/12/Indeed-Updated-Featured.jpg` |
| autrium-corporate-office | yes | `2019/12/Streamline-USA-Atrium-5.65x4.11.jpg` |
| 700-park-ave | yes | `2023/05/20230306_700ParkAve-3294.jpg` |

## Dump totals (measured-from-disk)

Dated **2026-08-20**. Reproduction:

```bash
find wp-content/uploads -type f | wc -l
du -sk wp-content/uploads
```

| Measure | Value |
|---|---|
| Files under `wp-content/uploads` | 25,883 |
| Disk usage | 12,129,628 KB (~11.6 GiB) |

Photographs are **not** committed. Do not copy `wp-content/` into the repo.
