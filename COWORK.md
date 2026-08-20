# COWORK.md — session & propagation protocol

Why this file exists: on 19 Aug 2026 the merged planning documents were produced in a chat
session and never written to this repo. The session's scratchpad was the only copy; the
documents were lost and had to be rebuilt from drafts a day later. The rules below make that
failure structurally impossible to repeat.

## 1. Where work lands

- **Every deliverable lands in this repo (`~/sl`) before the session ends.** Session
  scratchpads and chat outputs are temporary by design — treat anything that exists only
  there as already lost.
- End every working session with: `git status` (nothing intended left untracked) →
  `git add` → a descriptive local commit. Pushing is Alexey's call.
- If a session cannot write to the repo (wrong mount, permissions), stop and fix that first —
  do not continue producing work into a scratchpad.

## 2. Documents and their owners

| File | Owns | Changes via |
|---|---|---|
| `PLAN.md` | decisions (§1 table), sequence, scope | new §1 rows only — never silent edits |
| `DESIGN.md` | tokens, patterns, directions, kill-list | follows PLAN §1; sync same session |
| `CLAUDE.md` | build rules, mappings, gates | follows PLAN §1; sync same session |
| `content/content-inventory.tsv` | canonical project registry | regenerate from sources, don't hand-edit live rows |
| `content/source-conflicts.md` | open cross-source disagreements | add rows; mark resolved with Eric's answer + date |
| `content/findings/` | research findings | template in its README |
| `inputs/raw/` | snapshotted sources (WXR export, workbooks, logo master) | immutable — never edited, never regenerated |
| `inputs/derived/` | text extracts of the above | change the script in `scripts/` and re-run; never hand-edit |
| `scripts/` | extractors now, image manifest + migration later | ordinary code review; stdlib only for the extractors |
| `workorders/` | the two agent lanes and the file-ownership map | update when a lane's scope changes |

**Propagation rule:** any PLAN §1 row that touches tokens, schema, URLs, or content rules must
be mirrored into DESIGN.md / CLAUDE.md in the same session, and the row cites what it
supersedes. Quick check before committing: grep the retired value (e.g. a dead hex) across
the repo — it should appear only in PLAN §1 history and superseded-marked lines.

## 3. Findings

One file per finding in `content/findings/`, using the template in
`content/findings/README.md`. Numbers must either recompute from data in this repo or be
marked **measured-from-live with a date and a reproduction command**. A finding that
invalidates a decision gets a new PLAN §1 row, not an edit.

## 4. Research sessions

- Snapshot raw source data (REST JSON, exports) under `/inputs/raw/` before transforming;
  transforms must be rerunnable without re-hitting the source.
- Live-site numbers change: date every measured claim.
- When two sources disagree, add a `source-conflicts.md` row — do not pick a winner inline.

## 5. Sensitivity rules

- **July 10 transcript:** read for decisions only. Revenue, marketing spend, staffing,
  ownership content never enter this repo, the CMS, the site, commit messages, or any
  document that could reach a third party. The repo has a GitHub remote — assume it can leak.
- **Deck REFERENCES block** (architect direct contacts): never into the repo or the site.
- **The two rescued 19 Aug drafts** are archived in `docs/archive/` (Alexey's call,
  2026-08-20) with the Silver Lining engagement figures stripped. The unredacted originals
  remain outside the repo. Anything else quoting call-level commercial detail follows the
  same pattern: strip before it enters a repo with a remote.
- Client photography and decks are Eric's property — fine in the repo, not for reuse elsewhere.

## 6. Session log

| Date | Session | Landed in repo |
|---|---|---|
| 2026-08-19 | Planning (audit, reference capture, two plan drafts, brief, merge attempt) | FINAL-PLAN.md, spec, image-audit.tsv, originals-finding.md — merge output lost (see §0) |
| 2026-08-20 | Adversarial review + fix | hygiene commit; PLAN/DESIGN/CLAUDE/COWORK rebuilt; content-inventory.tsv; source-conflicts.md; spec+originals patches; deck transcripts; FINAL-PLAN.md deleted |
| 2026-08-20 | Archive decision | `docs/archive/` — the two 19 Aug drafts, redacted |
| 2026-08-20 | Source ingest + work orders | `inputs/raw/` (WXR export, both workbooks, logo master, 2022 export CSV); `inputs/derived/` (83 extracts, 17 assertions passing); `scripts/` (3 extractors + README); `workorders/` (README + Cursor + Grok lanes); 2 findings; PLAN §1 rows 23–29; source-conflicts A-21 + §F; CLAUDE/COWORK/originals synced |

Add a row per session, same day.
