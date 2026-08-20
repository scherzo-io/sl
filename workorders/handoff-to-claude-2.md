# Handoff — Claude Code reviews Cursor session 06

**Date:** 2026-08-20
**From:** Cursor (local, after session 06 + FF merge onto `main`)
**To:** Claude Code — **review only**. Do not restyle. Do not invent alt. Do not start Phase F. Do not push.
**Tree:** local `main` after a fast-forward of `cursor/images` (session 06 + STATUS tighten). Repo `scherzo-io/sl` is still **public**.
**Supersedes:** [`handoff-to-claude.md`](handoff-to-claude.md) (the both-lanes review — **done**, see [`reviews/claude-2026-08-20.md`](reviews/claude-2026-08-20.md)).

Paste [`claude-kickoff.md`](claude-kickoff.md) as the first message if you want a cold start. Then read this file; don’t invent a third plan.

---

## 0. What you are doing

Cursor session 06 looked at real frames and wrote three findings plus the start of `content/images/alt-text.tsv`. Alexey then stopped the remaining alt pass. Your job is the same shape as [`reviews/README.md`](reviews/README.md): try to refute each claim, report what survives.

| What Cursor claimed | Where |
|---|---|
| Photography vs DESIGN §8 (squares, unusable set, `heroFor()` 14/17, ragged wall) | [`content/findings/photography-render-finding.md`](../content/findings/photography-render-finding.md) |
| Video at 390 / 1440, 45% tint, `-ss 4` poster is a title card | [`content/findings/homepage-video-finding.md`](../content/findings/homepage-video-finding.md) addendum |
| Four `median_w` rows = even-set high + featured-only extras; C-2 restated | [`content/findings/median-w-finding.md`](../content/findings/median-w-finding.md) |
| Alt **83/887**, **6/58** projects, looked-at rows only | `content/images/alt-text.tsv` + `npm run check:alt` |
| Session state | [`sessions/2026-08-20-cursor-06.md`](sessions/2026-08-20-cursor-06.md) |

Write the review to [`reviews/claude-2026-08-20-session-06.md`](reviews/claude-2026-08-20-session-06.md) (create it). Then a session log + `STATUS.md` update. Commit those. Do not push.

---

## 1. Do not

- Invent alt to turn `check:alt` green. The gate is allowed to stay red. Alt remaining is Cursor’s, resume at `40-e66th-st` when Alexey says so.
- Restyle `HeroSlot`, `PortfolioWall`, or `bg-black/45`. Findings propose; they do not change CSS.
- Add a `heroOverride` column or patch `lib/projects.ts` (C-2 / 35-vs-34). Proposed, not applied.
- Change `scripts/prepare-videos.mjs` `-ss 4`. Poster timestamp is a proposal if posters ever ship.
- Start **Phase F**, create a Sanity project, or write ingest scripts.
- **Push.** Remote is public.
- Edit **`PLAN.md` §1** rows. Propose in the review.
- Open the decks’ **REFERENCES** pages (commercial p41, residential p42–43).
- Put July 10 revenue / spend / staffing / ownership anywhere.
- Commit `wp-content/`, photographs, videos, deck PDFs, or screenshot PNGs.
- Re-run `build-image-manifest.mjs --uploads` and commit the result.
- Re-open the 404 blocker or the trailing-slash call (PLAN rows 33–37 — done).
- Continue the first-wave alt unless Alexey assigns it in this sitting.

---

## 2. Read this first (in order)

1. `PLAN.md` §1 — wins.
2. `CLAUDE.md`, `DESIGN.md` §8–§9, `COWORK.md` §1 and §5.
3. [`STATUS.md`](STATUS.md), then this file, then [`claude-kickoff.md`](claude-kickoff.md).
4. [`sessions/2026-08-20-cursor-06.md`](sessions/2026-08-20-cursor-06.md) — what Cursor says it did.
5. The three findings above.
6. [`cursor-plan.md`](cursor-plan.md) bar C (the session plan that was executed).
7. [`reviews/claude-2026-08-20.md`](reviews/claude-2026-08-20.md) § C-1 and C-2 — the join rule and the 35-vs-34 trap. Do not rediscover those as new.

---

## 3. What is actually on this tree

`cursor/images` was fast-forwarded onto `main`. One tip. Do not treat the lane branch as a second source of truth after the merge.

| Area | On disk |
|---|---|
| Living plan | `workorders/cursor-plan.md` (bar C) |
| Photography finding | `content/findings/photography-render-finding.md` |
| Video addendum | `content/findings/homepage-video-finding.md` |
| median_w | `content/findings/median-w-finding.md` |
| Alt TSV | `content/images/alt-text.tsv` — 83 rows, 6 slugs |
| Session log | `workorders/sessions/2026-08-20-cursor-06.md` |

Completed alt slugs (manifest counts): `mackage-soho` 11, `boqueria-restaurant` 9, `kat-theo` 10, `lantern-house` 16, `795-5th-ave-the-pierre` 16, `652-hudson-st` 21.

**Proposed, not applied** (session log only — do not implement):

- Spring hero **1902** instead of 1189; Free People **1022** if the landing must be landscape; Kith is a judgment.
- Poster `-ss` later than 4 only if posters ship.
- C-2: adopt measured 35/58 inside Phase F.
- Leave `bg-black/45`.

---

## 4. Review against C-1

Every claim joins **a committed TSV or script dump** and **a rendered page**. Scoring from one file is how Phase G was marked confirmed while 32 URLs 404’d.

Walk these. One row per claim in the review.

### Photography

- The four squares are 2048×2048; Direction A pillarboxes; B/C `object-cover`. Lantern House and 652 Hudson lose the wide subject under cover-crop. Pierre and 40 E 66th survive.
- Unusable at 1440, slot 1240×900: 12th St 640×295; e63 640×392; Lexington 599×399. West 23rd / Horatio 990×740 are short, not the same class.
- `heroFor()` 14/17. Confirm the three named misses (Spring 1189 vs 1902, Free People 1017 vs 1022, Kith 1152) against `lib/photos.ts` + the manifest, then look at the rendered hero.
- Wall tiles at 1440 are 332px wide, native hero aspect (Spring 332×85; squares 332×332).

### Video

- Tint class is still `bg-black/45`. Computed overlay is `oklab(0 0 0 / 0.45)`.
- Poster `-ss 4` is a title card on both reels. Confirm from the staged `public/videos/*.jpg` if present (git-ignored).
- Rule unchanged: ship no video on this footage. Confirm Claude’s existing conclusion was not rewritten away.

### median_w / C-2

- Four slugs: even-set **high** of the two middles, plus Free People / Hudson **n** disagree (featured-outside-gallery).
- `lib/projects.ts` still reads audit `hero_capable` (34). Do not patch.

### Alt TSV

- `npm run check:alt` is **83/887** — **6/58**. If it is not, stop and report.
- Schema: `attachment_id`, `project_slug`, `alt`, `confidence`, `flag`. Pattern `<inventory title> — <room/space>, <notable feature>`. Titles unescaped from `content/content-inventory.tsv` (`Kat &#038; Theo` → `Kat & Theo`).
- Spot-check: each completed slug’s row count equals the **manifest** count, not the inventory `images` column.
- Join one hero: rebuild, kill 8080, `npm run start`, foreground `/commercial/mackage-soho/`. Hero `alt=` matches the TSV row for that attachment (1951), not empty. Lazy images lie in a background tab — assert markup.
- Boqueria 850 and Kat & Theo 1012 should carry `flag=people` if diners/cooks are in those frames.
- Do not rewrite looked-at rows to chase tone.

---

## 5. Commands (reproduce, don’t accept)

From `~/sl` on `main`:

```bash
git status --short
git log --oneline -15
python3 scripts/wxr-extract.py          # assertions failed: 0
npm run typecheck && npm run check:copy
npm run redirects:build && npm run check:redirects -- --offline
npm run check:alt                       # expect 83/887 — 6/58
```

To join a finding to a page (kill 8080 first, every time):

```bash
lsof -ti:8080 | xargs kill 2>/dev/null
npm run photos:link
npm run videos:prepare                  # optional; needed only for the video addendum
npm run build && npm run start
```

Then 1440×900, tab in the foreground:

- `/residential/lantern-house/?d=a` vs `?d=b` vs `?d=c`
- `/commercial-projects/?d=a` (Spring tile aspect)
- `/?home=video-tint&d=a` and `/?home=video-loop&d=a` at 1440 and 390

Do **not** re-flood `streamlineusa.com`.

---

## 6. Known issues (do not rediscover as if new)

1. Remote is **public**. Do not push.
2. Hero 35/58 vs PLAN 34 / audit 34 — C-2. Finding filed. `lib/projects.ts` unchanged.
3. 404 blocker and trailing slash are **done** (rows 33–37).
4. Both reels carry burned-in titles + a logo bug. Nothing ships on this footage.
5. Partner artwork empty (row 31). Names live.
6. Phase F blocked on Eric + a Sanity project.
7. Alt remaining: first-wave from `40-e66th-st` (19), then the other 44 live projects. Cursor’s.

---

## 7. What “done” is for this review

A file at `workorders/reviews/claude-2026-08-20-session-06.md` that:

- Scores each photography / video / median_w / alt claim **confirmed / not reproduced / contradicted**, each with a command.
- Uses **C-1** (TSV or dump **and** a rendered page).
- Has **Invented content** (especially the 83 alt rows — invented descriptions would be DESIGN §9).
- Has **Proposed, not applied** — no quiet PLAN edits, no quiet `lib/` patches.

Then: `workorders/sessions/2026-08-20-claude-NN.md` (next free `NN`), `STATUS.md` Last updated / In flight / Next up. Local commit. No push.

Alexey still owns: flip the remote private; send the Eric email; video **masters**; Phase F / Sanity; whether remaining alt resumes at `40-e66th-st`.
