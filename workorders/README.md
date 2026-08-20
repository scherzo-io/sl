# workorders/

Two agents, two lanes, one repo. This file is the contract between them; the lane files are
the work.

| Work order | Agent | Owns |
|---|---|---|
| [`cursor-images.md`](cursor-images.md) | **Cursor**, running locally in `~/sl` | everything about the image set — the ~12 GB WordPress dump, the 887 referenced files, originals, dimensions, alt text, the upload set |
| [`grok-build.md`](grok-build.md) | **Grok**, reading `scherzo-io/sl` on GitHub | everything else — Eric's email, scaffold, Sanity schema, content assembly, all three design directions, migration scripts, SEO/redirects |

The split follows the tooling. Cursor is on the machine that holds the dump and can look at a
photograph; Grok reads the repo and writes code and copy. Neither needs the other's
permission to work, because the file-ownership map below has no overlaps.

---

## 1. Read this before anything

In this order, every session, both lanes:

1. **`PLAN.md` §1** — the decision table. It wins over every other document in this repo,
   including this one. Rows are never silently changed; a change is a *new row* that cites
   what it supersedes.
2. **`CLAUDE.md`** — build rules, the role mapping, the hard prohibitions, the verification
   gates.
3. **`DESIGN.md`** — tokens, patterns, the three directions, the kill-list. Authoritative for
   anything visual.
4. **`COWORK.md`** — session protocol. §1 (work lands in the repo) and §5 (sensitivity) are
   not optional.
5. **`inputs/derived/EXTRACT-REPORT.md`** — what the data actually says, with 17 assertions
   against PLAN.md. Read it before trusting any number you remember.
6. **`content/findings/`** — `wxr-export-finding.md` and `legacy-slugs-finding.md` are recent
   and change real work.

Then your own lane file.

## 2. File ownership

Write only inside your lane. If you need something changed outside it, say so in your session
report — do not reach across.

| Path | Owner |
|---|---|
| `scripts/build-image-manifest.mjs`, `content/images/**` | **Cursor** |
| `app/**`, `sanity/**`, `components/**`, `lib/**`, `public/**`, `scripts/import-*`, `package.json`, config files | **Grok** |
| `content/pages/**`, `content/copy/**`, `content/eric-email.md` | **Grok** |
| `inputs/raw/**` | nobody — source of record, immutable |
| `inputs/derived/**`, `scripts/wxr-extract.py`, `scripts/xlsx-extract.py`, `scripts/stage-raw-inputs.py` | shared, but **generated**: change the script and re-run, never hand-edit output |
| `PLAN.md`, `DESIGN.md`, `CLAUDE.md`, `COWORK.md` | **Alexey.** Either lane may *propose* a new PLAN §1 row in its session report; neither edits §1 rows directly |
| `content/content-inventory.tsv`, `content/source-conflicts.md`, `content/image-audit.tsv` | **Alexey.** Propose rows; don't rewrite live ones |
| `content/findings/**` | either lane may add a new `<topic>-finding.md` using the template in that directory's README |
| `wp-content/**` | read-only, git-ignored, never committed, never modified |

## 3. Branches and commits

- `main` is Alexey's. Neither lane commits to it or merges into it.
- Cursor works on `cursor/images`, commits locally, **does not push** (CLAUDE.md).
- Grok works on `grok/build`, commits there, and may push *that branch* so Alexey can review
  it. Never `main`.
- Commit early and often. COWORK.md §1: anything that exists only in a chat session is
  already lost — the 19 Aug document set was lost exactly that way.
- Commit messages: descriptive, and subject to the same sensitivity rules as everything else.
  No revenue, spend, staffing or ownership content in a message.
- End every session by adding a row to `COWORK.md` §6 in your session report (Alexey applies
  it) and leaving `git status` clean of anything you meant to keep.

## 4. Rules that bind both lanes

- **Never invent a value.** DESIGN §9 is a kill-list, not a style note. Every displayed fact
  traces to `content/content-inventory.tsv`, `inputs/derived/`, a capability deck, or the
  live site. No placeholder strings, no lorem, no `example.com`, no invented emails, phones,
  addresses or hours — in rendered output *or* in a fixture that could reach one.
- **Unresolved conflict = don't migrate that field.** `content/source-conflicts.md` section A
  is Eric's to answer. Flag it and move on; a plausible guess is worse than a gap here.
- **The decks' REFERENCES block never enters the repo or the site** — architect names with
  direct phones and emails, commercial deck p41 / residential deck p42. "References available
  on request." This is why the deck PDFs themselves are not committed.
- **Nothing from the July 10 transcript except decisions.** No revenue, marketing spend,
  staffing or ownership content in code, CMS, comments, commit messages, or a document that
  could reach a third party. The repo has a remote; assume it can leak.
- **`wp-content/` never gets committed.** It is ~12 GB against a 100 MB GitHub file cap. It
  is git-ignored, and it stays that way.
- **A number in this repo must recompute from this repo.** If you can only get it from the
  live site, label it measured-from-live with a date and a reproduction command
  (COWORK.md §3).
- **Disagreeing with the plan is allowed; editing it quietly is not.** If you find a PLAN
  number wrong, write a finding, propose a §1 row, and say so loudly. That is how the 1,744 →
  1,763 correction happened.

## 5. Blocked on someone else — do not guess

Neither lane can close these. Build around them, leave the seam visible, and list what you
skipped.

| Blocked | Owner | Blocks |
|---|---|---|
| The 20 source-conflict rows in section A | Eric | migrating those specific fields (PLAN §11 step 10) |
| `subCategory` taxonomy — workbook's 10 two-level values vs the retired flat 5 | Eric | the second filter level; 55 of 58 need backfill either way |
| Content for the 8 pipeline projects (Twinta especially — it exists only in the transcript) | Eric | those 8 drafts stay title-only |
| Vector logo (only a 2048×566 PNG exists) | Eric | crisp wordmark at large sizes |
| Video files without end logos, and hosting preference | Eric | the video homepage variants, `video` doc type |
| Confirm the WP 564 slug fix, and the newly found WP 558 `autrium` typo | Eric | two redirect rows |
| RFP recipient addresses · Procore mention keep/drop · Mercer St testimonial attribution · which phone numbers are publishable · references-page approach · one site or two | Eric | the RFP form, one services line, one testimonial, `siteSettings` |
| Sanity project + write token | Alexey | schema deploy, TypeGen against a real dataset, any migration dry-run |
| Partner logo *marks* (~30, commercial deck p42 — names are OCR-recoverable, images are not) | Alexey (locally, from the PDF) | the logo wall |

## 6. Where the work stands

| PLAN §11 step | Status | Lane |
|---|---|---|
| 1 · document set, hygiene, conflicts, inventory | done 2026-08-20 | — |
| 2 · extract 58 projects, image audit, verification | done 2026-08-20 | — |
| 3 · Eric's conflict email | drafting | Grok |
| 4 · image manifest, raw snapshot, re-verify totals | **snapshot + extracts done** (`inputs/`); manifest open | Cursor |
| 5 · deck transcription | done (raw OCR, both decks) | — |
| 6 · scaffold | open | Grok |
| 7 · page copy, logo wall, testimonials | copy now extracted, not yet assembled | Grok |
| 8 · Directions A, B, C + variants | open | Grok |
| 9 · Eric picks a direction | blocked on 8 | — |
| 10 · migration into `staging` | blocked on 3 + Sanity project | Grok (Cursor supplies the image set) |
| 11 · SEO / redirect layer | open, and bigger than PLAN §9 knew — see `legacy-slugs-finding.md` | Grok |
| 12 · staging sign-off, cutover | blocked | — |
