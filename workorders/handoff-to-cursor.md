# Handoff — Cursor (`cursor/images`) from Grok (`grok/build`)

**Date:** 2026-08-20 (updated after PLAN §1 rows 30–32)
**From:** Grok, executing [`grok-build.md`](grok-build.md) in a GitHub-clone sandbox
**To:** Cursor, locally in `~/sl` on `cursor/images` per [`cursor-images.md`](cursor-images.md)

Image-set output paths are still only those in `cursor-images.md` §5. Do not invent siblings.

**Moved to you by the 2026-08-20b work order (do not leave these on Grok):**

- Live HEAD of all 73 legacy URLs, including the 11 SKIP rows still serving 200 → `content/link-check/<date>.tsv`
- Deck-OCR string verification → `content/deck-corrections.tsv`
- Partner **names** read off commercial p42 (artwork is unusable — PLAN §1 row 31)
- Logo master raster set → `content/images/brand/`
- On-screen / keyboard review of `workorders/handoffs/grok-*.md`
- Day-one ask to Alexey for video files (`cursor-images.md` §5.6)

The 887-row image work below is unchanged.

---

## Constraints (yours — Grok will not relax them)

- **Never commit `wp-content/` or any image binary.** ~12 GB vs GitHub’s 100 MB cap.
- **Never filter on attachment parent.** 137 of 880 gallery images are `post: 0`.
  Filter is always `project_gallery ∪ _thumbnail_id` = **887**.
- **Never upscale, AI-enhance, retouch, or generate imagery.**
- Do not hand-edit `inputs/derived/**` or `content/image-audit.tsv`.
- Do not write `scripts/import-*` (Grok Phase F). Skip “asset ingest” in your §5 — it overlaps.
- Local commits only; **do not push** (repo is currently public; CLAUDE.md already said this).
- First fifteen minutes: `python3 scripts/wxr-extract.py --uploads wp-content/uploads`
  must print `assertions failed: 0`. If not, stop.

---

## What Grok needs from you

Paths are fixed. Do not invent `heroes.tsv` / `unreferenced.tsv` siblings. Surprises go in
`content/findings/<topic>-finding.md`.

### 1. Manifest + measured originals — `content/images/image-manifest.tsv`

**887 rows.** Attachment ID, project, served path, chosen source path, **measured original
dimensions**, aspect, orientation, hero-capable, notes.

`scripts/build-image-manifest.mjs` — Node, no network, no credentials; uploads path as an
argument. Re-verify **1,763 / 791 / 388 / 137 / 887**. Prefer hidden originals (strip
`-scaled` / `-WxH`). Never imagify `.webp`. For the 388 with `has_larger_original = yes`,
WP metadata is the *served* copy — measure off disk.

`content/images/README.md` — how to regenerate, what a reviewer checks.

**Blocks Grok:** Phase E (honest `next/image` widths, DESIGN §8 input) and Phase F (source
paths for `_sanityAsset`). Phases A–D proceed with empty photo slots.

### 2. Alt text — `content/images/alt-text.tsv`

**887 to write, not 885.** The two existing values do not survive: Boqueria featured =
`Boqueria`; Kat & Theo featured = `Screen Shot 2016-03-02 at 1.48.15 PM`.

Pattern: `<Project name> — <room/space>, <notable feature>`. Write what is in the frame.
Do not infer rooms, materials, or description claims the frame does not show. Ambiguous →
flag the row. Grok will copy these strings and will not write alt.

**Blocks Grok:** Phase E a11y gate, Phase F migration.

### 3. Eight featured-outside-gallery → a real `heroImage`

CLAUDE.md gates this. Name the attachment ID on the manifest row (`notes` + hero flag).
Summarize the eight picks in the README. If you reject a featured file, write a finding
and propose a PLAN §1 row — do not edit PLAN.md.

| Project | slug | Export note |
|---|---|---|
| Free People | `free-people-retail-store` | featured-only att 580 at 513×601, unusable; gallery has att 1017 1920×2560 |
| Hudson St Penthouse | `hudson-street-penthouse` | featured-only att 755 1280×854; no larger originals |
| Madison Ave Duplex | `madison-ave-duplex-2` | `_thumbnail_id` **727** lives in **`53rd-st-studio`’s gallery**. Do not steal 727. Madison’s own upgradeable: att 1109 |
| St Luke’s Place | `st-lukes-place-townhouse` | featured-only att 1968; one upgradeable att 2597 (`post: 0`) |
| West 23rd Townhouse | `west-23rd-townhouse-2` | featured-only att 538; all 10 are 990×740, no originals |
| Indeed | `indeed-corporate-office-suite` | featured-only att 577; gallery has 1920×2560 upgradeable |
| Atrium | `autrium-corporate-office` | featured-only att 649; **keep the live typo slug** until Eric (PLAN row 27) |
| 700 Park Ave | `700-park-ave` | featured-only att 3749 — the one featured-only with a larger original |

**Blocks Grok:** Phase E heroes, Phase F `project.heroImage` assignment.

### 4. Prove the 137 `post: 0` survived

All 137 must be in the 887-row manifest (not 750). README states the filter in one sentence.
Do not put them in a separate file.

### 5. Square + unusable-at-full-bleed — measured input, not the design decision

Four projects are entirely served 2048×2048, no larger original: `lantern-house` (16),
`795-5th-ave-the-pierre` (16), `652-hudson-st` (21), `40-e66th-st` (19). Measure so
“truly square” is a disk fact. DESIGN §8 treatments (pillarbox / split-pair / Pattern C /
center-crop) are **Grok’s per direction**. Center-crop with protected subjects needs
your crop maps — without maps, Grok will not center-crop (cannot see the frame).

Also measure the named unusables: 12th St Townhouse (all 12 at 640×295), E63rd St Penthouse,
Lexington Ave Townhouse, West 23rd, Horatio, Free People & Spring Studios featured.
Restate hero-capability from measured pixels in the README (PLAN expects quality change,
not count: 34/58 today). If the count moves, write a finding + proposed PLAN §1 row.

### 6. 876 unreferenced library images — finding only

Out of migration scope. Characterise per-project candidates vs plugin/theme junk in
`content/findings/<topic>-finding.md`. **Do not add them to the manifest.** Expanding 887
needs a PLAN §1 row that supersedes row 18.

### 7. Ten client PNGs outside the library — finding only

`~/Downloads/Zipcodes/Streamline USA/Images_Streamline/*.png` (~52 MB, 2048×2048).
Duplicates, better originals, or never-published? Text finding. **Binaries stay out of git.**

### 8. Four `median_w` disagreements — confirm

`image-audit.tsv` vs export: `kat-theo`, `free-people-retail-store`,
`hudson-street-penthouse`, `madison-ave-duplex-2`. If convention, one README paragraph.
If real, a finding and a *proposed* inventory row — do not rewrite Alexey’s file.

---

## What Grok is doing without you

| Phase | Without Cursor output |
|---|---|
| A Eric email | Unblocked — drafting after Alexey looks at this plan |
| B Scaffold | Unblocked — empty `PhotoSlot`, no stock |
| C Schema | Unblocked — `heroImage` / `gallery[]` as types, unassigned |
| D Content | Unblocked except the logo wall (Alexey / PDF, not you) |
| E Three directions | Layouts yes; photography cannot be truthful until the manifest |
| F Migration | **Blocked** on your set + Sanity token + Eric’s email |
| G SEO / redirects | Consumes `content/link-check/` when you land it. Does not hammer the live site. |
| H Verify | Image gates answered from your output alone |

---

## Not yours — do not pick these up

| Item | Owner | Why not Cursor |
|---|---|---|
| Partner logo **marks** (~30, commercial deck p42) | **Alexey**, from the PDF | Images are in a PDF kept out of the repo (REFERENCES block). Not in `wp-content/`, not in the 887. Grok builds `partner` type + empty slots. |
| Vector wordmark | **Eric** | Only `inputs/raw/brand/streamline-logo.png`. Do not trace or upscale it. |
| Sanity project + write token | **Alexey** | Needed to *run* ingest, not to measure. |
| Video files / hosting | **Eric** | Not still photography. |
| 21 conflict rows, taxonomy, 8 pipeline, phones, Procore, RFP, WP 564/558 | **Eric** | Not an image-dump job. |

---

## Done looks like (`cursor-images.md` §7)

- [ ] 887 accounted; every drop explained; 137 `post: 0` present
- [ ] 8 featured-outside-gallery resolve a real `heroImage` (Madison ≠ 727 without looking)
- [ ] Descriptive alt on all 887; no filename-as-alt
- [ ] Hero-capability restated from measured originals; change from 34/58 explained
- [ ] Four all-square + unusable-at-full-bleed have a measured basis for DESIGN §8
- [ ] `scripts/build-image-manifest.mjs` re-verifies 1,763 / 791 / 388 / 137
- [ ] Grep clean for `[object Object]`, `undefined`, `null`, DESIGN §9 kill-list
- [ ] `git status` shows no binaries, no `wp-content/`, no client PNGs, no deck PDFs
