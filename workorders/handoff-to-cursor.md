# Handoff — Cursor (`cursor/images`) from Grok (`grok/build`)

**Date:** 2026-08-20 (rewritten after Grok Phases A–E, G, H)
**From:** Grok, executing [`grok-build.md`](grok-build.md)
**To:** Cursor, locally in `~/sl` on `cursor/images` per [`cursor-images.md`](cursor-images.md)
**Kickoff to paste:** [`cursor-kickoff.md`](cursor-kickoff.md)

Image-set output paths are still only those in `cursor-images.md` §7. Do not invent siblings.

Grok's build is on **`grok/build` and local `main` at `d9d2276`**. **`origin/main` is still `347aea5`.** The remote is public — do not push until Alexey flips it private. Get this tree onto the laptop with the bundle, or wait for a private push. Do not review against `origin/main`.

---

## Grok has already landed (do not redo)

| Phase | Commit | What |
|---|---|---|
| A | `ac74339` | `content/eric-email.md` — drafted, not sent |
| B | `0cc9d21` | Next.js App Router, tokens, patterns A/B/C, `/studio` stub |
| C | `e85b935` | Sanity schema + TypeGen. Not deployed. No project id |
| D | `ec3c325` | 10 pages, 8 testimonials (Mercer unpublished), scrubbed bios, PT 58/58 |
| E | `1709f00` | Directions A/B/C switchable. Lightbox. Empty photo slots. Public URLs unchanged |
| F | — | **Not started.** Blocked on Eric + Sanity project + **your image manifest** |
| G | `a36fccf` | 37×301, 11 SKIP never redirected, 25 REVIEW 404, 2×410, metadata, JSON-LD, sitemap/robots, consent banner (IDs null) |
| H | `1c85bb9` | Gate table. Honest skips. `npm run build` not run (dev was serving) |

Phase handoffs to review, in this order once `grok/build` is on the machine:

1. [`handoffs/grok-2026-08-20-e.md`](handoffs/grok-2026-08-20-e.md) — the site Eric will look at
2. [`handoffs/grok-2026-08-20-g.md`](handoffs/grok-2026-08-20-g.md) — redirects / SEO
3. [`handoffs/grok-2026-08-20-h.md`](handoffs/grok-2026-08-20-h.md) — the gate table
4. A–D if you still have time: `grok-2026-08-20.md`, `-b`, `-c`, `-d`

Reviews land in `workorders/reviews/`. Report; do not patch `app/**`.

---

## Constraints (yours — Grok will not relax them)

- **Never commit `wp-content/` or any image binary.** ~12 GB vs GitHub’s 100 MB cap.
- **Never filter on attachment parent.** 137 of 880 gallery images are `post: 0`.
  Filter is always `project_gallery ∪ _thumbnail_id` = **887**.
- **Never upscale, AI-enhance, retouch, or generate imagery.**
- Do not hand-edit `inputs/derived/**` or `content/image-audit.tsv`.
- Do not write `scripts/import-*` (Grok Phase F). Skip “asset ingest” in your §5 — it overlaps.
- Local commits only; **do not push** (repo is currently public).
- First fifteen minutes: `python3 scripts/wxr-extract.py --uploads wp-content/uploads`
  must print `assertions failed: 0`. If not, stop. Then `git checkout -- inputs/derived` so
  the `--uploads` dirt does not get committed.
- **§0 of your work order is still in force.** Brainstorm, commit `workorders/cursor-plan.md`,
  *then* execute. A session that starts measuring 887 files before the plan exists has already
  failed the protocol.

---

## What Grok needs from you (cheapest first)

Paths are fixed. Do not invent `heroes.tsv` / `unreferenced.tsv` siblings. Surprises go in
`content/findings/<topic>-finding.md`.

### 0. Day-one ask — video files

`cursor-images.md` §5.6. Dump has zero video. Two homepage variants stay empty until files
land. Ask Alexey in the first session, record the answer either way in `STATUS.md`.

### 1. Partner **names** off commercial deck p42

Artwork is unusable (PLAN §1 row 31 / `content/findings/deck-raster-finding.md`). Read the
names off the page. Land them at `content/images/partners/` with a verified-name manifest.
Grok's `/partners` wall is **zero slots** until that file exists (`content/copy/partners.json`
`names: []`). Do not publish OCR. Do not trace marks. Skip commercial p41 / residential
p42–43 (REFERENCES block).

**Unblocks:** logo wall in directions B/C.

### 2. Live HEAD of the 73 — `content/link-check/<date>.tsv`

Sequential, delayed. Production, not a flood. Especially the **11 SKIP rows still 200** as
their own live project. Also `/sample-page/`, `/1248-2/`, WP 564
(`/commercial/upper-east-side-townhouse/` live, `/commercial/washington-sq-dermatology/`
history), WP 558 (`/commercial/autrium-corporate-office/` live typo).

Grok G implemented 37 301s / 11 never / 25 404 / 2 410 **locally**. It did not hit
production (SiteGround captcha 202). Your sweep is the missing half of PLAN §9.

**Unblocks:** cutover confidence, not F.

### 3. On-screen / keyboard review of E, G, H

You are the only lane that can watch it. `npm run build` is yours — Grok skipped it because
dev was on 8080. Physical keyboard, real contrast, `prefers-reduced-motion` on an OS setting.
One row per claim in `workorders/reviews/`.

### 4. Logo master raster set — `content/images/brand/`

Sample `#DA2128` so PLAN §1 row 11 is reproducible. Interim rasters (trimmed, transparent,
retina, light-on-dark for sidebar). **Do not trace a vector.**

### 5. Manifest + measured originals — `content/images/image-manifest.tsv`

**887 rows.** Attachment ID, project, served path, chosen source path, **measured original
dimensions**, aspect, orientation, hero-capable, notes.

`scripts/build-image-manifest.mjs` — Node, no network, no credentials; uploads path as an
argument. Re-verify **1,763 / 791 / 388 / 137 / 887**. Prefer hidden originals (strip
`-scaled` / `-WxH`). Never imagify `.webp`. For the 388 with `has_larger_original = yes`,
WP metadata is the *served* copy — measure off disk.

`content/images/README.md` — how to regenerate, what a reviewer checks.

**Blocks Grok Phase F** (and truthful `next/image` widths). A–E and G already shipped with
empty photo slots on purpose.

### 6. Alt text — `content/images/alt-text.tsv`

**887 to write, not 885.** The two existing values do not survive: Boqueria featured =
`Boqueria`; Kat & Theo featured = `Screen Shot 2016-03-02 at 1.48.15 PM`.

Pattern: `<Project name> — <room/space>, <notable feature>`. Write what is in the frame.
Do not infer rooms, materials, or description claims the frame does not show. Ambiguous →
flag the row. Grok will copy these strings and will not write alt.

### 7. Eight featured-outside-gallery → a real `heroImage`

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

### 8. Prove the 137 `post: 0` survived

All 137 must be in the 887-row manifest (not 750). README states the filter in one sentence.
Do not put them in a separate file.

### 9. Square + unusable-at-full-bleed — measured input, not the design decision

Four projects are entirely served 2048×2048, no larger original: `lantern-house` (16),
`795-5th-ave-the-pierre` (16), `652-hudson-st` (21), `40-e66th-st` (19). Measure so
“truly square” is a disk fact. DESIGN §8 treatments are **Grok’s per direction**. Without
crop maps, Grok will not center-crop.

Also measure the named unusables: 12th St Townhouse (all 12 at 640×295), E63rd St Penthouse,
Lexington Ave Townhouse, West 23rd, Horatio, Free People & Spring Studios featured.
Restate hero-capability from measured pixels in the README (PLAN expects quality change,
not count: 34/58 today). If the count moves, write a finding + proposed PLAN §1 row.

### 10. 876 unreferenced library images — finding only

Out of migration scope. Characterise per-project candidates vs plugin/theme junk in
`content/findings/<topic>-finding.md`. **Do not add them to the manifest.** Expanding 887
needs a PLAN §1 row that supersedes row 18.

### 11. Ten client PNGs outside the library — finding only

`~/Downloads/Zipcodes/Streamline USA/Images_Streamline/*.png` (~52 MB, 2048×2048).
Duplicates, better originals, or never-published? Text finding. **Binaries stay out of git.**

### 12. Four `median_w` disagreements — confirm

`image-audit.tsv` vs export: `kat-theo`, `free-people-retail-store`,
`hudson-street-penthouse`, `madison-ave-duplex-2`. If convention, one README paragraph.
If real, a finding and a *proposed* inventory row — do not rewrite Alexey’s file.

### 13. Deck-OCR string verification — `content/deck-corrections.tsv`

Read the page. Do not re-OCR. Proof points, six services, bios, five named testimonials
(Antonio Di Oronzo spelling), residential case studies. Do not rewrite the transcripts.

### 14. Dump checksums — `content/images/checksums-887.tsv`

sha256 of the 887 so a second copy of the dump is verifiable.

---

## Mount points on Grok's side (so you know where your files go)

| Your file | Grok consumes it at |
|---|---|
| `content/images/image-manifest.tsv` | Phase F `_sanityAsset` source paths; `next/image` widths |
| `content/images/alt-text.tsv` | Phase F alt; E a11y |
| `content/images/partners/` names | `content/copy/partners.json` → `PartnersWall` |
| `content/images/brand/` | sidebar wordmark, once you land rasters |
| `content/link-check/<date>.tsv` | G already shipped local 301/410; this is production truth |
| `content/deck-corrections.tsv` | copy fixes; `decks` testimonial variant |
| `content/video-inventory.tsv` | homepage video variants (currently declared-empty) |

`components/media/ProjectImageSlot.tsx` is the empty photo slot. `HeroSlot` already
pillarboxes `SQUARE_SLUGS` in direction A. Do not edit those files.

---

## Not yours — do not pick these up

| Item | Owner | Why not Cursor |
|---|---|---|
| Partner logo **artwork** (publishable marks) | **Alexey / Eric** | Decks are flattened rasters. Names are yours; marks are not |
| Vector wordmark | **Eric** | Only `inputs/raw/brand/streamline-logo.png`. Do not trace |
| Sanity project + write token | **Alexey** | Needed to *run* ingest, not to measure |
| 21 conflict rows, taxonomy, 8 pipeline, phones, Procore, RFP, WP 564/558 | **Eric** | `content/eric-email.md` |
| 25 REVIEW redirect targets | **Alexey** | `content/findings/legacy-review-rows.md` |
| Writing `app/**` / schema / copy | **Grok** | Your reviews report; they do not patch |

---

## Done looks like (`cursor-images.md` §10)

- [ ] `workorders/cursor-plan.md` committed **before** execution began
- [ ] Alexey asked for videos; answer recorded either way
- [ ] 887 accounted; every drop explained; 137 `post: 0` present
- [ ] 8 featured-outside-gallery resolve a real `heroImage` (Madison ≠ 727 without looking)
- [ ] Descriptive alt on all 887; no filename-as-alt
- [ ] Hero-capability restated from measured originals; change from 34/58 explained
- [ ] Four all-square + unusable-at-full-bleed have a measured basis for DESIGN §8
- [ ] `scripts/build-image-manifest.mjs` re-verifies 1,763 / 791 / 388 / 137
- [ ] Partner names read off p42, not OCR
- [ ] 73 legacy URLs dated live status; 11 SKIP confirmed 200
- [ ] `#DA2128` is a reproducible measurement
- [ ] Grep clean for `[object Object]`, `undefined`, `null`, DESIGN §9 kill-list
- [ ] `git status` shows no binaries, no `wp-content/`, no client PNGs, no deck PDFs
- [ ] Reviews of E, G, H in `workorders/reviews/`
