# Work order — Cursor — the local lane

**Lane:** everything that has to happen on this machine. The image set is the bulk of it, and
it is also the only lane that can open a PDF, look at a photograph, hit the live site, or run
the build and watch it render.
**Not your lane:** writing the site — scaffold, schema, content assembly, the three
directions, migration, SEO. That is Grok's (`grok-build.md`), running in parallel. You review
its output when it hands off (§6); you don't write it.
**Where:** locally in `~/sl`, on branch `cursor/images`.

Read `workorders/README.md` §1 first — the shared read order and the rules binding both lanes
are there and are not repeated here.

> **Changelog.** 2026-08-20b: broadened from "the image set" to the whole local lane. Added
> §0 (brainstorm → plan → execute), §5 (local-only tasks: deck verification, partner logo
> extraction, brand measurement, live link-check, backup checksums), §6 (review Grok's
> handoff) and §9 (progress protocol). §4 — the image set — is unchanged. The filename stays
> `cursor-images.md` because other documents point at it.
>
> 2026-08-20c: the PDF toolchain is **installed** (§2 — poppler, PyMuPDF, pypdf, Pillow), so
> spend no time on setup. **§5.6 is now an ask, not a note: request the video files from
> Alexey.** And §5.2 is corrected by measurement — every deck page is a single flattened raster,
> so the partner logos cannot be extracted as publishable artwork; the verified name list is the
> deliverable (`content/findings/deck-raster-finding.md`).

---

## 0. How to start: brainstorm, then plan, then execute

Do not start executing on your first pass. Three steps:

1. **Brainstorm this work order.** Argue with it. Where is it wrong, over-specified, missing a
   dependency, or asking for something in the wrong order? What is the cheapest path to the
   things everything else waits on?
2. **Commit `workorders/cursor-plan.md`** — a plan you could hand to someone else and have
   them execute it without you. It should carry: the task list in execution order with
   dependencies; how you're batching the 887-image alt-text pass and what a batch costs; tool
   choices (and what you had to install); the checkpoints where you stop and commit; what you
   are deliberately *not* doing and why; and the options you considered and rejected, so a
   reviewer can see the fork in the road.
3. **Then execute**, updating the plan as reality corrects it — the plan is a living file, not
   a promise.

The plan lands in the repo *before* execution starts. That is the whole point: if this session
dies halfway, the next one picks up a plan, not a mystery.

## 1. Mission

Two things nobody else can do:

- **Turn 887 files in a git-ignored WordPress dump into a migration-ready image set** — known
  provenance, true resolution, real alt text, an honest ledger of what is and isn't usable.
  The site is nothing but full-bleed photography; the image set *is* the product.
- **Close every gap that needs local access** — the deck PDFs, the logo master, the live site,
  the dump's integrity, and eventually Grok's build running on a real screen.

**You decide the scope, sequence and method within this lane.** §4 and §5 lay out the
territory and what is already known; how much you take on, in what order, with what tooling,
and how you batch the expensive parts is your call. Three things are not: the hard rules in
§8, the file paths in §7 (fixed so the other lane can depend on them), and the progress
protocol in §9.

## 2. First fifteen minutes

```bash
git checkout -b cursor/images
python3 scripts/wxr-extract.py --uploads wp-content/uploads   # must print: assertions failed: 0
sed -n '/## Disk cross-check/,$p' inputs/derived/EXTRACT-REPORT.md
head -3 inputs/derived/project-images.tsv | column -ts$'\t'
cat workorders/STATUS.md
```

If `assertions failed` is anything but `0`, stop and report — the ground moved under this work
order and a human needs to look before you build on it. Note that the `--uploads` run leaves
`inputs/derived/` dirty on purpose; **the committed extracts are the no-flag output**, so
`git checkout inputs/derived` before you commit anything else.

### What this machine has

Installed 2026-08-20b at Alexey's instruction — the PDF toolchain is ready, don't go shopping:

| | |
|---|---|
| poppler CLI | `pdfimages`, `pdftoppm`, `pdftotext`, `pdfinfo` |
| Python libs | **PyMuPDF 1.28.2, pypdf 6.16.1, Pillow 12.3.0** in a project venv at `.venv/` (git-ignored) |
| Also | `tesseract`, `sips`, `node`, `npm`, `python3` 3.13.5, `numpy`, `brew` |

```bash
.venv/bin/python -c "import pymupdf; print(pymupdf.__doc__)"   # no activation needed
```

Homebrew's Python is externally managed (PEP 668) so `pip install` into it is refused — that is
why the venv exists. **The repo's own scripts stay stdlib-only** so they run on any machine;
the venv is for your local PDF and image work. If you add a package, record it in your plan.

Provenance note: the deck transcripts say they were OCR'd at 120dpi with tesseract on
2026-08-20. That is reproducible again now — but see §5.1 for why re-running it at a higher DPI
will not help.

## 3. What you are working from

| Input | What it is |
|---|---|
| `wp-content/uploads/` | the dump. 25,750 image files: 11,504 `-WxH` derivatives, 1,578 `-scaled` copies, 9,611 imagify `.webp`, 3,845 candidate originals. Git-ignored, read-only, never committed |
| `inputs/derived/project-images.tsv` | **your work list.** The 887 referenced files, one row each: attachment ID, project, gallery position, served path, original path, `has_larger_original`, WordPress-recorded dimensions, square flag, alt, WP parent |
| `inputs/derived/attachments.tsv` | all 1,764 media-library records — the 876 unreferenced ones included |
| `inputs/derived/projects/<slug>.md` | each project's own description, location, role and credits — context for naming spaces |
| `inputs/derived/legacy-slugs.tsv` | 73 retired URLs, classified — the input to the live link-check (§5.4) |
| `content/image-audit.tsv` | the 19 Aug per-project audit. Agrees with the export everywhere except `median_w` on four projects (§4.6) |
| `content/originals-finding.md` · `content/findings/wxr-export-finding.md` | the originals finding, and why the numbers are now reproducible offline |
| `inputs/raw/brand/streamline-logo.png` | the 2048×566 logo master (§5.3) |
| `~/Downloads/Zipcodes/Streamline USA/Sample Portfolios_Streamline/` | **the two capability deck PDFs**: `Commercial Portfolio .pdf` (43 pp, 8.7 MB) and `Open Full residential 32824.pdf` (44 pp, 13.8 MB). **Every page is one flattened raster** — commercial ~1020×1320, residential ~1105×1430, zero text characters on any page. Deliberately **not** in the repo — §5.1, §5.2, and the hard rule in §8 |
| `~/Downloads/Zipcodes/Streamline USA/Images_Streamline/*.png` | ten 2048×2048 client-supplied PNGs outside the WordPress library (§4.7) |

### The baseline, verified 2026-08-20 — reproduce it, don't re-derive it

| | |
|---|---|
| Gallery images (`project_gallery`, all 58 projects) | 880 — no image is shared between projects |
| Featured images (`_thumbnail_id`) | 58, of which **7 appear in no gallery at all** |
| **Migration set = the union** | **887 unique files** |
| Present on disk, served copy · true original | **887 / 887** · **887 / 887** |
| With a larger original than WordPress serves | 387 of the 880 gallery + 1 of the 7 featured-only = **388** |
| Library-wide with larger originals | 791 of 1,763 image records |
| Gallery images WordPress records as `post: 0` | **137** — all real photography |
| ≥1920px wide · ≥2048px · square | 445 · 259 · 74 |
| Hero-capable projects | 34 of 58 |
| Referenced files with usable alt text | **0** (see §4.4) |

Nothing referenced is missing locally. The dump's empty `2021/`, `2024/`, `2025/`, `2026/`
directories are not a gap — the newest project images were uploaded in 2023.

---

## 4. Track A — the image set

### 4.1 True original dimensions — the one thing the export cannot tell us

`_wp_attachment_metadata` records the dimensions of the copy WordPress *serves*. For the 388
files with an `original_image`, those numbers describe the scaled copy, not the original. The
real dimensions exist only on disk. Measured probes range 3.5×–7× the served pixel count
(Mint Kitchen 2048×1366 served, 5600×3733 on disk).

Everything downstream — which projects can carry a full-bleed hero, how the square problem
gets solved, what `next/image` gets to work with — depends on measuring those 887 files rather
than trusting the metadata.

### 4.2 Original resolution rule

Prefer the hidden full-size original: strip WordPress's `-scaled` and `-WxH` suffixes, and use
`original_file` from `project-images.tsv` where `has_larger_original = yes`. Never the imagify
`.webp` derivatives — Sanity generates its own. `content/originals-finding.md` has the details
and the five projects where 640px really is the original.

### 4.3 Hero re-verification

PLAN §7 puts hero-capability at 34 of 58 and expects the originals to change quality, not
count. Confirm or correct that from measured pixels. Specifically named:

- **Entirely square, 2048×2048, and the newest/best work:** Lantern House, 795 5th Ave (The
  Pierre), 652 Hudson, 40 E 66th. DESIGN §8 lists four deliberate treatments — your job is the
  measured input to that decision, not the decision.
- **Unusable at full-bleed:** 12th St Townhouse (all 12 at 640×295), E63rd St Penthouse
  (640×392), Lexington Ave Townhouse (599×399), West 23rd Townhouse (990px), Horatio St
  Townhouse (990px), plus the Free People and Spring Studios featured images.
- **Exactly one upgradeable image out of 6–17:** Free People, Spring Studios, St Luke's Place,
  Madison Ave Duplex, Gunter Seeger.
- **Featured image outside its own gallery** (8 projects — CLAUDE.md gates this explicitly):
  Free People, Hudson St Penthouse, Madison Ave Duplex, St Luke's Place, West 23rd Townhouse,
  Indeed, Atrium (`autrium-corporate-office`), 700 Park Ave. Each must resolve a real
  `heroImage`.

### 4.4 Alt text — 887 images, and the two "existing" ones are worthless

CLAUDE.md requires descriptive alt on every migrated image, pattern
`<Project name> — <room/space>, <notable feature>`, and forbids filename-as-alt. The two
images the audit counts as having alt text are:

- Boqueria's featured image: `Boqueria` — the project name alone
- Kat & Theo's featured image: `Screen Shot 2016-03-02 at 1.48.15 PM` — a filename

So the honest number is **887 to write, not 885**. Neither existing value survives the rule
that put it in the gate.

Quality bar, using real projects:

| | |
|---|---|
| ✅ | `Lantern House — rooftop deck, floor-to-ceiling windows facing the High Line` |
| ✅ | `Bad Roman — dining room, curved banquettes under a coffered ceiling` |
| ✅ | `Mint Kitchen — open kitchen pass, brass shelving above the counter` |
| ❌ | `OPRY1.jpg` · `Boqueria` · `restaurant interior` · `beautiful renovation` |

Write what is in the frame. Do not infer a room type you cannot see, do not name materials you
are guessing at, and do not carry a claim from the project description into alt text for a
photograph that does not show it — that is inventing content (DESIGN §9). Where a frame is
genuinely ambiguous, describe it plainly and flag the row rather than guessing well.

887 vision passes is the largest single job in this build. Batch it however you like; the only
requirements are that the output is reviewable row by row, that you commit each batch as it
completes rather than at the end, and that you say what you skipped.

### 4.5 The 876 unreferenced library images

1,763 image records, 887 referenced, **876 referenced by no project**. PLAN §7 and
`originals-finding.md` both say these are worth a look before concluding a project's
photography is limited to what's currently linked — they could be alternate takes, unused
shoots, or junk. They are out of migration scope; a rough characterisation (per-project
candidates vs plugin/theme junk) is worth having, and would directly help the projects whose
photography is too small for a hero. `wp-content/uploads/backup/` holds another 1,726 files
that are worth the same glance.

### 4.6 Four `median_w` disagreements

`content/image-audit.tsv` and the export differ on `median_w` for `kat-theo` (1860 vs 1857),
`free-people-retail-store` (1107 vs 868), `hudson-street-penthouse` (1280 vs 1211) and
`madison-ave-duplex-2` (1027 vs 982). Everything else matches on all 58 projects. Likely a
median-of-even-set convention; confirm it is only that, and if it is something real, write a
finding. `image-audit.tsv` is Alexey's file — propose, don't rewrite.

### 4.7 Ten client PNGs outside the library

`~/Downloads/Zipcodes/Streamline USA/Images_Streamline/` holds ten 2048×2048 PNGs (~52 MB).
The squares are the same size as the four all-square projects' galleries. Are they duplicates
of images already in the 887, better versions of them, or photography that never made it onto
the site? Worth answering — and the answer stays a text finding. Those PNGs are not committed.

### 4.8 The upload set

Sanity ingests via `_sanityAsset` with an original URL, server-side, so production never points
at the legacy WordPress CDN. A deduped, best-resolution set of the 887 with alt text attached
is what the migration consumes. Writing the ingest script is fine; **running it needs a Sanity
project and write token that do not exist yet** (`workorders/README.md` §5) — build it to be
runnable, don't wait on it, and don't fake it.

---

## 5. Track B — the local-only work

Everything here is blocked for Grok by definition: it needs a PDF, a pixel, a live HTTP
response, or this laptop's disk.

### 5.1 Verify the deck OCR against the page images

Both transcripts open with a warning: uncorrected machine transcription, verify any string
against the page image before it is published. Nobody has. Grok is about to build copy on top
of them, so the strings that will actually ship are worth checking now.

**Why re-OCR won't fix it, and reading will.** Each deck page is a single flattened raster at
~1020×1320 (commercial) or ~1105×1430 (residential) — that is all the detail the file holds.
Rendering at 300 or 600 dpi just upsamples the same pixels, so the OCR ceiling is fixed and the
mangling (`RCD t. eee Vira`, `STReEeAMLIMNe usa`) is not a settings problem. You have the one
capability that beats it: you can look at the page. Read the strings that matter; don't tune a
pipeline.

- **The proof points, commercial deck p3** — `$10M GL insurance`, the "almost every building in
  the city and 5 boros" line, "pricing for **most** projects in 7 working days" (the qualifier
  is load-bearing — DESIGN §1), the in-house millwork/carpentry claim, the Procore line, and
  the closing "Let us build your next project."
- **The six services** and their descriptions, p3 — canonical per PLAN §8.
- **The partner bios**, p2 — Eric and Liam. Scrub direct contact details.
- **The five named testimonials and their attributions**, including the architect voice
  (Antonio Di Oronzo, Bluarch — one canonical spelling).
- **Firm names on the logo wall**, p42 — see §5.2.
- **Residential deck case studies** — ~25, including Lantern House and The Pierre.

Deliverable: a corrections file — OCR string, corrected string, page, confidence — so Grok can
apply it. Do **not** rewrite the transcripts in place; they are the raw OCR of record.

### 5.2 Extract the partner logo marks

`workorders/README.md` §5 listed this as blocked on Alexey. It is now yours — with one
important correction to what "extract" can mean here.

**Measured 2026-08-20b: the marks are not extractable as artwork.** Commercial deck p42
contains exactly **one** embedded image — a single flattened 1020×1320 JPEG of the whole page,
97 KB. Every page in both decks is like that. So the ~30 logos are regions of one low-resolution
bitmap, each perhaps 150–200px wide. That is enough to *identify* a firm and nowhere near
enough to publish a mark on a wall of them.

What that makes your deliverable:

- **The verified firm-name list.** Read the names off p42 and correct the mangled OCR
  (`RCD t. eee Vira`, `Tonseetina — ASSOCIATES nuns`, `CELANO ii cust Hosp` and friends). Every
  name is unverified until a human has read it off the page — which is exactly what you can do,
  and nobody else in this build can.
- **Reference crops, clearly labelled not-for-publication**, at native resolution, one per
  firm — so a human can confirm the reading and so whoever sources the real artwork knows what
  they are looking for. Small files; keep them out of any rendered path.
- **Publishable artwork is an ask, not a task.** Real marks have to come from each firm's own
  site or press kit, or from Eric. That is a decision about third-party trademark use (PLAN §1
  row 21 permits logos and testimonials in principle) — raise it, don't resolve it, and don't
  upscale or redraw a mark to fill the gap. A traced approximation of someone else's logo is
  both invented content and a worse problem than an empty wall.

**Hard boundary:** the page *before* it — commercial p41, and residential p42–43 — is the
testimonials/references page carrying the REFERENCES block: three architects' direct phones and
emails. Do not extract it, OCR it, screenshot it, or let it into the repo in any form
(CLAUDE.md, PLAN §1 row 21). Extract p42's images; skip its neighbours.

### 5.3 Measure the logo master

PLAN §1 row 11 locked `#DA2128` as the brand red on the evidence that the logo master "samples
`#DE2426` dominant". That sampling has never been reproducible from the repo. Now that
`inputs/raw/brand/streamline-logo.png` is committed, it can be:

- Sample the wordmark's reds properly — dominant hex, the spread, and how it relates to
  `#DA2128` and to the retired `#D42E12`. Commit the sampling script so row 11 becomes a
  reproducible claim rather than a remembered one.
- Produce a usable interim asset set from the 2048×566 master: trimmed, transparent, retina
  sizes, plus a light-on-dark treatment for the `#1A1A1A` sidebar. A vector still has to come
  from Eric (PLAN §12) — an interim raster is not a substitute, and **do not trace or
  regenerate a vector**: an approximated logo is invented brand.

### 5.4 Live link-check sweep

PLAN §9 requires every legacy URL to resolve 200/301/intentional-410, and
`legacy-slugs-finding.md` says outright that its 73 rows are a work list, not verified URLs.
That check needs HTTP from a machine, so it is yours:

- The **73 rows** of `inputs/derived/legacy-slugs.tsv` — what does each actually return today,
  and where does it land? Especially the **11 `SKIP` rows**: confirm each currently serves 200
  as its own live project, which is the whole reason they must never be redirected.
- The **58 project URLs** and the **10 real pages**.
- `/sample-page/` and `/1248-2/` — confirm they are live today and are genuinely litter.
- The two slug-correction candidates: `/commercial/upper-east-side-townhouse/` (WP 564) and
  `/commercial/autrium-corporate-office/` (WP 558), plus what
  `/commercial/washington-sq-dermatology/` and `/commercial/atrium-corporate-office/` do right
  now.

This is measured-from-live: date every row, record the command, and note that the table is a
snapshot. Be gentle — a sequential sweep with a small delay, not a flood; it is the client's
production site.

While you have HTTP: the Builder prototype in DESIGN §9's kill-list was verified live on
20 Aug. If it is still up, confirm the kill-list is still accurate, since Grok is building
against it.

### 5.5 Make the dump's backup verifiable

PLAN §7 records the cold backup as satisfied by the ~12 GB dump on this laptop, with a
standing instruction to keep a second copy elsewhere. One laptop is one disk failure. A
checksum manifest of the **887 referenced files** (about 100 KB of text) makes any future copy
verifiable, and makes "the backup is intact" a checkable claim instead of a hope. Record the
dump's own totals — file count, bytes — while you are there.

### 5.6 Videos — ask Alexey for them

**The dump contains zero video files** — no `.mp4`, `.mov`, `.webm`, `.m4v` anywhere in
`wp-content/`. Confirm that independently. It means two of the four homepage variants
(non-scrolling video loop, scrolling video hero) cannot be built or even mocked from anything on
this machine, and the `video` doc type has no content at all.

**So ask Alexey for the video files. Directly, early, and before you plan around their
absence** — this is the one input in your lane that a question can unblock in a day, and PLAN §5
makes video half the homepage variant set. Ask him for:

1. **The files themselves**, and where to put them — they are large binaries, so they do *not*
   go in this repo (§8). A local path outside the repo, with an inventory committed instead.
2. **Whether the end logos are stripped.** PLAN §12 records the ask to Eric as "video files
   without end logos" — the existing cuts apparently end on a logo card that the site's
   variants can't use.
3. **Hosting preference** — self-hosted vs YouTube vs Vimeo. The `video` doc type in PLAN §8 is
   modelled around a YouTube ID and a poster frame, so if the answer is self-hosted, that is a
   schema question for Grok rather than an asset question for you.
4. **Which video goes where** — homepage loop vs hero vs a project page, and whether any of them
   is project-specific.
5. **Poster frames** — or permission to pull a frame from the file, which you can do locally.

If he has them: inventory each one — filename, duration, dimensions, codec, bitrate, size,
sha256, whether it loops cleanly, whether it has audio, and whether the end logo is present —
into `content/video-inventory.tsv`, and note which homepage variants become buildable. If he
doesn't have them yet, say so plainly in your session log and in `STATUS.md` so the two video
variants stay visibly unbuilt rather than quietly forgotten.

---

## 6. Track C — review Grok's handoff

When Grok finishes a phase it produces a handoff; Alexey will point you at it (expect it under
`workorders/handoffs/`). Your job is an **adversarial** review, not a proofread: try to refute
each claim, and only report what survives.

- **Reproduce, don't accept.** Run the gates yourself: `npm run build`, `npm run dev`, TypeGen
  currency, the kill-list greps, the retired-hex grep over built CSS, the contrast values, the
  three widths (390 / 768 / 1440), the lightbox on a keyboard (Esc, arrows, focus trap, title
  announced), `prefers-reduced-motion`. You are the only lane that can actually watch it render.
- **Check the data rules, not just the code:** `roles[]` restricted to the six atoms with
  `roleDetail` populated and no whitespace variants; `architect` null on exactly 8 projects with
  the credit line hidden; `sizeSqFt` numeric on all 58; no duplicate slugs; 27/31 categories;
  Portable Text with no `<p`, `_cdata`, `[object Object]`, links in `markDefs`.
- **Check the redirect layer against `legacy-slugs.tsv`** — the 37 `301` rows wired, **the 11
  `SKIP` rows not wired and still serving their live project**, the 25 `REVIEW` rows escalated
  rather than guessed.
- **Check for invented content hardest of all.** Any rendered fact that doesn't trace to
  `content-inventory.tsv`, `inputs/derived/`, a deck or the live site is a defect, even if it
  looks plausible — especially fabricated alt text, a placeholder phone, or a subCategory
  assigned to one of the 55 unassigned projects.
- **Check the sensitivity rules** in the diff *and* the commit messages: no REFERENCES-block
  contacts, nothing from the July 10 transcript beyond decisions.
- **Check what was skipped.** A silent gap reads as done. Compare Grok's claims against its own
  work order's phase gates.

Output: a review file per handoff with one row per claim — confirmed / not reproduced /
contradicted — each with the command and output that decides it, plus severity. Then propose,
don't patch: **report first, and only cross into Grok's files if Alexey says so**, in separate
commits, because the ownership map (`README.md` §2) exists to keep parallel work mergeable.

---

## 7. Where your output goes

These paths are yours. What goes in them is your call; the names are fixed so the build lane
can depend on them.

| Path | For |
|---|---|
| `workorders/cursor-plan.md` | the executable plan from §0, kept current |
| `scripts/build-image-manifest.mjs` | the manifest builder PLAN §11 step 4 asks for. Node, no network, no credentials; takes the uploads path as an argument |
| `content/images/image-manifest.tsv` | one row per referenced file: attachment ID, project, served path, chosen source path, measured original dimensions, aspect, orientation, hero-capable, notes |
| `content/images/alt-text.tsv` | attachment ID, project, alt text, confidence, flag-for-review |
| `content/images/checksums-887.tsv` | sha256 per referenced file (§5.5) |
| `content/images/partners/` | the manifest of verified firm names, plus `reference/` crops labelled not-for-publication (§5.2) |
| `content/video-inventory.tsv` | whatever Alexey sends: filename, duration, dimensions, codec, bitrate, size, sha256, loops cleanly, has audio, end logo present (§5.6). The files themselves stay out of the repo |
| `content/images/brand/` | the logo sampling report and interim raster set (§5.3) |
| `content/images/README.md` | what each file is, how to regenerate it, what a reviewer should check |
| `content/deck-corrections.tsv` | OCR string → corrected string, page, confidence (§5.1) |
| `content/link-check/<date>.tsv` | the live sweep, dated (§5.4) |
| `workorders/reviews/grok-<date>.md` | handoff reviews (§6) |
| `content/findings/<topic>-finding.md` | anything that changes what gets built. Template in `content/findings/README.md` |
| `workorders/sessions/<date>-cursor-NN.md` | your session log (§9) |

Label anything that cannot be recomputed from this repo plus the dump, and give it a
reproduction command.

## 8. Hard rules

- **Never commit `wp-content/`, the 887 photographs, or any video file.** ~12 GB against a
  100 MB GitHub file cap, and video is worse. Run `git status` before every commit. The brand
  assets in §5.3 and the small reference crops in §5.2 are the deliberate exception — few,
  small, and needed to build.
- **Never commit the deck PDFs, and never touch the REFERENCES pages** (commercial p41,
  residential p42–43). Architect direct phones and emails never enter this repo in any form —
  not as an extract, a screenshot, an OCR line, or a note.
- **Never filter on WordPress's attachment parent.** 137 of the 880 are `post: 0` and are live
  photography. The filter is "referenced by `project_gallery` or `_thumbnail_id`", always.
- **Never upscale, AI-enhance, retouch, or generate imagery, or trace a vector logo.**
  Streamline's own photography and Eric's own logo only. A generated pixel is invented content
  (DESIGN §9). If a project's best image is 640×295, that is a fact to report, not a problem to
  fix.
- **Never point production at the legacy WordPress CDN.**
- **Don't hand-edit `inputs/derived/**` or `content/image-audit.tsv`.** Change a script, or
  propose a row. `inputs/raw/` is immutable.
- **Stay in your lane** — `app/**`, `sanity/**`, `PLAN.md`, `DESIGN.md`, `CLAUDE.md` are not
  yours (`README.md` §2). §6 reviews report; they don't patch.
- **Be gentle with the live site.** Sequential requests with a delay. It is production.
- **Local commits only; do not push** (CLAUDE.md).

## 9. Progress protocol — non-negotiable

The point is that Alexey can come back after a week and see exactly where things stand.

- **Commit at every checkpoint**, not at the end. A completed alt-text batch, a finished
  sweep, a working script — that is a commit.
- **Before you stop**, three things: commit; write
  `workorders/sessions/<date>-cursor-NN.md` from the template in that directory; update
  `workorders/STATUS.md` (**Last updated**, **In flight**, **Next up**).
- **Nothing important stays in chat.** Findings go to `content/findings/`, decisions to your
  session log as *proposed* PLAN rows, numbers into a committed file with a reproduction
  command. If it only exists in a conversation, it is already lost — that has happened on this
  project once (COWORK.md §0).
- **Say what you skipped**, in the session log, every time.

## 10. Done looks like

The gates that are yours, answerable from your output alone:

- [ ] `workorders/cursor-plan.md` committed before execution began, and current
- [ ] **887 image assets accounted for; every drop explained**, and the 137 `post: 0` present
- [ ] The **8 featured-outside-gallery projects resolve a real `heroImage`**
- [ ] Every migrated image has descriptive alt text; no filename-as-alt anywhere
- [ ] Hero-capability re-stated from measured originals, with the change from 34/58 explained
- [ ] The four all-square and six unusable-at-full-bleed projects have a measured basis for
      their DESIGN §8 treatment
- [ ] `scripts/build-image-manifest.mjs` runs clean from a fresh checkout plus the dump, and
      re-verifies the 1,763 / 791 / 388 / 137 figures
- [ ] Deck strings that will ship are verified against the page images, corrections filed
- [ ] The logo wall's firm names read off the page rather than off OCR, reference crops filed,
      and publishable artwork raised as an ask
- [ ] Alexey has been asked for the video files, and the answer is recorded either way
- [ ] `#DA2128` is a reproducible measurement, not a remembered one
- [ ] Every one of the 73 legacy URLs has a dated live status, and the 11 `SKIP` rows are
      confirmed to serve 200
- [ ] The 887 have a checksum manifest, so a second copy of the dump is verifiable
- [ ] Output greps clean for `[object Object]`, `undefined`, `null`, and the DESIGN §9
      kill-list strings
- [ ] `STATUS.md` and a session log reflect all of the above

## 11. When something doesn't add up

1. A number in `PLAN.md` or a companion file is wrong → write a finding, propose a PLAN §1 row
   in your session report, and say it plainly. Do not quietly correct the document.
2. Two sources disagree about an image or a project → propose a `content/source-conflicts.md`
   row. Don't pick a winner inline (COWORK.md §4).
3. You are blocked on a person → check `README.md` §5, note it, and keep going on everything
   that isn't blocked. Finish the rest in full and list what you left out.
4. A rule in §8 makes the work impossible → stop and say so. Don't route around it.
