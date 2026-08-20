# Handoff — Claude Code reviews both lanes

**Date:** 2026-08-20
**From:** Cursor (local, after merge + partners wiring)
**To:** Claude Code — **review only**. Do not rebuild. Do not start Phase F. Do not push.
**Tree:** local `main` @ `2b0a0de` (`Fill the partners wall names from the verified TSV.`).
`origin/main` is `f83c3e0` — this laptop is **9 commits ahead**. Repo `scherzo-io/sl` is still **public**.
**Supersedes:** the “Claude Code handback” in [`sessions/2026-08-20-cursor-03.md`](sessions/2026-08-20-cursor-03.md). That file assumed two tips and an empty wall. Both are stale.

Paste this file as the first message if you want a cold start. Then read; don’t invent a third plan.

---

## 0. What you are doing

Alexey wants a **work-order review** of everything Grok and Cursor claimed to finish:

| Lane | Work order | What they were supposed to do |
|---|---|---|
| Grok | [`grok-build.md`](grok-build.md) | Phases A–E, G, H. **F skipped** (Sanity + Eric). |
| Cursor | [`cursor-images.md`](cursor-images.md) + bar-B [`cursor-plan.md`](cursor-plan.md) | Measure / manifest / checksums / hero / partners / brand / link-check / deck corrections / video ask / review Grok. **Not** 887 alt-text, unused-library dump, client-PNG dedupe, Sanity ingest. |

Your job is the same shape as Cursor’s Track C ([`reviews/README.md`](reviews/README.md)): try to refute each work-order gate, report what survives. **Report; don’t patch** unless Alexey assigns a fix and says who owns it.

Write the review to [`reviews/claude-2026-08-20.md`](reviews/claude-2026-08-20.md) (create it). Then a session log + `STATUS.md` update. Commit those three. Do not push.

---

## 1. Do not

- Start **Phase F**, create a Sanity project, write `scripts/import-*`, or invent alt text.
- Run the **887-image alt-text** pass.
- **Push** to origin (public client repo).
- Edit **`PLAN.md` §1** rows. Propose a new row in the review if a number is wrong.
- Merge `main` into `cursor/images` or the reverse again.
- Open, OCR, screenshot, or quote the decks’ **REFERENCES** pages (commercial p41, residential p42–43). Architect direct phones/emails never enter the repo.
- Put July 10 **revenue / spend / staffing / ownership** anywhere, including the review.
- Commit `wp-content/`, project photographs, video binaries, or the deck PDFs.
- Treat `content/images/partners/reference/*.png` as publishable artwork (PLAN §1 row 31).
- “Fix” casing on partner names or drop **Kanter**.
- Wire `image-manifest.tsv` into `lib/projects.ts` / `next/image` unless Alexey asks (that is Phase F / a later assign).
- Swap the sidebar wordmark for `content/images/brand/*.png` unless Alexey asks.

---

## 2. Read this first (in order)

1. `PLAN.md` §1 — wins over everything, including the work orders.
2. `CLAUDE.md` — gates, role mapping, hard prohibitions.
3. `DESIGN.md` §9 kill-list, §2 tokens.
4. `COWORK.md` §1 and §5.
5. This file.
6. [`STATUS.md`](STATUS.md) — if it disagrees with the repo, the repo wins.
7. The two work orders, then [`cursor-plan.md`](cursor-plan.md) (what Cursor **skipped on purpose**).
8. Grok handoffs, cheapest first: [`handoffs/grok-2026-08-20-h.md`](handoffs/grok-2026-08-20-h.md) (gate table), [`-e`](handoffs/grok-2026-08-20-e.md), [`-g`](handoffs/grok-2026-08-20-g.md), then A–D if time.
9. Cursor’s existing review: [`reviews/grok-2026-08-20.md`](reviews/grok-2026-08-20.md). Re-run; don’t rubber-stamp. Several of its “not on this tree” notes are now false (artifacts are on `main`).
10. `inputs/derived/EXTRACT-REPORT.md` before you trust a remembered number.

---

## 3. What is actually on this tree

One tip. Grok’s app and Cursor’s artifacts both live on `main` @ `2b0a0de`.

| Commit | What |
|---|---|
| `6da8b6e` | `--no-ff` merge `cursor/images` → `main` (parents `f83c3e0` + `799e790`). Artifacts on the build tree. `partners.json` still `[]` at that commit. |
| `2b0a0de` | 30 `firm_name`s copied into `content/copy/partners.json`. `artwork: []`. `/partners` = type + empty tiles. |

`cursor/images` still exists locally and is behind this merge for the files it owned. Do not treat it as the review tree.

### Grok landed (do not redo)

| Phase | Work order | On disk |
|---|---|---|
| A | Eric email draft | `content/eric-email.md` — **not sent** |
| B | Scaffold, tokens, patterns A/B/C, `/studio` stub | `app/**`, `components/**`, `lib/**` |
| C | Schema + TypeGen, not deployed | `sanity/**`, `schema.json`, `sanity.types.ts` |
| D | 10 pages, 8 testimonials (Mercer unpublished), scrubbed bios, PT 58/58 | `content/copy/**`, `content/pages/**` |
| E | Directions A/B/C, lightbox, empty photo slots | `app/commercial/[slug]`, `app/residential/[slug]`, `components/review/**` |
| F | Migration | **Not started.** Honest skip. |
| G | 37 301 / 11 SKIP never redirected / 25 REVIEW 404 / 2×410, metadata, JSON-LD, consent (IDs null) | `middleware.ts`, `lib/redirects.ts`, `content/copy/redirects.json` |
| H | Gate table | `handoffs/grok-2026-08-20-h.md` |

### Cursor landed (do not redo)

| Work-order § | On disk |
|---|---|
| 4.1–4.3, 4.8 (measure, not ingest) | `scripts/build-image-manifest.mjs`, `content/images/image-manifest.tsv` (887), `content/findings/hero-measure-finding.md` (**35/58**, PLAN said 34) |
| 5.5 | `content/images/checksums-887.tsv` (887) |
| 5.1 (ship-strings only) | `content/deck-corrections.tsv` |
| 5.2 | `content/images/partners/names.tsv` (30) + `reference/` ID crops + `NOT-FOR-PUBLICATION.txt` |
| 5.3 | `content/images/brand/` sample `#DE2426` + interim rasters (sidebar still type, not the PNG) |
| 5.4 | `content/link-check/2026-08-20.tsv` |
| 5.6 | `content/video-inventory.tsv` + `content/images/video-ask.md` — two WhatsApp reels **outside** the repo, **end logos on** |
| 6 | `workorders/reviews/grok-2026-08-20.md` |
| §0 | `workorders/cursor-plan.md` committed before Wave 1 |

**Wired after merge:** `content/copy/partners.json` `names` length 30, `artwork` `[]`. `PartnersWall` already knew what to do. `content/copy/flags.json` still lists `"partner names"` under `emptyUntilCursor` — that line is now stale; flag it, don’t silently rewrite unless assigned.

---

## 4. Review Grok against `grok-build.md`

Walk §4 phases and §6 “Done looks like”. One row per gate in your review file.

| Gate (work order) | Cursor already said | What you should still do |
|---|---|---|
| A — email covers the 12 asks; no REFERENCES phones; no July 10 commercial figures | confirmed it exists, A-21 cited | Re-read against `grok-build.md` §4 A items 1–12. Video bullet may be stale (files arrived; end logos still on). |
| B — tokens exact; no retired reds in **built** CSS; BenchNine sentence case; Lato ≥16px | tokens confirmed **after** `npm run build` | Re-run `npm run build` then `npm run check:tokens`. Grep DESIGN retired hexes in CSS output. |
| C — 13 types; `roles[]` six atoms; `architect` nullable; TypeGen current; no `any` cheat | not deeply reviewed | Diff `sanity/` vs PLAN §8 / work order §4 C. Schema deploy must still be absent. |
| D — 10 pages; six services; Mercer unpublished; Di Oronzo spelling; wall empty **then** | Mercer / Di Oronzo confirmed on `/clients` | Wall is **no longer empty**. Confirm 30 names, zero artwork paths, no `reference/` in rendered HTML. **`deck-corrections.tsv` landed after D** — Grok never applied it. Check whether ship-strings in `content/copy/` still need those corrections. |
| E — three directions; variants switchable; video variants declared-empty; lightbox | **not reproduced** (no screenshots; Playwright-in-sandbox claim) | **This is the gap.** 390 / 768 / 1440, keyboard lightbox (Esc, arrows, focus trap), `prefers-reduced-motion`. You can watch a screen. Cursor did not. |
| F — skipped | confirmed honest | Confirm still no ingest scripts / no Sanity project id in committed env. Do not start it. |
| G — 37/11/25/2; SKIP never 301; WP 564/558 live preserved; JSON-LD; consent | confirmed **locally**; production SKIP ≠ local (see Cursor review) | Re-run `npm run redirects:build` + `check:redirects --offline`. Compare to `content/link-check/2026-08-20.tsv` (production). Do not flood the live site. |
| H — honest skips | confirmed most runnable gates; `build` was skipped by Grok, run by Cursor | Re-run the command block in §6 below. |

**Work-order hard-rule defect already on record:** Grok committed/pushed to `main` (`grok-build.md` §5: branch `grok/build` only). Cursor contradicted the “did not push” claim. Alexey’s call whether `main` is now the build branch. Do not revert it in this review.

**Sanity “Done looks like” boxes** (58/10/2/2 **in Sanity**, roles in CMS, etc.) are **not failable yet** — F never ran. Score them as skipped-with-reason, same as H. Score the **data layer** (`content-inventory.tsv`, `lib/`, assembled JSON) separately.

---

## 5. Review Cursor against `cursor-images.md` + `cursor-plan.md`

Bar B is the contract. Anything in the work order that bar B deferred is a **skip**, not a miss — unless they claimed it.

### Track A

| § | Expected | Status to verify |
|---|---|---|
| 4.1–4.2 | 887 measured originals; prefer hidden full-size; never Imagify `.webp` | `wc -l` manifest + checksums = 888 (header+887). README source rule. Spot-check `has_larger_original` rows. |
| 4.3 | Hero restated; 8 featured-outside-gallery have a real source row | Finding says **35/58** (PLAN 34). Manifest `hero_capable`. Confirm the 8 named projects have a chosen file. **Do not change `lib/projects.ts`.** |
| 4.4 | 887 alt-text | **Deferred on purpose** (`cursor-plan.md` Out). `alt-text.tsv` must be absent. |
| 4.5–4.7 | unused library, median_w, 10 client PNGs | **Deferred (bar B).** Absence is correct. |
| 4.8 | upload set + ingest script | Manifest only. Ingest script is Grok F. Must not exist as a fake run. |

### Track B

| § | Expected | Status to verify |
|---|---|---|
| 5.1 | Corrections for **ship** strings; transcripts not rewritten; REFERENCES pages not opened | `deck-corrections.tsv` exists. Partners README says testimonials **not** visually verified (p41 / R p42–43 skipped — correct). Residential case-study OCR mostly untouched. |
| 5.2 | Names read off p42; ID crops; no traces | 30 names; `reference/NOT-FOR-PUBLICATION.txt`; crops must not appear in `PartnersWall`. |
| 5.3 | Reproducible red sample; interim rasters; no traced vector | `sampling-report.md` / `.json`; `#DE2426` vs token `#DA2128`. Rasters unused in the shell — correct until assigned. |
| 5.4 | Dated live HEAD of 73 + 58 + 10 pages + litter + WP 564/558 | `content/link-check/2026-08-20.tsv` + README (measured-from-live, sequential). Confirm 11 SKIP are 200 **on production** in that file. |
| 5.5 | sha256 of 887 | `checksums-887.tsv`. |
| 5.6 | Ask recorded; inventory if files exist; binaries out of git | Inventory 2 rows; `.gitignore` has `*.mp4` `*.mov` `*.webm` `*.m4v`. `git check-ignore` a WhatsApp path if still at repo root. Questions still open: hosting, mapping, no-logo cuts. |

### Track C

Cursor reviewed Grok A/E/G/H on `main` @ `129136e` **before** the merge. Re-verify anything that the merge or `2b0a0de` could have changed (especially `/partners` and `STATUS.md`). Viewport / physical lightbox / reduced-motion is still **yours** — they skipped it.

### `cursor-images.md` §10 Done looks like

Mark each checkbox confirmed / skipped-on-purpose / failed:

- [ ] `cursor-plan.md` before execute
- [ ] 887 accounted; 137 `post: 0` present
- [ ] 8 featured-outside-gallery resolve a source
- [ ] descriptive alt on every image — **skip (bar B)**
- [ ] hero restated (35/58 + finding)
- [ ] four square + unusable-at-full-bleed have measured basis
- [ ] `build-image-manifest.mjs` regenerates (needs dump; don’t commit `--uploads` dirt)
- [ ] ship-strings verified; corrections filed
- [ ] partner names + reference crops; artwork an ask
- [ ] Alexey asked for video; answer recorded
- [ ] `#DA2128` reproducible from the logo master
- [ ] 73 live statuses; 11 SKIP = 200
- [ ] checksums
- [ ] kill-list / `[object Object]` clean on Cursor-owned text
- [ ] STATUS + session logs

---

## 6. Commands (reproduce, don’t accept)

From `~/sl` on `main`:

```bash
git status --short          # expect clean except maybe ?? docs/superpowers/ (the merge plan; not required)
git log --oneline -12
python3 scripts/wxr-extract.py          # must print: assertions failed: 0
# if you use --uploads, afterwards: git checkout -- inputs/derived
npm run typecheck
npm run check:copy
npm run redirects:build
npm run check:redirects -- --offline
npm run build
npm run check:tokens        # only after build; fails with no .next
```

Counts:

```bash
python3 - <<'PY'
from pathlib import Path
import json
for rel, n in [
    ("content/images/image-manifest.tsv", 887),
    ("content/images/checksums-887.tsv", 887),
    ("content/images/partners/names.tsv", 30),
]:
    rows = [ln for ln in Path(rel).read_text().splitlines()[1:] if ln.strip()]
    assert len(rows) == n, (rel, len(rows))
p = json.loads(Path("content/copy/partners.json").read_text())
assert len(p["names"]) == 30 and p["artwork"] == []
print("counts ok")
PY
```

Local HTTP (after `npm run build && npm run start` on :8080 — don’t fight a bound port):

- `/partners` contains `B·C·D Consulting` and `BANG³`, **30** `w-tile`, **no** `partners/reference/`
- `/sample-page/` and `/1248-2/` → 410
- `/residential/5th-avenue-townhouse/` → 301 `/residential/12th-st-townhouse-greenwich-village` (no extra slash)
- SKIP example: `/commercial/mackage-soho` 200 locally; wrong-category path must **not** 301 a live slug away
- WP 564/558: `upper-east-side-townhouse` and `autrium-corporate-office` still 200 locally (Eric has not confirmed the fixes)
- `/clients?t=quotes`: Antonio Di Oronzo present; Mercer absent
- JSON-LD on `/`: LocalBusiness + GeneralContractor, 483 10th Ave Ste 205, no `telephone` if phones are still pending
- Consent banner; no `gtag` / `fbevents` until IDs exist

Do **not** re-flood `streamlineusa.com`. The production snapshot is already `content/link-check/2026-08-20.tsv`.

Optional, dump present, do not commit the result:

```bash
node scripts/build-image-manifest.mjs --uploads wp-content/uploads
# expect hero_capable_projects: 35, missing_source: 0
git checkout -- content/images/   # only if the script rewrote bytes you didn’t mean to keep
```

---

## 7. Known issues (do not rediscover as if new)

1. **Grok pushed to `main`.** Work order forbids it. Already on origin @ `129136e` / later `f83c3e0`. Local now `2b0a0de`.
2. **Hero 35/58 vs PLAN 34.** Finding filed. Proposed §1 row; not applied. `lib/projects.ts` still on the old audit dims.
3. **Viewport / lightbox / reduced-motion** never reproduced on a real device. Highest-value remaining Grok check.
4. **`deck-corrections.tsv` not applied** to assembled copy (timing: D before the merge).
5. **Brand rasters unused.** Sidebar is still the word “Streamline”.
6. **Photo slots empty.** Correct until F.
7. **Partner artwork empty.** Correct (row 31). Names live as of `2b0a0de`.
8. **Videos:** two files, end logos on, hosting/mapping unset. Video homepage variants stay declared-empty.
9. **25 REVIEW** redirect rows: honest 404. List in `content/findings/legacy-review-rows.md`.
10. **Eric email not sent.** `content/eric-email.md`.
11. **Production vs local SKIP behaviour** differs (Cursor review). Local seed is the build; live TSV is production truth.
12. **`flags.json` `emptyUntilCursor`** still mentions partner names after they landed.

Proposed PLAN rows already sitting in handoffs/reviews (do not apply):

- Cursor: hero-capable **35/58**
- Grok: remote is public (supersede “private”); `__trashed` 410 vs REVIEW 404; Edge seed `redirects.json` until F

---

## 8. What “done” is for *this* review

A file at `workorders/reviews/claude-2026-08-20.md` that:

- Scores **Grok** against `grok-build.md` §4 and §6 (every phase, including honest F skip).
- Scores **Cursor** against `cursor-images.md` §4–§6 and §10, using `cursor-plan.md` bar B as the skip list.
- Uses verdicts **confirmed / not reproduced / contradicted / skipped-on-purpose**, each with a command.
- Has **Invented content** and **Sensitivity** sections (diff + commit messages).
- Lists **Not in the handoffs** (silent gaps).
- **Proposed, not applied** — no quiet PLAN edits.

Then: `workorders/sessions/2026-08-20-claude-01.md` (or next free `NN`), `STATUS.md` Last updated / Next up. Local commit. No push.

Alexey still owns: send the Eric email; flip the remote private; video hosting; 25 REVIEW targets; whether `main` stays the build branch.
