# Claude Code kickoff — paste this as your first message

**Supersedes the job in `handoff-to-claude.md`**, which is done (`reviews/claude-2026-08-20.md`).
This sitting reviews **Cursor session 06** only.

---

You are **Claude Code**, reviewing the local tree in `~/sl` on `main`. Cursor session 06
looked at real photographs and video, wrote three findings, and started `alt-text.tsv`
(83/887, then Alexey stopped the rest). You report what survives. You do not rebuild the
design, invent alt, start Phase F, or push.

**Read in this order, then stop and think before you execute:**

1. `workorders/handoff-to-claude-2.md` — the job list and the don’ts.
2. `workorders/STATUS.md` — if it disagrees with the repo, the repo wins.
3. `workorders/sessions/2026-08-20-cursor-06.md` — what Cursor says landed.
4. `PLAN.md` §1 — wins over everything, including the handoff.
5. `CLAUDE.md`, `DESIGN.md` §8–§9, `COWORK.md` §1 and §5.
6. `workorders/reviews/claude-2026-08-20.md` — C-1 (join two sources) and C-2 (35-vs-34).
   Do not rediscover those.

**Then:** review. Write `workorders/reviews/claude-2026-08-20-session-06.md`. Session log +
`STATUS.md`. Commit. Do not push.

## Get the tree running

```bash
cd ~/sl && git log --oneline -8
git status --short
python3 scripts/wxr-extract.py           # assertions failed: 0
npm run typecheck && npm run check:copy
npm run redirects:build && npm run check:redirects -- --offline
npm run check:alt                        # expect 83/887 — 6/58 projects complete
```

If `check:alt` is not **83/887**, stop and report — something moved under you.

To join a finding to a rendered page (kill 8080 first, every time):

```bash
lsof -ti:8080 | xargs kill 2>/dev/null
npm run photos:link
npm run videos:prepare                   # only if you are scoring the video addendum
npm run build && npm run start
```

Foreground the tab. Lazy images lie when `document.hidden` is true.

## What you're doing

Score Cursor’s session 06 claims. One row per claim: confirmed / not reproduced / contradicted,
plus the command. C-1: every claim joins a committed TSV or dump **and** a rendered page.

1. **Photography finding** — four squares at 1440, unusable-at-full-bleed set, `heroFor()` 14/17,
   ragged wall (332px tiles). Do not restyle.
2. **Video addendum** — 390 and 1440, `bg-black/45`, poster `-ss 4` is a title card. Do not
   salvage footage. Ship-no-video still holds.
3. **median_w finding** — even-set high + featured-only extras. Restate C-2. Do not patch
   `lib/projects.ts`.
4. **Alt TSV** — 83 looked-at rows, 6 complete slugs, manifest counts not inventory counts.
   Join Mackage hero `alt=` (attachment 1951) to the TSV after a rebuild. Do not write new alt
   unless Alexey assigns it.

Details and the don’t-list: `workorders/handoff-to-claude-2.md`.

## Don't

- **Don't push.** The remote is public.
- Don't invent alt. Don't continue the first-wave unless assigned.
- Don't restyle, don't add `heroOverride`, don't change `bg-black/45`, don't edit PLAN §1.
- Don't start Phase F / Sanity ingest.
- Don't commit binaries, `wp-content/`, or screenshots.
- Don't re-open the 404 blocker or the trailing-slash call (rows 33–37).

## Before you stop

Commit the review, `workorders/sessions/2026-08-20-claude-NN.md` (next free `NN`), and
`STATUS.md` — Last updated, In flight, Next up. Say what you skipped. Next step is one sentence.
