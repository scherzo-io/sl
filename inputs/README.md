# inputs/

Source data for the migration. Two halves, and the distinction is the whole point:

| | |
|---|---|
| `inputs/raw/` | **source of record.** Snapshots of external sources, byte-for-byte apart from the one redaction noted below. Never edited by hand, never regenerated. |
| `inputs/derived/` | **generated.** Everything here is produced by a script in `scripts/` from `inputs/raw/`. Never hand-edit it — change the script and re-run. |

Why both are committed: the primary sources are a 13 MB XML file and two binary
workbooks. An agent reading this repo over GitHub — no shell, no ability to unzip an
`.xlsx` — cannot use those. `inputs/derived/` is the same data in text a reader can
actually open. COWORK.md §4 requires the raw snapshot; the derived half is what makes it
usable.

## inputs/raw/

| File | Source | sha256 | Bytes |
|---|---|---|---|
| `streamlineusa.WordPress.2026-08-20.xml` | full WXR export of streamlineusa.com, taken 2026-08-20 | `9909cef29739b73c1d48efd0ad8b3342bee0f48fcb5dffd60f4237bd1934a3e1` | 13,112,976 |
| `StreamlineUSA_WebContent_v2.xlsx` | Eric's content workbook v2, 2026-06-23 | `ce5383c51c594d2eac8fbffd084686f4f7b03917eb6bebd60cc62f5f639d7852` | 90,151 |
| `StreamlineUSA_WebContent_v1.xlsx` | the earlier workbook (`Streamline Content.xlsx`), 2026-06-23 | `34681e317cd44bc00a1d5f82c2d0fb15375a4f8e14330825d5d8925f2ddaf729` | 55,039 |
| `wpallexport-posts-2022-03-18.csv` | WP All Export run found inside the dump, 45 projects with gallery URLs | `79023570c0cd43ffcf9accf9467e1ddcb96bdb35143eb5c4f69c6a959b128a40` | 100,504 |
| `brand/streamline-logo.png` | logo master, 2048×566 — the source of the `#DA2128` red family (PLAN §1 row 11) | `a8074b349d51d3000585068132da0c89ed2f4ed82f6e1baa6ade7b325977295b` | 57,427 |

**The one transform.** The WXR export as exported contains two WordPress author email
addresses — a third party's personal Gmail and Alexey's. Both were replaced with
`[email redacted 2026-08-20]` before the file entered a repo with a GitHub remote. Nothing
else was changed.

- unredacted source sha256: `637ccc4f56076e79b624e797b36bd4a40ade05ff833e5b6fee30ba59ea8fd8fb`
- committed sha256: `9909cef29739b73c1d48efd0ad8b3342bee0f48fcb5dffd60f4237bd1934a3e1`
- re-stage and re-prove with `python3 scripts/stage-raw-inputs.py`

The export also carries four phone numbers, all of them already published on the live
contact page (main office `646-307-9001`, a second office line, and Eric's and Liam's
mobiles). They are candidates for `siteSettings` — which ones the new site publishes is
Eric's call, not an automatic migration (`content/findings/wxr-export-finding.md`).

## inputs/derived/

Regenerate everything with:

```bash
python3 scripts/wxr-extract.py                                # repo-only, no network
python3 scripts/wxr-extract.py --uploads wp-content/uploads   # adds the disk cross-check
python3 scripts/xlsx-extract.py                               # workbooks → TSV
```

| Path | What |
|---|---|
| `EXTRACT-REPORT.md` | counts, 17 assertions against PLAN.md, anomalies. Read this first |
| `projects.tsv` | the 58 projects, one row each: every ACF field, gallery IDs, per-project image stats |
| `projects/<slug>.md` | the same 58 as readable prose — description, mission, challenges, lessons_learned |
| `attachments.tsv` | all 1,764 media-library records: path, original, dimensions, alt, WP parent |
| `project-images.tsv` | the 887-file referenced set joined to its project, with on-disk columns |
| `legacy-slugs.tsv` | 73 retired project URLs, each classified 301 / SKIP / REVIEW |
| `pages/<slug>.txt` | page copy with the Elementor wrapper unwrapped, styling keys dropped |
| `nav-menu.tsv` | the live WordPress menu |
| `site-chrome.txt` | header/footer, Astra hook and Elementor templates — the copy that lives outside pages |
| `workbook-v2/*.tsv` | Portfolio · Filters · Testimonials · is_unique · Inspo_Competitors |
| `workbook-v1/*.tsv` | the earlier workbook's six sheets |

## Deliberately not here

| Not committed | Why |
|---|---|
| The two capability deck PDFs | They contain the REFERENCES block — three architects' direct phones and emails. CLAUDE.md forbids it entering the repo in any form. The scrubbed OCR transcripts in `content/deck-transcripts/` are the repo-side source; verifying a string against a page image is a local, manual step. |
| `Internal Notes_StreamlineUSA/` | Internal working notes. Out until Alexey decides otherwise, per COWORK.md §5. |
| The website proposal PDF | Commercial detail (COWORK.md §5). |
| The July 10 transcript | Decisions only, and those are already in PLAN §1. Never in the repo. |
| `wp-content/` (the ~12 GB dump) | Git-ignored, ~12 GB, and the image lane reads it locally. The 887 files referenced by projects are all present in it — verified. |
| `Images_Streamline/*.png` (ten 2048×2048 client PNGs) | ~52 MB of client-supplied stills that sit outside the WordPress library. The image lane reconciles them against the 887 locally before anything is committed. |
