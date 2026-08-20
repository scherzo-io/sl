# STATUS — where this build actually is

**One file to read when you come back to this after a break.** Updated at the end of every
work chunk by whoever did the work. If this file disagrees with your memory, trust this file;
if it disagrees with the repo, trust the repo and fix this file.

Last updated: **2026-08-20** · by: Claude Code (fix session — blocker closed, photography live) · next action: **Cursor —
paste [`handoff-to-cursor-2.md`](handoff-to-cursor-2.md) and start the 887 alt-text pass. The
redirect blocker is fixed and photography renders; alt text is the last large piece of work.**

---

## Lanes

| Lane | Work order | State | Branch | Last landed |
|---|---|---|---|---|
| **Cursor** — everything local | [`cursor-images.md`](cursor-images.md) | **Wave 1 + videos + review on `main`; `/partners` names live, artwork empty.** Alt-text / Sanity deferred | `cursor/images` merged into `main` | 887 manifest, link-check, 30 names on wall |
| **Grok** — the build | [`grok-build.md`](grok-build.md) | **A–E, G, H on `main`.** F skipped | `main` | A–E, G, H. F not started |

Both lanes maintain their own rows here. If a lane is mid-run when its work order changes,
the change is additive and called out in that file's changelog — read it again at your next
phase boundary rather than assuming what you read at the start still holds.

## Done and committed

| When | What | Where |
|---|---|---|
| 2026-08-19 | Planning session: site audit, reference capture, image audit, originals finding. Merge output lost — the failure that produced COWORK.md | `silverlining-reference-spec.md`, `content/image-audit.tsv`, `content/originals-finding.md` |
| 2026-08-20 | Adversarial review + rebuild of the whole document set; conflict table; content inventory; both deck transcripts | `PLAN.md`, `DESIGN.md`, `CLAUDE.md`, `COWORK.md`, `content/**` |
| 2026-08-20 | The two 19 Aug drafts archived, redacted | `docs/archive/` |
| 2026-08-20 | **Source ingest.** The 2026-08-20 WXR export committed with text extracts; 3 extractors; 17 assertions passing; 2 findings; PLAN §1 rows 23–29 | `inputs/**`, `scripts/**`, `content/findings/**` |
| 2026-08-20 | Two work orders + this status protocol; Cursor lane broadened; deck-raster finding; video ask | `workorders/**`, `content/findings/deck-raster-finding.md` |
| 2026-08-20 | **Grok Phase A.** Eric email drafted | `content/eric-email.md`, `workorders/handoffs/grok-2026-08-20.md` |
| 2026-08-20 | **Grok Phase B.** Next.js App Router scaffold, locked tokens, patterns A/B/C, studio stub | `app/**`, `components/**`, `lib/**`, `package.json` |
| 2026-08-20 | **Grok Phase C.** Sanity schema + TypeGen. No schema deploy | `sanity/**`, `schema.json`, `sanity.types.ts` |
| 2026-08-20 | **Grok Phase D.** 10 pages assembled; 8 testimonials; scrubbed bios; PT converter 58/58 | `content/copy/**`, `content/pages/**` |
| 2026-08-20 | **Grok Phase E.** Three directions fully built, switchable variants, lightbox, empty photo slots | `app/commercial/[slug]`, `app/residential/[slug]`, `components/review/**`, `components/media/ProjectView.tsx` |
| 2026-08-20 | **Grok Phase G.** 37 301s, 11 SKIP never redirected, 25 REVIEW 404, 2×410, metadata, JSON-LD, sitemap/robots, consent banner (IDs null) | `middleware.ts`, `lib/redirects.ts`, `lib/seo.ts`, `content/copy/redirects.json`, `content/findings/legacy-review-rows.md` |
| 2026-08-20 | **Grok Phase H.** Gate table. F still blocked | `workorders/handoffs/grok-2026-08-20-h.md` |
| 2026-08-20 | **Pushed** `main` and `grok/build` to origin at `129136e` (later note `f83c3e0`). Repo still **public** | https://github.com/scherzo-io/sl |
| 2026-08-20 | Cursor Wave 1: measured 887 originals, checksums, live link-check, deck corrections, 30 partner names, logo sample `#DE2426` | `content/images/**`, `content/link-check/`, `content/deck-corrections.tsv`, `scripts/build-image-manifest.mjs` |
| 2026-08-20 | Two WhatsApp reels inventoried (end logos present); binaries kept out of git | `content/video-inventory.tsv` |
| 2026-08-20 | Cursor review of Grok A/E/G/H (local build + HTTP) | `workorders/reviews/grok-2026-08-20.md` |
| 2026-08-20 | **Merge `cursor/images` → `main` (commit 1).** Artifacts on the build tree. Site behavior unchanged at that commit | this merge |
| 2026-08-20 | **`partners.json` names filled from TSV (commit 2).** 30 names, `artwork: []`. `/partners` shows type + empty tiles | `content/copy/partners.json` |
| 2026-08-20 | **Claude Code fix session.** All 73 legacy URLs resolve (111 redirect rules: 37 legacy + 58 cross-category + 16 measured REVIEW targets); 887 photographs render through `next/image` off a git-ignored symlink; trailing slash restored per row 3; alt-text gate added | `content/redirect-decisions.tsv`, `lib/photos.ts`, `scripts/link-photos.mjs`, `scripts/check-alt.mjs`, `scripts/qa-render.mjs`, `next.config.mjs`, `middleware.ts` |
| 2026-08-20 | **Claude Code review of both lanes.** Every runnable gate re-run; Phase E reproduced in a browser; the 404 regression found by joining Cursor's production link-check to Grok's redirect table | `workorders/reviews/claude-2026-08-20.md` |

## In flight

| Lane | Phase | Started | Notes |
|---|---|---|---|
| Grok | F — migration | blocked | Eric + Sanity project. Manifest is now on this tree; that does **not** unblock F |
| Cursor | idle | 2026-08-20 | Names on the wall; artwork empty |
| — | review of both lanes | done 2026-08-20 | [`reviews/claude-2026-08-20.md`](reviews/claude-2026-08-20.md). Phase E reproduced on a real browser and **passes**; Phase G **contradicted**. 1 blocker, 6 defects, 3 nits. Nothing patched |
| — | fix session | done 2026-08-20 | 404 blocker closed (all 73 legacy URLs → 200, production's exact targets, one hop); photography wired and rendering; trailing slash restored; PROGORE, flags.json and the unrunnable QA scripts fixed. PLAN §1 rows 33–39 |
| Cursor | 887 alt-text pass | next | [`handoff-to-cursor-2.md`](handoff-to-cursor-2.md) §3.1. Gate: `npm run check:alt`, 0/887 today |
| — | branch audit | done 2026-08-20 | review §9. All six refs are ancestors of `main`; **nothing stranded**. `origin/workorders/lane-scope-and-status` is merged and deletable; `origin/cursor/images` and `origin/grok/build` are behind `main` — fast-forward before resuming either lane |

## Next up

1. **Alexey — the redirect decision (blocker for cutover).** Review §1b of
   [`reviews/claude-2026-08-20.md`](reviews/claude-2026-08-20.md). All 73 legacy URLs resolve on
   production today; **32 of them 404 on the new build** (25 REVIEW rows + 7 cross-category SKIP
   paths). The targets are not unknown — production supplies all 25, and `_wp_old_slug` in the
   committed WXR reproduces the mapping offline. Assign the fix and the owner.
2. **Alexey — the trailing-slash call.** The build drops it; PLAN §1 row 3 says "exactly". Either
   `trailingSlash: true` or a superseding row.
3. **Alexey:** flip `scherzo-io/sl` **private** — everything reviewed here is already pushed to a
   public remote. Send [`content/eric-email.md`](../content/eric-email.md). Video **masters**, not
   the WhatsApp reels (1024×576, audio, end logos, one watermarked frame — unusable for the
   variants). Then hosting + per-variant mapping.
4. **Whoever is assigned:** the four one-liners — `PROGORE` → `Procore` in
   `content/copy/proof-points.json`; two stale `flags.json` `emptyUntilCursor` entries; and either
   add `playwright` or delete `scripts/qa-*.mjs`, which cannot run as committed.
5. **Later:** Phase F (Sanity) only after Eric answers + a Sanity project. 887 alt-text is Cursor,
   later. `lib/projects.ts` should adopt hero 35/58 inside F.

## Blocked, and on whom

Full table with detail: [`README.md`](README.md) §5. Summary:

| Blocked on | Items |
|---|---|
| **Eric** | 21 conflict rows · subCategory taxonomy · content for the 8 pipeline projects · vector logo · WP 564 and WP 558 slug confirms · which phones are publishable · Procore keep/drop · Mercer testimonial · RFP addresses · references approach · one site or two |
| **Alexey** | **flip `scherzo-io/sl` private — everything is already on a public remote** · **videos: the 2 reels are 1024×576 with audio and end logos, so masters are needed, not trims — hosting and mapping still open** · Sanity project + write token · publishable partner logo artwork (names only — PLAN §1 row 31) · second copy of the dump off this laptop · **25 REVIEW redirect targets** · analytics IDs |

## PLAN §11 step tracker

| Step | State | Lane |
|---|---|---|
| 1 · documents, hygiene, conflicts, inventory | ✅ done | — |
| 2 · extract 58 projects, image audit, REST verification | ✅ done | — |
| 3 · Eric's conflict email | 🟡 drafted, not sent | Grok |
| 4 · image manifest, raw snapshot, re-verify totals | ✅ manifest + checksums + 887/388/137 re-verified; hero 35/58 (finding, not a code change) | Cursor |
| 5 · deck transcription | ✅ raw OCR · 🟡 ship-strings corrected (`deck-corrections.tsv`); testimonials not visually verified (REFERENCES pages skipped) | Cursor |
| 6 · scaffold | ✅ Phase B landed 2026-08-20 | Grok |
| 7 · page copy, logo wall, testimonials | 🟡 copy assembled; 30 names on the wall; artwork still an ask (decks cannot supply it) | Grok + Cursor |
| 7b · photography | ✅ **887 frames render** — measured originals via `next/image`, heroes scored, ragged wall, nothing committed. 🟡 **alt text 0/887** | Claude + Cursor |
| 8 · Directions A, B, C + variants | ✅ Phase E landed 2026-08-20 | Grok |
| 9 · Eric picks a direction | 🟡 unblocked on 8; waiting on Eric looking at the three | — |
| 10 · migration into `staging` | 🔒 blocked on 3 + Sanity project + ingest scripts | Grok |
| 11 · SEO / redirect layer | ✅ **fixed.** All 73 legacy URLs terminate at 200 on the exact target production uses, 69 of them in one hop. 111 rules (37 legacy + 58 cross-category + 16 measured REVIEW). Trailing slash canonical again. Metadata, JSON-LD, sitemap, robots, consent confirmed | Grok + Cursor + Claude |
| 12 · staging sign-off, cutover | 🔒 blocked | — |

## How to resume

```bash
cd ~/sl && git log --oneline -8        # what landed recently
cat workorders/STATUS.md               # this file
ls workorders/sessions/                # what each session actually did
python3 scripts/wxr-extract.py         # must print: assertions failed: 0
git status --short                     # must be clean
```

Then read the newest file in `workorders/sessions/`, which ends with its own "next step".

## The rule that keeps this file honest

Every agent, every session, before it stops: commit its work, add a session log under
`workorders/sessions/`, and update this file's **Last updated**, **In flight** and **Next up**.
A session that ends without those three things has lost its state — which has already happened
once on this project (COWORK.md §0).
