# STATUS — where this build actually is

**One file to read when you come back to this after a break.** Updated at the end of every
work chunk by whoever did the work. If this file disagrees with your memory, trust this file;
if it disagrees with the repo, trust the repo and fix this file.

Last updated: **2026-08-20** · by: Claude (cowork session 3) · next action: **Cursor brainstorms
`workorders/cursor-images.md` and commits `workorders/cursor-plan.md` before executing**

---

## Lanes

| Lane | Work order | State | Branch | Last landed |
|---|---|---|---|---|
| **Cursor** — everything local | [`cursor-images.md`](cursor-images.md) | **not started.** Work order broadened 2026-08-20 to cover all local-only work + reviewing Grok's handoff | `cursor/images` | — |
| **Grok** — the build | [`grok-build.md`](grok-build.md) | **started 2026-08-20**, phase A | `grok/build` | — |

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

## In flight

| Lane | Phase | Started | Notes |
|---|---|---|---|
| Grok | A — Eric's conflict email (`content/eric-email.md`) | 2026-08-20 | unblocks PLAN §11 step 10; everything downstream of migration waits on Eric's answers |

## Next up

1. **Cursor:** brainstorm the work order → commit `workorders/cursor-plan.md` → execute. The
   image set is the critical path for everything visual; the 887-image alt-text pass is the
   single largest job in the build.
2. **Grok:** phases B–H (scaffold → schema → content → three directions → migration → SEO).
3. **Cursor:** review Grok's handoff when it lands (`cursor-images.md` §C).
4. **Alexey:** send Eric's email once Grok's draft is reviewed; create the Sanity project when
   scaffolding starts.

## Blocked, and on whom

Full table with detail: [`README.md`](README.md) §5. Summary:

| Blocked on | Items |
|---|---|
| **Eric** | 21 conflict rows · subCategory taxonomy · content for the 8 pipeline projects · vector logo · video files + hosting · WP 564 and WP 558 slug confirms · which phones are publishable · Procore keep/drop · Mercer testimonial · RFP addresses · references approach · one site or two |
| **Alexey** | Sanity project + write token · push rights for `grok/build` · partner logo marks are extractable locally (now a Cursor task) · second copy of the dump off this laptop |

## PLAN §11 step tracker

| Step | State | Lane |
|---|---|---|
| 1 · documents, hygiene, conflicts, inventory | ✅ done | — |
| 2 · extract 58 projects, image audit, REST verification | ✅ done | — |
| 3 · Eric's conflict email | 🟡 drafting | Grok |
| 4 · image manifest, raw snapshot, re-verify totals | 🟡 snapshot + extracts done; manifest open | Cursor |
| 5 · deck transcription | ✅ raw OCR both decks · 🟡 string verification against page images open | Cursor |
| 6 · scaffold | ⬜ open | Grok |
| 7 · page copy, logo wall, testimonials | 🟡 copy extracted; assembly open; logo marks open | Grok + Cursor |
| 8 · Directions A, B, C + variants | ⬜ open | Grok |
| 9 · Eric picks a direction | 🔒 blocked on 8 | — |
| 10 · migration into `staging` | 🔒 blocked on 3 + Sanity project | Grok |
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
