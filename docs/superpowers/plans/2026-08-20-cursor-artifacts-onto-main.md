# Cursor Artifacts onto Main Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge `cursor/images` into `main` so Cursor’s measured artifacts live on the build tree, then (second commit only) copy the 30 verified partner names into `partners.json` so `/partners` renders names plus empty artwork slots.

**Architecture:** Two isolated commits on `main`. Commit 1 is a `--no-ff` merge plus three handwritten conflict resolutions; it must not change site behavior (`partners.json.names` stays `[]`). Commit 2 is the only Grok-owned edit: fill `names` from `content/images/partners/names.tsv` and leave `artwork: []`. Do not merge `main` into `cursor/images`. Do not point `PartnersWall` at the reference crops. Do not touch `lib/projects.ts`, `ProjectImageSlot`, or the sidebar wordmark.

**Tech Stack:** git merge on `main`; Next.js App Router already on `main`; `PartnersWall` already reads `@/content/copy/partners.json`; stdlib `node` for the names assert.

## Global Constraints

- Work on **`main`** only. Current expected tip: `f83c3e0` (`Note origin push; Cursor can git pull`). Incoming: `cursor/images` @ `799e790`. Merge-base: `d0ea662`.
- This merge is **Alexey-authorized**. `workorders/README.md` §3 says neither lane merges into `main`; this plan is the exception. Do not treat it as a license to keep committing to `main` afterward.
- **Do not push.** Do not `--force`. Do not `--amend`. Do not `--no-verify`.
- **Do not edit `PLAN.md` §1 rows.** Do not invent partner names or artwork.
- **Do not add video binaries.** Root WhatsApp `*.mp4` files stay untracked. After the `.gitignore` union they must remain ignored.
- **Do not use** `content/images/partners/reference/*.png` as publishable marks (PLAN §1 row 31).
- **Do not edit** `lib/projects.ts`, `components/media/ProjectImageSlot.tsx`, `components/media/HeroSlot.tsx`, or sidebar wordmark files. Hero count 35 vs PLAN 34 stays a finding, not a code change.
- **Do not start Phase F** (Sanity ingest). Manifest landing is not an ingest start.
- Sensitivity: no revenue, spend, staffing, ownership, or deck REFERENCES contacts in commits, STATUS, or the session log.
- `python3 scripts/wxr-extract.py` must still print `assertions failed: 0` after every commit.

---

## File map

| Path | Role in this plan |
|---|---|
| `.gitignore` | Conflict. Union: keep `main`’s `tsconfig.tsbuildinfo` and Cursor’s `*.mp4` / `*.mov` / `*.webm` / `*.m4v`. |
| `scripts/README.md` | Conflict. Keep Grok’s Node checkers **and** Cursor’s `build-image-manifest.mjs` row. |
| `workorders/STATUS.md` | Conflict. Rewrite a union STATUS. Neither side is current. |
| Additive Cursor files (~54) | Apply from `cursor/images` with no edit. Includes `content/images/**`, `content/link-check/**`, `scripts/build-image-manifest.mjs`, cursor sessions/review/plan. |
| `content/copy/partners.json` | Untouched in commit 1. Commit 2: `names` = 30 TSV `firm_name`s, `artwork` stays `[]`. |
| `components/media/PartnersWall.tsx` | Do not edit. Already renders zero slots when `names` is empty, and name + empty tile when filled. |
| `workorders/sessions/2026-08-20-cursor-04.md` | Create in commit 2. |

---

### Task 1: Preflight, then merge `--no-ff`

**Files:**
- Modify (via merge): `.gitignore`, `scripts/README.md`, `workorders/STATUS.md`, plus ~54 additive paths from `cursor/images`
- Do not create anything yet

**Interfaces:**
- Consumes: local `main` @ `f83c3e0`, `cursor/images` @ `799e790`, merge-base `d0ea662`
- Produces: a conflicted merge in progress with **exactly three** unmerged paths

- [ ] **Step 1: Confirm the tree is the one this plan was written against**

Run from `/Users/alexeyetcheverry/sl`:

```bash
git status --short
git branch --show-current
git rev-parse --short HEAD
git rev-parse --short cursor/images
git merge-base main cursor/images | cut -c1-7
```

Expected:

```
<empty status>
main
f83c3e0
799e790
d0ea662
```

If `HEAD` or `cursor/images` moved, or status is dirty, **stop**. Re-read both tips and this plan before continuing. Do not merge a dirty tree. Do not stash the WhatsApp videos into the merge.

- [ ] **Step 2: Start the merge**

```bash
git merge --no-ff cursor/images
```

Expected: merge **stops on conflicts**. `git status` lists unmerged:

```
.gitignore
scripts/README.md
workorders/STATUS.md
```

and stages the additive Cursor files (`content/images/**`, `content/link-check/**`, `scripts/build-image-manifest.mjs`, `workorders/cursor-plan.md`, `workorders/reviews/grok-2026-08-20.md`, `workorders/sessions/2026-08-20-cursor-0{1,2,3}.md`, and the rest of the `A` paths from `git diff --name-status main...cursor/images`).

If any **fourth** path is unmerged, **stop and report**. Do not guess a resolution.

Do **not** commit yet. `partners.json` must still be the `main` version (`"names": []`).

---

### Task 2: Resolve `.gitignore` (union)

**Files:**
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `main` has `tsconfig.tsbuildinfo`; `cursor/images` has the video block
- Produces: one file that keeps both

- [ ] **Step 1: Replace the conflicted file with this exact union**

Write `.gitignore` as:

```
# OS junk
.DS_Store

# WordPress dump — ~11 GB, must never reach GitHub (100 MB file cap, 1 GB free LFS)
wp-content/

# Dependencies & build output
node_modules/
.next/
out/
dist/
tsconfig.tsbuildinfo

# Environment & secrets
.env
.env.*

# Sanity
.sanity/

# Logs
*.log
npm-debug.log*

# Python venv for the local lane (PyMuPDF, pypdf, Pillow)
.venv/

# Video binaries — never commit. Inventory lives in content/video-inventory.tsv
*.mp4
*.mov
*.webm
*.m4v
```

Keep `main`’s heading (“Dependencies & build output”, no “Phase 0 scaffold”). Keep `main`’s `tsconfig.tsbuildinfo`. Keep Cursor’s four video globs and their comment.

- [ ] **Step 2: Confirm videos stay ignored and the union is what we think**

```bash
git check-ignore -v "WhatsApp Video 2026-07-10 at 10.46.02 AM.mp4" || true
printf '%s\n' tsconfig.tsbuildinfo '*.mp4' '*.mov' '*.webm' '*.m4v' | while read p; do grep -F -x -q "$p" .gitignore || { echo "missing $p"; exit 1; }; done
echo "gitignore union ok"
```

Expected: the WhatsApp path is ignored by `*.mp4` (if that file is still at repo root). All five patterns present. No conflict markers (`<<<<<<<`).

- [ ] **Step 3: Stage**

```bash
git add .gitignore
```

---

### Task 3: Resolve `scripts/README.md` (both tables)

**Files:**
- Modify: `scripts/README.md`

**Interfaces:**
- Consumes: `main` Node-checker section; `cursor/images` `build-image-manifest.mjs` row
- Produces: one README that documents Python extractors, the image-manifest script, and the Node checkers

- [ ] **Step 1: Replace the conflicted file with this exact union**

Write `scripts/README.md` as:

```markdown
# scripts/

Stdlib Python 3 only — no `npm install`, no `pip install`, no credentials, no network.
Everything here is deterministic: same input, same bytes out. Run from the repo root.

| Script | Does | Reads | Writes |
|---|---|---|---|
| `stage-raw-inputs.py` | stages the five external sources into `inputs/raw/`, redacting two author emails from the WXR, printing sha256 before and after | the 20 Aug source folder (outside the repo) | `inputs/raw/` |
| `wxr-extract.py` | parses the WXR export into text extracts; runs 17 assertions against PLAN.md; classifies the retired-slug history | `inputs/raw/streamlineusa.WordPress.2026-08-20.xml` (+ optional `--uploads`) | `inputs/derived/` |
| `xlsx-extract.py` | flattens both content workbooks to one TSV per sheet | `inputs/raw/*.xlsx` | `inputs/derived/workbook-v{1,2}/` |
| `build-image-manifest.mjs` | measures the 887 chosen originals on disk; writes manifest + checksums | `inputs/derived/project-images.tsv` + `--uploads` | `content/images/image-manifest.tsv`, `content/images/checksums-887.tsv` |

```bash
python3 scripts/wxr-extract.py                                # repo-only
python3 scripts/wxr-extract.py --uploads wp-content/uploads   # + disk cross-check
python3 scripts/xlsx-extract.py
node scripts/build-image-manifest.mjs --uploads wp-content/uploads
```

`wxr-extract.py` exits after printing how many assertions failed. **Zero is the only
acceptable answer** — a failure means either the export changed or a PLAN number moved, and
either way it needs a human before anything downstream runs.

The **committed** extracts are the no-flag output, so `inputs/derived/` stays a pure function
of `inputs/raw/` and regenerates identically on a machine with no dump. `--uploads` adds disk
columns for local verification and will leave the tree dirty; don't commit that variant.
`stage-raw-inputs.py` finds the author addresses it redacts by pattern rather than by name —
hardcoding them in a committed script would defeat the redaction.

## Node (build lane)

Stdlib Node, run from the repo root. Do not hand-edit generated JSON.

| Script | Does | Reads | Writes |
|---|---|---|---|
| `build-redirects.mjs` | `npm run redirects:build` — 37 301s, 11 SKIP, 25 REVIEW, 2×410, 58 live | `inputs/derived/legacy-slugs.tsv`, `content/content-inventory.tsv` | `content/copy/redirects.json` |
| `check-redirects.mjs` | `npm run check:redirects` — invariants, then local HTTP 301/410/200/404. `--offline` skips HTTP. Never hits production | `content/copy/redirects.json` | — |
| `check-kill-list.mjs` | `npm run check:copy` | `app/`, `components/`, `lib/`, sourced JSON | — |
| `check-retired-hex.mjs` | `npm run check:tokens` | built/CSS sources | — |

## Still to be written

| Script | Owner | Per |
|---|---|---|
| migration scripts (`import-*.ts`) | build lane (`workorders/grok-build.md`) | PLAN §11 step 10, CLAUDE.md gates |

## Conventions

- Reads only from `inputs/raw/` and (optionally, behind a flag) the git-ignored
  `wp-content/` dump. Never re-hits the live site to produce a committed file: a number in
  this repo must recompute from this repo.
- Extractors write only to `inputs/derived/` — never hand-edit that tree; change the script.
  `build-image-manifest.mjs` writes Cursor-owned files under `content/images/`.
  Node checkers write nothing, except `build-redirects.mjs` → `content/copy/redirects.json`.
- Anything that cannot be reproduced offline is labelled measured-from-live with a date, per
  COWORK.md §3.
```

Cursor’s incoming README **drops** the Node section. Taking Cursor’s file wholesale is a failed resolve.

- [ ] **Step 2: Confirm both sides survived**

```bash
grep -n 'build-image-manifest.mjs' scripts/README.md
grep -n 'check-retired-hex.mjs' scripts/README.md
grep -n 'build-redirects.mjs' scripts/README.md
! grep -q '<<<<<<<' scripts/README.md
```

Expected: all three script names present; no conflict markers.

- [ ] **Step 3: Stage**

```bash
git add scripts/README.md
```

---

### Task 4: Resolve `workorders/STATUS.md` (rewrite; do not pick a side)

**Files:**
- Modify: `workorders/STATUS.md`

**Interfaces:**
- Consumes: Grok’s STATUS on `main` (build A–H, stale Cursor row) and Cursor’s STATUS on `cursor/images` (Wave 1 + review, stale Grok §11)
- Produces: one STATUS that is true **after commit 1** — artifacts on `main`, wall still empty

- [ ] **Step 1: Write this exact STATUS (commit-1 state)**

Replace `workorders/STATUS.md` with:

```markdown
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
```

Do not keep Cursor’s “scaffold ⬜ open” tracker. Do not keep Grok’s “Cursor kickoff not started” lane row.

- [ ] **Step 2: Confirm no conflict markers**

```bash
! grep -q '<<<<<<<' workorders/STATUS.md
grep -q 'partners.json still' workorders/STATUS.md
```

- [ ] **Step 3: Stage**

```bash
git add workorders/STATUS.md
```

Expected: `git status` shows **all conflicts resolved** (`All conflicts fixed but you are still merging`).

---

### Task 5: Verify commit 1 does not change the site, then commit the merge

**Files:**
- Test: `content/copy/partners.json`, `content/images/image-manifest.tsv`, `content/images/checksums-887.tsv`, `content/images/partners/names.tsv`
- Commit: the merge, including the three resolved files

**Interfaces:**
- Consumes: resolved index from Tasks 1–4
- Produces: merge commit on `main` titled as below; `partners.json.names` still `[]`

- [ ] **Step 1: Prove the wall is still empty and the artifacts landed**

```bash
python3 - <<'PY'
import json, pathlib
p = json.loads(pathlib.Path("content/copy/partners.json").read_text())
assert p["names"] == [], p["names"]
assert p["artwork"] == [], p["artwork"]
print("partners.json still empty: ok")
for rel, n in [
    ("content/images/image-manifest.tsv", 887),
    ("content/images/checksums-887.tsv", 887),
    ("content/images/partners/names.tsv", 30),
]:
    rows = pathlib.Path(rel).read_text().splitlines()
    data = [ln for ln in rows[1:] if ln.strip()]
    assert len(data) == n, (rel, len(data))
    print(f"{rel}: {len(data)} ok")
PY
python3 scripts/wxr-extract.py
npm run typecheck
npm run check:copy
```

Expected:

```
partners.json still empty: ok
content/images/image-manifest.tsv: 887 ok
content/images/checksums-887.tsv: 887 ok
content/images/partners/names.tsv: 30 ok
assertions failed: 0
```

`typecheck` and `check:copy` exit 0. `check:copy` must still see `"names": []` and must not hit a kill-list needle.

Do **not** run `node scripts/build-image-manifest.mjs` (needs the dump; would dirty the tree). Do **not** remake brand rasters. Do **not** `git add` any `*.mp4`.

- [ ] **Step 2: Confirm the index has no conflict markers and no video binaries**

```bash
git diff --cached --name-only | grep -E '\.(mp4|mov|webm|m4v)$' && exit 1 || echo "no video binaries staged"
git diff --cached | grep -E '^(<<<<<<<|=======|>>>>>>>)' && exit 1 || echo "no conflict markers staged"
```

- [ ] **Step 3: Commit the merge**

```bash
git commit -m "$(cat <<'EOF'
Bring Cursor image artifacts onto main.

Merge cursor/images so the measured 887-file manifest, live link-check,
partner-name TSV, and Wave 1 session/review files sit on the build tree.
partners.json names stay empty; site behavior is unchanged.

EOF
)"
```

This finishes git’s merge commit (it already has the two parents). Do not add extra `-m` flags that would replace the default merge subject if git already opened one — the command above is the whole commit.

- [ ] **Step 4: Confirm the merge commit**

```bash
git status --short
git log -1 --format='%h %p %s'
python3 -c 'import json; print(json.load(open("content/copy/partners.json"))["names"])'
```

Expected: clean tree (untracked WhatsApp mp4s are fine). Merge commit has **two** parents (`f83c3e0` and `799e790`). Printed names: `[]`.

---

### Task 6: Fill `partners.json` names from the TSV (second commit)

**Files:**
- Modify: `content/copy/partners.json`
- Modify: `workorders/STATUS.md` (commit-2 lines only)
- Create: `workorders/sessions/2026-08-20-cursor-04.md`

**Interfaces:**
- Consumes: `content/images/partners/names.tsv` column `firm_name` (30 rows, header skipped), in file order
- Produces: `partners.json.names` length 30, `artwork` still `[]`. `PartnersWall` then renders 30 name+empty-tile slots. Expected names, in order:

1. `B·C·D Consulting` (middle dots, U+00B7)
2. `Iron Bridge Consulting`
3. `David J. Spector & Associates`
4. `M Z A Architecture`
5. `Cetraruddy`
6. `Kanter` (medium-confidence script read; still in the 30)
7. `swa architecture`
8. `CMS Architecture and Design`
9. `Richard H. Lewis Architect`
10. `Snarkitecture`
11. `Tersigni Palachek`
12. `bluarch`
13. `Barlis Wedlick`
14. `Celano design studio`
15. `TRUST3 HOSPITALITY`
16. `Alexander Waterworth Interiors`
17. `BANG³` (superscript 3, U+00B3)
18. `Aviva Collective`
19. `FURY`
20. `Tree House Design`
21. `studioMDA`
22. `Studio Tractor Architecture`
23. `Lynch/Eisinger/Design`
24. `David A. Levy & Associates`
25. `NDNY Architecture + Design`
26. `LG.JA`
27. `David Bae Architect`
28. `ICRAVE`
29. `Present Architecture`
30. `SRAA+E Architecture + Engineering, P.C.`

Do not sort. Do not “fix” casing. Do not drop Kanter. Do not put a path into `artwork`.

- [ ] **Step 1: Write the failing check (names still empty)**

```bash
node --input-type=module -e '
import { readFileSync } from "node:fs";
const names = readFileSync("content/images/partners/names.tsv","utf8").trim().split("\n").slice(1).map(l => l.split("\t")[0]);
const json = JSON.parse(readFileSync("content/copy/partners.json","utf8"));
if (json.artwork.length !== 0) throw new Error("artwork must stay empty");
if (names.length !== 30) throw new Error("TSV should have 30 names, got " + names.length);
if (json.names.length !== 30) throw new Error("expected 30 names in partners.json, got " + json.names.length);
if (JSON.stringify(json.names) !== JSON.stringify(names)) throw new Error("partners.json names !== TSV firm_name column");
console.log("partners.json matches names.tsv: 30 names, artwork empty");
'
```

Expected: **FAIL** with `expected 30 names in partners.json, got 0`.

- [ ] **Step 2: Write `partners.json` from the TSV (do not hand-type the unicode)**

```bash
node --input-type=module -e '
import { readFileSync, writeFileSync } from "node:fs";
const names = readFileSync("content/images/partners/names.tsv","utf8")
  .trim().split("\n").slice(1).map((l) => l.split("\t")[0]);
if (names.length !== 30) throw new Error("expected 30 TSV names, got " + names.length);
if (names.some((n) => !n)) throw new Error("blank firm_name");
const json = {
  source: "PLAN §1 row 31 / content/findings/deck-raster-finding.md / content/images/partners/names.tsv",
  names,
  artwork: [],
  status: "30 verified firm names from content/images/partners/names.tsv. Artwork empty — PLAN §1 row 31: names yes, artwork no. Do not publish OCR. Do not trace, upscale, or generate marks.",
  layout: "type + empty artwork slot per name",
};
writeFileSync("content/copy/partners.json", JSON.stringify(json, null, 2) + "\n");
console.log("wrote", names.length, "names");
'
```

Expected: `wrote 30 names`. File is 2-space JSON with a trailing newline. `artwork` is `[]`.

- [ ] **Step 3: Re-run the check; it must pass**

Re-run the exact `node --input-type=module` command from Step 1.

Expected: `partners.json matches names.tsv: 30 names, artwork empty`.

Also:

```bash
npm run typecheck
npm run check:copy
python3 scripts/wxr-extract.py
```

Expected: all three clean / `assertions failed: 0`.

- [ ] **Step 4: Optional render check (only if `npm run start` is not already bound)**

If port 8080 is free and a production server is already built from before, or after `npm run build && npm run start`:

```bash
curl -sS http://127.0.0.1:8080/partners | grep -F 'B·C·D Consulting'
curl -sS http://127.0.0.1:8080/partners | grep -F 'BANG³'
curl -sS http://127.0.0.1:8080/partners | grep -c 'w-tile'
```

Expected: both names present; `w-tile` count is 30. Skip this curl if starting a server would fight an existing process — the node assert + typecheck is the gate.

Do **not** add `<img src=...reference/...>` anywhere.

- [ ] **Step 5: Update STATUS for commit 2**

In `workorders/STATUS.md` only:

1. Change the “Last updated” line to:

```
Last updated: **2026-08-20** · by: Cursor (merge commit 2) · next action: **Alexey —
send `content/eric-email.md`. Do not start Phase F. Do not push unless asked.**
```

2. Change the Cursor lane State cell to: **Wave 1 + videos + review on `main`; `/partners` names live, artwork empty.**

3. Replace the commit-1 merge row’s “`partners.json` names still `[]`” sentence with a new Done row:

```
| 2026-08-20 | **`partners.json` names filled from TSV (commit 2).** 30 names, `artwork: []`. `/partners` shows type + empty tiles | `content/copy/partners.json` |
```

4. Set Cursor “In flight” to idle / none. Delete “wall not wired until commit 2”.

5. Next up item 1 becomes: leftover list in `sessions/2026-08-20-cursor-03.md` + this session `04` — not “wire partners.json”.

6. Step 7 tracker becomes: **30 names on the wall; artwork empty; publishable marks still an ask.**

- [ ] **Step 6: Write the session log**

Create `workorders/sessions/2026-08-20-cursor-04.md`:

```markdown
# cursor session 04 — 2026-08-20

**Phase:** merge Cursor artifacts onto `main` (plan 1–4)
**Branch:** `main` (Alexey-authorized merge of `cursor/images`)
**Commits:** merge commit 1 (artifacts, wall unchanged) + commit 2 (`partners.json` names)

## Did

- `git merge --no-ff cursor/images` into `main`.
- Resolved three overlaps by union / rewrite: `.gitignore`, `scripts/README.md`, `workorders/STATUS.md`.
- Stopped after commit 1 and confirmed `partners.json` names stayed `[]`.
- Copied 30 `firm_name`s from `content/images/partners/names.tsv` into `content/copy/partners.json`. Left `artwork: []`.

## Landed

| Path | What |
|---|---|
| merge `cursor/images` → `main` | 887 manifest, checksums, link-check, names TSV, brand sample, cursor sessions/review |
| `content/copy/partners.json` | 30 names, empty artwork |
| `.gitignore` | `tsconfig.tsbuildinfo` + video globs |
| `scripts/README.md` | Node checkers + `build-image-manifest.mjs` |

## Numbers

- `image-manifest.tsv` / `checksums-887.tsv`: 887 data rows.
- `names.tsv` / `partners.json.names`: 30.
- `partners.json.artwork`: 0.
- `python3 scripts/wxr-extract.py`: assertions failed: 0.

## Decisions I made on my own

- Kept Kanter in the 30 (medium-confidence script read on commercial p42).
- Did not attach `reference/*.png` to the wall.
- Did not change `lib/projects.ts` for the 35-vs-34 hero finding.

## Proposed, not applied

- None. No PLAN §1 edit.

## Blocked

- Publishable partner marks: Alexey / Eric.
- Phase F: Eric answers + Sanity project.

## Skipped

- Push to origin.
- Manifest remesure, alt-text, Sanity ingest, sidebar raster swap, `lib/projects.ts` hero update.

## Next step

Alexey sends `content/eric-email.md`. Do not start Phase F. Do not push unless asked.
```

- [ ] **Step 7: Commit**

```bash
git add content/copy/partners.json workorders/STATUS.md workorders/sessions/2026-08-20-cursor-04.md
git commit -m "$(cat <<'EOF'
Fill the partners wall names from the verified TSV.

Copy the 30 firm_name values into partners.json so /partners renders
type plus empty artwork slots. Leave artwork empty per PLAN §1 row 31.

EOF
)"
git status --short
```

Expected: commit succeeds; working tree clean except ignored/untracked videos. Two new commits on `main` since `f83c3e0`: the merge, then this one.

---

## Out of scope (do not do in this plan)

- `git merge main` into `cursor/images`
- `git push`
- Filling `artwork`, tracing crops, or generating marks
- Wiring `image-manifest.tsv` into `lib/projects.ts` / `next/image`
- Swapping the sidebar wordmark for `content/images/brand/*.png`
- 887 alt-text, Sanity ingest, Phase F
- Editing `PLAN.md` §1

---

## Self-review

1. **Spec coverage:** Sequence steps 1–4 map to Tasks 1–5 (merge + three overlaps + stop/commit) and Task 6 (second commit). Step 5 from the review (leave `lib/projects.ts` alone) is a Global Constraint, not a task.
2. **Placeholder scan:** no TBD / “implement later” / “add validation”.
3. **Type consistency:** `partners.json` shape stays `{ source, names: string[], artwork: unknown[], status, layout }`. `PartnersWall` already types `names` as `readonly string[]`.
