# STATUS — where this build actually is

**One file to read when you come back to this after a break.** Updated at the end of every
work chunk by whoever did the work. If this file disagrees with your memory, trust this file;
if it disagrees with the repo, trust the repo and fix this file.

Last updated: **2026-08-20** · by: Cursor (session 02) · next action: **Claude Code —
see `workorders/sessions/2026-08-20-cursor-02.md` handback. Grok still has no handoff.**

---

## Lanes

| Lane | Work order | State | Branch | Last landed |
|---|---|---|---|---|
| **Cursor** — everything local | [`cursor-images.md`](cursor-images.md) | **bar B done.** Wave 1 + video inventory + empty-handoff review. Alt-text / Sanity deferred | `cursor/images` | `31af6e9` |
| **Grok** — the build | [`grok-build.md`](grok-build.md) | **started 2026-08-20**, phase A — **not in this repo or on GitHub** | `grok/build` (absent) | — |

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
| 2026-08-20 | Two work orders + this status protocol | `workorders/**` |
| 2026-08-20 | Cursor Wave 1: measured 887 originals, checksums, live link-check, deck corrections, 30 partner names, logo sample `#DE2426` | `content/images/**`, `content/link-check/`, `content/deck-corrections.tsv`, `scripts/build-image-manifest.mjs` |
| 2026-08-20 | Two WhatsApp reels inventoried (end logos present); binaries moved out of repo | `content/video-inventory.tsv` |
| 2026-08-20 | Cursor review of Grok: no handoff to check | `workorders/reviews/grok-2026-08-20.md` |

## In flight

| Lane | Phase | Started | Notes |
|---|---|---|---|
| Grok | A — Eric's conflict email (`content/eric-email.md`) | 2026-08-20 | file and `grok/build` still absent locally and on `scherzo-io/sl` |
| Cursor | done this pass | 2026-08-20 | handback in `sessions/2026-08-20-cursor-02.md` |

## Next up

1. **Claude Code:** leftover list in [`sessions/2026-08-20-cursor-02.md`](sessions/2026-08-20-cursor-02.md) — Grok handoff when it exists; do not start Sanity or alt-text.
2. **Grok:** land Phase A (`content/eric-email.md` + `workorders/handoffs/grok-<date>.md`) on `grok/build`.
3. **Alexey:** video hosting / mapping / no-logo cuts — files are at `~/Downloads/Zipcodes/Streamline USA/videos/`. See [`content/images/video-ask.md`](../content/images/video-ask.md).
4. **Alexey:** send Eric's email once the draft exists; Sanity project later.
5. **Cursor, later:** 887 alt-text.

## Blocked, and on whom

Full table with detail: [`README.md`](README.md) §5. Summary:

| Blocked on | Items |
|---|---|
| **Eric** | 21 conflict rows · subCategory taxonomy · content for the 8 pipeline projects · vector logo · video files + hosting · WP 564 and WP 558 slug confirms · which phones are publishable · Procore keep/drop · Mercer testimonial · RFP addresses · references approach · one site or two |
| **Alexey** | **videos arrived (2 WhatsApp reels) but still have end logos — hosting, mapping, trim/masters open** · Sanity project + write token · push rights for `grok/build` · publishable partner logo artwork · second copy of the dump off this laptop |

## PLAN §11 step tracker

| Step | State | Lane |
|---|---|---|
| 1 · documents, hygiene, conflicts, inventory | ✅ done | — |
| 2 · extract 58 projects, image audit, REST verification | ✅ done | — |
| 3 · Eric's conflict email | 🟡 drafting | Grok |
| 4 · image manifest, raw snapshot, re-verify totals | ✅ manifest + checksums + 887/388/137 re-verified; hero 35/58 | Cursor |
| 5 · deck transcription | ✅ raw OCR · 🟡 ship-strings corrected (`deck-corrections.tsv`); testimonials not visually verified (REFERENCES pages skipped) | Cursor |
| 6 · scaffold | ⬜ open | Grok |
| 7 · page copy, logo wall, testimonials | 🟡 copy extracted; assembly open; **partner names verified (30)**; publishable marks still an ask | Grok + Cursor |
| 8 · Directions A, B, C + variants | ⬜ open | Grok |
| 9 · Eric picks a direction | 🔒 blocked on 8 | — |
| 10 · migration into `staging` | 🔒 blocked on 3 + Sanity project | Grok |
| 11 · SEO / redirect layer | 🟡 live snapshot in `content/link-check/2026-08-20.tsv`; Grok still wires redirects | Grok + Cursor (link-check done) |
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
