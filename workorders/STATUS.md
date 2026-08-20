# STATUS — where this build actually is

**One file to read when you come back to this after a break.** Updated at the end of every
work chunk by whoever did the work. If this file disagrees with your memory, trust this file;
if it disagrees with the repo, trust the repo and fix this file.

Last updated: **2026-08-20** · by: Grok (session 05) · next action: **Cursor reviews Phase E on a real screen; Alexey reviews/sends `content/eric-email.md`; do not start F until Eric + Sanity project + images**

---

## Lanes

| Lane | Work order | State | Branch | Last landed |
|---|---|---|---|---|
| **Cursor** — everything local | [`cursor-images.md`](cursor-images.md) | **not started.** Work order broadened 2026-08-20 to cover all local-only work + reviewing Grok's handoff | `cursor/images` | — |
| **Grok** — the build | [`grok-build.md`](grok-build.md) | **Phase E directions landed** 2026-08-20. F blocked | `grok/build` | A/B/C fully built, switchable, lightbox, empty photo slots |

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
| 2026-08-20 | **Grok Phase A.** Eric email drafted. Branch not pushed (remote public) | `content/eric-email.md`, `workorders/handoffs/grok-2026-08-20.md` |
| 2026-08-20 | **Grok Phase B.** Next.js App Router scaffold, locked tokens, patterns A/B/C, studio stub | `app/**`, `components/**`, `lib/**`, `package.json` |
| 2026-08-20 | **Grok Phase C.** Sanity schema + TypeGen. No schema deploy | `sanity/**`, `schema.json`, `sanity.types.ts` |
| 2026-08-20 | **Grok Phase D.** 10 pages assembled; 8 testimonials; scrubbed bios; PT converter 58/58 | `content/copy/**`, `content/pages/**` |
| 2026-08-20 | **Grok Phase E.** Three directions fully built, switchable variants, lightbox, empty photo slots | `app/commercial/[slug]`, `app/residential/[slug]`, `components/review/**`, `components/media/ProjectView.tsx` |

## In flight

| Lane | Phase | Started | Notes |
|---|---|---|---|
| Grok | E — three directions | 2026-08-20 | **landed this session.** Photography still empty slots |
| Grok | F — migration | blocked | Needs Eric answers + Sanity project + Cursor image manifest |

## Next up

1. **Cursor:** `workorders/cursor-plan.md` then execute. Review Grok handoffs A–E on a real screen and keyboard (`workorders/handoffs/grok-2026-08-20-e.md`). Partner-name manifest unblocks the logo wall.
2. **Alexey:** review and send `content/eric-email.md`. Flip the GitHub remote private if `grok/build` should be pushed. Video files (row 32). Sanity project when Studio should mount.
3. **Grok (this lane, after the blocks lift):** Phase F migration. Do not start it against invented values.

## Blocked, and on whom

Full table with detail: [`README.md`](README.md) §5. Summary:

| Blocked on | Items |
|---|---|
| **Eric** | 21 conflict rows · subCategory taxonomy · content for the 8 pipeline projects · vector logo · WP 564 and WP 558 slug confirms · which phones are publishable · Procore keep/drop · Mercer testimonial · RFP addresses · references approach · one site or two |
| **Alexey** | **the video files — Cursor is asking, and nothing video-shaped can be built or mocked until they land** · Sanity project + write token · push rights for `grok/build` · publishable partner logo artwork (the decks can only supply names — `content/findings/deck-raster-finding.md`) · second copy of the dump off this laptop |

## PLAN §11 step tracker

| Step | State | Lane |
|---|---|---|
| 1 · documents, hygiene, conflicts, inventory | ✅ done | — |
| 2 · extract 58 projects, image audit, REST verification | ✅ done | — |
| 3 · Eric's conflict email | 🟡 drafted, not sent | Grok |
| 4 · image manifest, raw snapshot, re-verify totals | 🟡 snapshot + extracts done; manifest open | Cursor |
| 5 · deck transcription | ✅ raw OCR both decks · 🟡 string verification against page images open | Cursor |
| 6 · scaffold | ✅ Phase B landed 2026-08-20 | Grok |
| 7 · page copy, logo wall, testimonials | 🟡 copy assembled; logo wall waiting on Cursor names | Grok + Cursor |
| 8 · Directions A, B, C + variants | ✅ Phase E landed 2026-08-20 | Grok |
| 9 · Eric picks a direction | 🟡 unblocked on 8; waiting on Eric looking at the three | — |
| 10 · migration into `staging` | 🔒 blocked on 3 + Sanity project + Cursor images | Grok |
| 11 · SEO / redirect layer | ⬜ open — bigger than PLAN §9 knew (`legacy-slugs-finding.md`) | Grok + Cursor (link-check) |
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
