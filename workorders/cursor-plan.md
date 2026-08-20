# Cursor plan — local lane, session 06 (bar C)

Living plan for the Cursor lane. Rewritten 2026-08-20 before execution of the
alt / photography / video session. Supersedes the bar B plan in this file
(Wave 1 measure / link-check / decks). Do not create a third plan file.

**Goal:** Produce `content/images/alt-text.tsv` in reviewable project batches plus two
findings (photography vs DESIGN §8; video at 390/1440 and the 45% tint), without
restyling or inventing content.

**Architecture:** The build already joins `project-images.tsv` + `image-manifest.tsv` +
optional `alt-text.tsv` in `lib/photos.ts`. This session writes data and findings only.
`heroFor()`, `HeroSlot`, `HomeVideo` tint, and `lib/projects.ts` heroCapable stay
untouched. A finding that wants a code change becomes a proposed PLAN §1 row in the
session log.

**Tech Stack:** Next.js on port 8080, `next/image` via `public/photos` symlink, staged
reels in `public/videos`, `npm run check:alt`. No new npm packages. No ffmpeg re-encode.

**Branch:** `cursor/images` fast-forwarded to `main` @ `789e06f` (Task 1). Do not commit
on `main`. Do not push.

---

## Global Constraints

- PLAN.md §1 outranks this plan. Do not edit §1 rows. Propose new rows in the session log only.
- Do not push. Remote is public. Local commits only.
- Do not commit binaries, `wp-content/`, `public/photos`, `public/videos/`, deck PDFs, or any screenshot PNG.
- Do not delete `public/photos` or `public/videos/`.
- Do not re-run `node scripts/build-image-manifest.mjs --uploads` and commit the result.
- Do not open commercial deck p41 or residential p42–43 (REFERENCES).
- Do not invent alt to make `check:alt` green. The gate is allowed to stay red.
- Do not restyle `HeroSlot`, `PortfolioWall`, or the `bg-black/45` tint. Look, write, propose.
- Do not salvage the reels (no upscale, crop, re-encode, title-hiding).
- Do not edit `app/**`, `sanity/**`, `content/copy/**`, `lib/**`, `components/**` unless Alexey assigns it.
- Do not hand-edit `inputs/derived/**` or `content/image-audit.tsv`.
- Kill port 8080 before every `npm run start`.
- Images are lazy: never assert `complete` in a background tab. Assert HTML `alt=` / optimizer URLs.
- **C-1 rule:** every claim joins two sources (a committed TSV or script dump **and** a rendered page).
- Batch alt from `content/images/image-manifest.tsv` rows for that slug, not the inventory `images` column.
- Project name in alt = `content/content-inventory.tsv` title after entity unescape. Do not pretty-print titles.

---

## Brainstorm — what this session does instead of bar B

Bar B listed the 887-image alt pass as **Out**. That bar is finished (review §2a). This
file is rewritten in place. No `docs/superpowers/plans/2026-08-20-*.md` and no third plan.

Handoff order is alt → photography → video. After the green-gate verify the server is
already hot, so **findings next, then alt.** Alt for the finding-set projects is written
in the same look-pass.

887 honest descriptions is not one sitting. **This session completes the findings and a
first-wave alt set. The rest is an explicit skip with a queue.**

`lib/projects.ts:67` still reads `hero_capable` from `image-audit.tsv` (34), not the
measured 35. That is C-2. Flag it. Do not patch Grok-owned code.

Parallel alt seats are rejected. One voice, one quality bar.

---

## File map

- Update: `workorders/cursor-plan.md` — this file (commit before any other work)
- Create: `content/images/alt-text.tsv` — `attachment_id`, `project_slug`, `alt`, `confidence`, `flag`
- Create: `content/findings/photography-render-finding.md`
- Modify: `content/findings/homepage-video-finding.md` — Cursor addendum only
- Create (only if needed): `content/findings/median-w-finding.md`
- Create: `workorders/sessions/2026-08-20-cursor-06.md`
- Modify: `workorders/STATUS.md`

---

### Task 1: Green-gate verify

Done 2026-08-20 on `cursor/images` @ `789e06f`.

- [x] FF `cursor/images` onto `main` (`799e790..789e06f`)
- [x] `npm run photos:link` — probe OK
- [x] `npm run videos:prepare` — 2 reels, END LOGO PRESENT, does not loop cleanly
- [x] `python3 scripts/wxr-extract.py` — assertions failed: 0
- [x] typecheck + check:copy clean
- [x] redirects: `301=111 (legacy=37 cross=58 review=16) skipSlugs=10 reviewUnresolved=0 gone=2 live=58`
- [x] `check-retired-hex: ok (1 css files, 0 retired hexes)`
- [x] `check-alt: 0/887` — TSV not present yet
- [x] `qa-render: all checks passed` — 8080 left up

---

### Task 2: Rewrite this living plan and commit it

- [x] This file rewritten as bar C
- [x] Commit only this file (next step)

---

### Task 3: Photography render finding — look, do not restyle

Create `content/findings/photography-render-finding.md`. Join manifest row + rendered URL.
No CSS changes. DESIGN §8 options: center-crop · pillarboxed duotone · split-pair ·
Pattern C vertical. Only pillarbox (A) and cover-crop (B/C) are built.

- [ ] Dump algorithmic `heroFor` for the 17 named slugs (score: heroCapable +4e6, landscape +2e6, featured +1e6, width)
- [ ] Four squares at 1440 × A/B/C: `lantern-house`, `795-5th-ave-the-pierre`, `652-hudson-st`, `40-e66th-st`
- [ ] Unusable-at-full-bleed at 1440 × A: `12th-st-townhouse-greenwich-village`, `e63-st-penthouse`, `lexington-ave-townhouse`, `west-23rd-townhouse-2`, `horatio-st-townhouse`, plus `free-people-retail-store`, `spring-studios-spring-place`
- [ ] Human vs `heroFor` on the 17. Propose overrides in the session log; do not add a column
- [ ] Ragged wall at 1440 on `/commercial-projects/?d=a` and `/residential-projects/?d=a`
- [ ] Write finding (What’s there · Measured evidence · The catch · Decision / rule · Reproducing)
- [ ] Commit

---

### Task 4: Video variants at 390 and 1440 — judge, do not salvage

Add `## Cursor addendum — 390 / 1440 / tint` to `homepage-video-finding.md`.
Do not weaken “ship no video on this footage.” Do not edit `bg-black/45`.

- [ ] Confirm `public/videos/reel-1.jpg` / `reel-2.jpg` (ffmpeg `-ss 4`)
- [ ] Watch `video-loop`, `video-tint`, `video-scroll` at 1440 `?d=a`
- [ ] Same three at 390
- [ ] Write addendum and commit

---

### Task 5: Four `median_w` rows and the 35-vs-34 trap

Slugs: `kat-theo`, `free-people-retail-store`, `hudson-street-penthouse`, `madison-ave-duplex-2`.
Finding file only if not an even-set convention. Restate C-2. Do not patch `lib/projects.ts`.

- [ ] Compute audit vs served vs measured medians
- [ ] Session-log note, or `median-w-finding.md` if real

---

### Task 6–7: Alt-text first wave

Output `content/images/alt-text.tsv`:

```
attachment_id	project_slug	alt	confidence	flag
```

`confidence`: `high` | `medium` | `low`
`flag`: empty, or `ambiguous` | `people` | `text-in-frame` | `no-space-visible`
Pattern: `<Inventory title> — <room/space>, <notable feature>`

Describe the frame. Do not infer a room you cannot see. Do not name materials you are
guessing. Do not copy the project description onto a photo that does not show it.

Titles (inventory, unescaped):

| slug | title |
|---|---|
| mackage-soho | Mackage SoHo |
| boqueria-restaurant | Boqueria Restaurant |
| kat-theo | Kat & Theo |
| lantern-house | Lantern House |
| 795-5th-ave-the-pierre | 795 5th ave The Pierre |
| 652-hudson-st | 652 Hudson st |
| 40-e66th-st | 40 e66th st |
| 12th-st-townhouse-greenwich-village | 12th st townhouse |
| e63-st-penthouse | e63rd st Penthouse |
| lexington-ave-townhouse | Lexington Ave Townhouse |
| west-23rd-townhouse-2 | West 23rd St. Townhouse |
| horatio-st-townhouse | Horatio St. Townhouse |
| free-people-retail-store | Free People Retail Store |
| spring-studios-spring-place | Spring Studios, Spring Place |

Batch order (one project, one commit; remaining → Skipped):

1. `mackage-soho` (11) — calibration; rebuild and join hero `alt=` to the TSV
2. `boqueria-restaurant` (9)
3. `kat-theo` (10)
4. Squares: `lantern-house` (16), `795-5th-ave-the-pierre` (16), `652-hudson-st` (21), `40-e66th-st` (19)
5. Unusable / weak: `12th-st-townhouse-greenwich-village` (12), `e63-st-penthouse` (5), `lexington-ave-townhouse` (13), `west-23rd-townhouse-2` (10), `horatio-st-townhouse` (16), `free-people-retail-store` (7), `spring-studios-spring-place` (12)

Counts from the manifest, not inventory.

---

### Task 8: Stop protocol

- [x] `workorders/sessions/2026-08-20-cursor-06.md` from the template
- [x] `STATUS.md` Last updated / In flight / Next up — 404 and trailing slash are **done**
- [x] Commit; `git status` clean of keepers; kill 8080

---

## What this plan is deliberately not doing

- The other 44 live projects’ alt after the first wave (unless time remains)
- 876 unreferenced + `uploads/backup/` characterisation
- Ten PNGs in `Images_Streamline/`
- Builder kill-list re-hit of production
- Phase F / Sanity / `_sanityAsset`
- Implementing `heroOverride`, changing `bg-black/45`, restyling squares
- Pushing; committing to `main`; editing PLAN §1
