# workorders/

Two agents, two lanes, one repo. This file is the contract between them; the lane files are
the work.

| Work order | Agent | Owns |
|---|---|---|
| [`cursor-images.md`](cursor-images.md) | **Cursor**, running locally in `~/sl` | everything local — the image set (the ~12 GB dump, the 887 referenced files, originals, dimensions, alt text, the upload set), plus the deck PDFs, the logo master, the live link-check, backup integrity, and reviewing Grok's handoffs |
| [`grok-build.md`](grok-build.md) | **Grok**, reading `scherzo-io/sl` on GitHub | the build — Eric's email, scaffold, Sanity schema, content assembly, all three design directions, migration scripts, SEO/redirects |
| [`grok-council-plan.md`](grok-council-plan.md) | **Grok** | how Grok executes `grok-build.md` (gated phases + council). Does not replace the work order. Re-read after a work-order changelog. |

The split follows the tooling. Cursor is on the machine: it holds the dump, opens a PDF, looks
at a photograph, hits the live site, and watches the build render on a real screen. Grok reads
the repo and writes code and copy. Neither needs the other's permission to work, because the
file-ownership map below has no overlaps.

**Where things stand at any moment: [`STATUS.md`](STATUS.md).** Read it first if you have been
away — it is what makes coming back to this project cheap, and both lanes maintain it.

| Also here | What it holds |
|---|---|
| [`sessions/`](sessions/README.md) | one log per session per lane — what was done, what landed, what was skipped, what's next |
| `handoffs/` | Grok's phase-gate handoffs, `grok-<date>.md` |
| `reviews/` | Cursor's adversarial reviews of those handoffs, `grok-<date>.md` |
| `cursor-plan.md` | Cursor's own executable plan, committed before it starts work |

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
| `scripts/build-image-manifest.mjs`, `content/images/**`, `content/link-check/**`, `content/deck-corrections.tsv`, `workorders/cursor-plan.md`, `workorders/reviews/**` | **Cursor** |
| `workorders/handoffs/**` | **Grok** |
| `workorders/STATUS.md`, `workorders/sessions/**` | **both** — append your own rows and session logs; don't rewrite the other lane's |
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
- **End every session with three things**, in this order: commit; write
  `workorders/sessions/<date>-<lane>-NN.md` from that directory's template; update
  `STATUS.md`. Propose a `COWORK.md` §6 row in your session log — Alexey applies it. Leave
  `git status` clean of anything you meant to keep.

## 3a. How the lanes hand off

```
Grok phase gate  →  workorders/handoffs/grok-<date>.md
                 →  Cursor reproduces the claims locally, adversarially
                 →  workorders/reviews/grok-<date>.md   (confirmed / not reproduced / contradicted)
                 →  Alexey decides what gets fixed, and by whom
```

Cursor **reports**; it does not patch Grok's files unless Alexey says so, and then in separate
commits. Grok may disagree with a review finding — in writing, in the repo. The point of the
loop is that no claim about this build survives on assertion alone: the lane that can actually
run it on a screen is the one that confirms it.

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
| The 21 source-conflict rows in section A | Eric | migrating those specific fields (PLAN §11 step 10) |
| `subCategory` taxonomy — workbook's 10 two-level values vs the retired flat 5 | Eric | the second filter level; 55 of 58 need backfill either way |
| Content for the 8 pipeline projects (Twinta especially — it exists only in the transcript) | Eric | those 8 drafts stay title-only |
| Vector logo (only a 2048×566 PNG exists) | Eric | crisp wordmark at large sizes |
| **Video files** — none exist anywhere on this machine | **Alexey first, then Eric.** Cursor asks him directly (`cursor-images.md` §5.6): files, end-logo status, hosting preference, which variant each one is for, poster frames | two of the four homepage variants, the `video` doc type. One question unblocks half the variant set |
| Publishable partner logo artwork (~30 marks) | Eric / Alexey — the decks can only supply names, not artwork (`content/findings/deck-raster-finding.md`) | the logo wall's images; its type and layout can be built now |
| Confirm the WP 564 slug fix, and the newly found WP 558 `autrium` typo | Eric | two redirect rows |
| RFP recipient addresses · Procore mention keep/drop · Mercer St testimonial attribution · which phone numbers are publishable · references-page approach · one site or two | Eric | the RFP form, one services line, one testimonial, `siteSettings` |
| Sanity project + write token | Alexey | schema deploy, TypeGen against a real dataset, any migration dry-run |
| ~~Partner logo marks~~ | **now Cursor's** (`cursor-images.md` §5.2) — it can open the PDF | no longer blocked |

## 6. Where the work stands

Moved to [`STATUS.md`](STATUS.md), so there is exactly one tracker and it cannot drift from
this file. It carries the PLAN §11 step tracker, what is in flight, what is next, and a
"how to resume" block for coming back after a break.
