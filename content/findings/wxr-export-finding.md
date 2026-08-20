# A full WordPress export exists — every live-measured number is now reproducible offline

Found 2026-08-20, in `~/Downloads/Zipcodes/streamlineusa.WordPress.2026-08-20.xml`: a
complete WXR export of streamlineusa.com, taken the same day as the review. It is now
committed at `inputs/raw/streamlineusa.WordPress.2026-08-20.xml` (13.1 MB).

This changes what the repo can prove on its own. Until now the migration's key figures were
*measured-from-live* — reproducible only with a network round-trip, and the library-wide ones
only with an authenticated session (`content/originals-finding.md`, PLAN §11 step 4). All of
them now recompute from one committed file, with no network, no credentials and no
authenticated media endpoint. It also removes the need to transcribe the 10 Elementor pages
by hand (PLAN §1 row 8): their copy is in the export.

## What's there

`scripts/wxr-extract.py` parses the export into `inputs/derived/`. 1,883 `<item>` records:

| Record type | Count | What it gives us |
|---|---|---|
| `attachment` | 1,764 (1,763 `image/*`) | the whole media library: path, true dimensions, `original_image`, alt text, upload date, WP parent |
| `post` | 58 | the projects — every ACF field, `project_gallery` as ordered attachment IDs, `_thumbnail_id` |
| `page` | 19 (12 published, 7 drafts) | the 10 real pages plus WordPress litter, copy included |
| `elementor_library` | 20 | reusable templates |
| `nav_menu_item` | 6 | the live menu, with the orphaned About pages visible as absences |
| `elementor-hf` + `astra-advanced-hook` | 2 | the header/footer and the "content outside pages" PLAN §3 flagged |
| `acf-field-group` / `acf-field` | 2 / 10 | the field definitions behind the portfolio |

## Measured evidence

17 assertions run on every extract (`inputs/derived/EXTRACT-REPORT.md`); all 17 pass against
`PLAN.md` as written:

| PLAN claim | Expected | From the export |
|---|---|---|
| §3 projects · commercial / residential | 58 · 27/31 | 58 · 27/31 ✅ |
| §3 gallery images | 880 | 880 ✅ |
| row 18 referenced union (`project_gallery` ∪ `_thumbnail_id`) | 887 | 887 ✅ |
| row 18 featured images outside their own gallery | 7 | 7 ✅ |
| §7 gallery images whose WP `post_parent` is 0 | 137 | 137 ✅ |
| §7 gallery images with a larger original on disk | 387 | 387 ✅ |
| §7 library images with a larger original | 791 | 791 ✅ |
| §7 gallery images ≥1920px · ≥2048px · square | 445 · 259 · 74 | 445 · 259 · 74 ✅ |
| §7 gallery images missing alt text | 878 of 880 | 878 ✅ |
| row 19 architects empty · pseudo-blank | 5 · 3 | 5 · 3 ✅ |
| row 13 distinct raw `role` strings | 10 | 10 ✅ |
| §3 projects with empty `post_content` | 58 | 58 ✅ |

Cross-checked against the git-ignored disk dump
(`python3 scripts/wxr-extract.py --uploads wp-content/uploads`):

- **887 of 887** referenced files present on disk as served
- **887 of 887** referenced *originals* present on disk

Nothing referenced by a project is missing locally. The dump's empty `2021/`, `2024/`,
`2025/` and `2026/` directories are not a gap: the newest project images were uploaded in
2023 (see the date correction below).

Two independent cross-checks also hold. `content/image-audit.tsv` agrees with the export on
image counts, min/max widths, `≥1920`, square and alt counts for all 58 projects; four
projects differ on `median_w` only (`kat-theo` 1860/1857, `free-people-retail-store`
1107/868, `hudson-street-penthouse` 1280/1211, `madison-ave-duplex-2` 1027/982) — a
median-of-even-set convention difference, not a data disagreement. And the 2022 WordPress
export buried in the dump (`inputs/raw/wpallexport-posts-2022-03-18.csv`, 45 projects, 684
unique gallery files) resolves 684/684 against disk.

## The catch

Three numbers in the document set need correcting, and one class of new work appears:

1. **Library image total: 1,744 → 1,763.** PLAN §7 and `originals-finding.md` carry
   "1,744 images / 1,760 media items" from the 19 Aug authenticated read. The export says
   1,764 attachment records, 1,763 with an `image/*` mime type. The *derived* numbers are
   unaffected — 791, 387, 137, 880, 887 all reproduce exactly — so only the denominator
   moves, and "roughly 857 unreferenced" becomes **876 unreferenced** (1,763 − 887).
2. **Newest project: October 2023, not October 2024.** PLAN §3 says "Newest: Lantern House
   (Oct 2024)". Both Lantern House and 795 5th Ave (The Pierre) were published
   **2023-10-18**. The site has had no new project in 22 months — worth knowing before
   telling Eric the portfolio is current.
3. **`sq_feet` is a dead ACF field** — present on all 58 projects, empty on all 58.
   `size_sq_ft` is the live one. Any tooling that reads ACF keys by pattern must not pick it
   up.
4. **Yoast holds no metadata.** `_yoast_wpseo_title` and `_yoast_wpseo_metadesc`: zero
   occurrences anywhere in the export. PLAN §3's "no SEO-plugin metadata" is confirmed, so
   every title and description on the new site is written fresh, not migrated.

What the export does *not* settle: it records the dimensions WordPress *serves*. For the 791
attachments with a larger original, the `width`/`height` in `_wp_attachment_metadata` are the
scaled copy's. True original dimensions have to be measured off disk — that is the image
lane's job (`workorders/cursor-images.md`), not something the export answers.

It is also a snapshot, not a live feed: dated 2026-08-20. If anyone edits the WordPress site
after that date, the export is stale and says nothing about it.

## Decision / rule

- **`inputs/raw/` is the source of record; `inputs/derived/` is generated.** Never hand-edit
  anything under `inputs/derived/` — change the script and re-run. Both are committed so that
  an agent reading this repo over GitHub, with no shell and no ability to open a 13 MB XML or
  a binary `.xlsx`, still has the data in text form.
- **PLAN §11 step 4's authenticated-manifest dependency is closed.** The manifest is built
  from the committed export plus the local dump. No WP admin session is required for any
  number in this repo.
- The one redaction on the way in: two WordPress author email addresses (a third party's
  personal Gmail, and Alexey's) replaced with `[email redacted 2026-08-20]`. Provenance
  hashes in `inputs/raw/README.md`. Nothing else was altered.
- The four phone numbers the export carries are all published on the live contact page
  (main office `646-307-9001`, a second office line, and Eric's and Liam's mobiles). They are
  candidates for `siteSettings` — **which of them the new site publishes is Eric's call**,
  not an automatic migration.

Related: [`legacy-slugs-finding.md`](legacy-slugs-finding.md) — the retired-URL history the
same export exposes. `originals-finding.md` — the originals numbers this finding makes
reproducible.

## Reproducing

```bash
python3 scripts/wxr-extract.py                                   # repo-only, no network
python3 scripts/wxr-extract.py --uploads wp-content/uploads      # adds the disk check
python3 scripts/xlsx-extract.py                                  # workbooks → TSV
```

Stdlib Python 3, deterministic. `scripts/stage-raw-inputs.py` re-stages the raw sources from
the 20 Aug source folder and prints sha256 before and after, if the provenance ever needs
re-proving.
