# STATUS — where this build actually is

**One file to read when you come back to this after a break.** Updated at the end of every
work chunk by whoever did the work. If this file disagrees with your memory, trust this file;
if it disagrees with the repo, trust the repo and fix this file.

Last updated: **2026-08-20** · by: Cursor (merge commit 1) · next action: **optional second
commit: copy 30 `firm_name`s into `content/copy/partners.json`. Do not start Phase F.
Do not push unless Alexey asks.**

---

## Lanes

| Lane | Work order | State | Branch | Last landed |
|---|---|---|---|---|
| **Cursor** — everything local | [`cursor-images.md`](cursor-images.md) | **Wave 1 + videos + Grok review, now on `main`.** Alt-text / Sanity deferred | `cursor/images` merged into `main` | 887 manifest, link-check, 30 names TSV |
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
| 2026-08-20 | **Merge `cursor/images` → `main` (commit 1).** Artifacts on the build tree. `partners.json` names still `[]`. Site behavior unchanged | this merge |

## In flight

| Lane | Phase | Started | Notes |
|---|---|---|---|
| Grok | F — migration | blocked | Eric + Sanity project. Manifest is now on this tree; that does **not** unblock F |
| Cursor | idle after merge commit 1 | 2026-08-20 | Names TSV is on disk; wall not wired until commit 2 |

## Next up

1. **This plan, Task 5–6:** second commit — copy 30 `firm_name`s into `content/copy/partners.json`. Leave `artwork: []`.
2. **Alexey:** send [`content/eric-email.md`](../content/eric-email.md). Video hosting / mapping / no-logo cuts. 25 REVIEW targets in `content/findings/legacy-review-rows.md`.
3. **Later:** Phase F (Sanity) only after Eric answers + a Sanity project. 887 alt-text is Cursor, later.
4. **Do not push** this merge unless Alexey asks. Remote is still public.

## Blocked, and on whom

Full table with detail: [`README.md`](README.md) §5. Summary:

| Blocked on | Items |
|---|---|
| **Eric** | 21 conflict rows · subCategory taxonomy · content for the 8 pipeline projects · vector logo · WP 564 and WP 558 slug confirms · which phones are publishable · Procore keep/drop · Mercer testimonial · RFP addresses · references approach · one site or two |
| **Alexey** | **videos arrived (2 WhatsApp reels) but still have end logos — hosting, mapping, trim/masters open** · Sanity project + write token · publishable partner logo artwork (names only — PLAN §1 row 31) · second copy of the dump off this laptop · **25 REVIEW redirect targets** · analytics IDs |

## PLAN §11 step tracker

| Step | State | Lane |
|---|---|---|
| 1 · documents, hygiene, conflicts, inventory | ✅ done | — |
| 2 · extract 58 projects, image audit, REST verification | ✅ done | — |
| 3 · Eric's conflict email | 🟡 drafted, not sent | Grok |
| 4 · image manifest, raw snapshot, re-verify totals | ✅ manifest + checksums + 887/388/137 re-verified; hero 35/58 (finding, not a code change) | Cursor |
| 5 · deck transcription | ✅ raw OCR · 🟡 ship-strings corrected (`deck-corrections.tsv`); testimonials not visually verified (REFERENCES pages skipped) | Cursor |
| 6 · scaffold | ✅ Phase B landed 2026-08-20 | Grok |
| 7 · page copy, logo wall, testimonials | 🟡 copy assembled; **30 names on tree in `content/images/partners/names.tsv`**; `partners.json` still `[]` until commit 2; publishable marks still an ask | Grok + Cursor |
| 8 · Directions A, B, C + variants | ✅ Phase E landed 2026-08-20 | Grok |
| 9 · Eric picks a direction | 🟡 unblocked on 8; waiting on Eric looking at the three | — |
| 10 · migration into `staging` | 🔒 blocked on 3 + Sanity project + ingest scripts | Grok |
| 11 · SEO / redirect layer | ✅ Grok G (37 301 / 11 SKIP / 25 REVIEW / 2 410). ✅ Cursor live HEAD in `content/link-check/2026-08-20.tsv` | Grok + Cursor |
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
