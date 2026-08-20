# Work order — Cursor — the image set

**Lane:** everything about Streamline's photography. **Nothing else.**
**Where:** locally in `~/sl`, on branch `cursor/images`.
**Why you:** you are on the machine that holds the ~12 GB WordPress dump, and you can look at
a photograph. Nobody else in this build can do either.

Read `workorders/README.md` §1 first — the read order and the rules that bind both lanes are
there and are not repeated here.

---

## 1. Mission

Turn 887 files sitting in a git-ignored WordPress dump into a migration-ready image set:
known provenance, true resolution, real alt text, and an honest ledger of what is and isn't
usable. The site being built is nothing but full-bleed photography — the image set *is* the
product, and everything downstream waits on it.

**You decide the scope, sequence and method within this lane.** §4 lists the territory and
what is already known; how much of it you take on, in what order, with what tooling, and how
you batch the expensive parts is your call. Two things are not your call: the hard rules in
§6, and the file paths in §5 (they are fixed so the other lane can depend on them).

## 2. First fifteen minutes

```bash
git checkout -b cursor/images
python3 scripts/wxr-extract.py --uploads wp-content/uploads   # must print: assertions failed: 0
sed -n '/## Disk cross-check/,$p' inputs/derived/EXTRACT-REPORT.md
head -3 inputs/derived/project-images.tsv | column -ts$'\t'
```

If `assertions failed` is anything but `0`, stop and report — the ground moved under this work
order and a human needs to look before you build on it.

## 3. What you are working from

| Input | What it is |
|---|---|
| `wp-content/uploads/` | the dump. 25,750 image files: 11,504 `-WxH` derivatives, 1,578 `-scaled` copies, 9,611 imagify `.webp`, 3,845 candidate originals. Git-ignored, read-only, never committed |
| `inputs/derived/project-images.tsv` | **your work list.** The 887 referenced files, one row each: attachment ID, project, gallery position, served path, original path, `has_larger_original`, WordPress-recorded dimensions, square flag, alt, WP parent, and on-disk presence |
| `inputs/derived/attachments.tsv` | all 1,764 media-library records — the 876 unreferenced ones included |
| `content/image-audit.tsv` | the 19 Aug per-project audit. Agrees with the export everywhere except `median_w` on four projects (see §4.6) |
| `content/originals-finding.md` | the hidden-originals finding and the migration filter rule |
| `content/findings/wxr-export-finding.md` | why all of the above is now reproducible offline |
| `~/Downloads/Zipcodes/Streamline USA/Images_Streamline/*.png` | ten 2048×2048 client-supplied PNGs sitting outside the WordPress library entirely (§4.7) |

### The baseline, verified 2026-08-20 — reproduce it, don't re-derive it

| | |
|---|---|
| Gallery images (`project_gallery`, all 58 projects) | 880 — no image is shared between projects |
| Featured images (`_thumbnail_id`) | 58, of which **7 appear in no gallery at all** |
| **Migration set = the union** | **887 unique files** |
| Present on disk, served copy | **887 / 887** |
| Present on disk, true original | **887 / 887** |
| With a larger original than WordPress serves | 387 of the 880 gallery + 1 of the 7 featured-only = **388** |
| Library-wide with larger originals | 791 of 1,763 image records |
| Gallery images WordPress records as `post: 0` | **137** — all real photography |
| ≥1920px wide · ≥2048px · square | 445 · 259 · 74 |
| Hero-capable projects | 34 of 58 |
| Referenced files with usable alt text | **0** (see §4.4) |

Nothing referenced is missing locally. The dump's empty `2021/`, `2024/`, `2025/`, `2026/`
directories are not a gap — the newest project images were uploaded in 2023.

## 4. The territory

### 4.1 True original dimensions — the one thing the export cannot tell us

`_wp_attachment_metadata` records the dimensions of the copy WordPress *serves*. For the 388
files with an `original_image`, those numbers describe the scaled copy, not the original. The
real dimensions exist only on disk. Measured probes range 3.5×–7× the served pixel count
(Mint Kitchen 2048×1366 served, 5600×3733 on disk).

Everything downstream — which projects can carry a full-bleed hero, how the square problem
gets solved, what `next/image` gets to work with — depends on measuring those 887 files
rather than trusting the metadata.

### 4.2 Original resolution rule

Prefer the hidden full-size original: strip WordPress's `-scaled` and `-WxH` suffixes, and
use `original_file` from `project-images.tsv` where `has_larger_original = yes`. Never the
imagify `.webp` derivatives — Sanity generates its own. `content/originals-finding.md` has
the details and the five projects where 640px really is the original.

### 4.3 Hero re-verification

PLAN §7 puts hero-capability at 34 of 58 and expects the originals to change quality, not
count. Confirm or correct that from measured pixels. Specifically named:

- **Entirely square, 2048×2048, and the newest/best work:** Lantern House, 795 5th Ave (The
  Pierre), 652 Hudson, 40 E 66th. DESIGN §8 lists four deliberate treatments — your job is
  the measured input to that decision, not the decision.
- **Unusable at full-bleed:** 12th St Townhouse (all 12 at 640×295), E63rd St Penthouse
  (640×392), Lexington Ave Townhouse (599×399), West 23rd Townhouse (990px), Horatio St
  Townhouse (990px), plus the Free People and Spring Studios featured images.
- **Exactly one upgradeable image out of 6–17:** Free People, Spring Studios, St Luke's
  Place, Madison Ave Duplex, Gunter Seeger.
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

Write what is in the frame. Do not infer a room type you cannot see, do not name materials
you are guessing at, and do not carry a claim from the project description into alt text for a
photograph that does not show it — that is inventing content (DESIGN §9). Where a frame is
genuinely ambiguous, describe it plainly and flag the row rather than guessing well.

`inputs/derived/projects/<slug>.md` gives you each project's own description, location, role
and credits — useful context for naming spaces, not a licence to assert.

887 vision passes is the largest single job in this build. Batch it however you like; the only
requirement is that the output is reviewable row by row and that you say what you skipped.

### 4.5 The 876 unreferenced library images

1,763 image records, 887 referenced, **876 referenced by no project**. PLAN §7 and
`originals-finding.md` both say these are worth a look before concluding a project's
photography is limited to what's currently linked — they could be alternate takes, unused
shoots, or junk. They are out of migration scope; a rough characterisation (per-project
candidates vs plugin/theme junk) is worth having, and would directly help the projects whose
photography is too small for a hero.

### 4.6 Four `median_w` disagreements

`content/image-audit.tsv` and the export differ on `median_w` for `kat-theo` (1860 vs 1857),
`free-people-retail-store` (1107 vs 868), `hudson-street-penthouse` (1280 vs 1211) and
`madison-ave-duplex-2` (1027 vs 982). Everything else matches on all 58 projects. Likely a
median-of-even-set convention; confirm it is only that, and if it is something real, write a
finding. `image-audit.tsv` is Alexey's file — propose, don't rewrite.

### 4.7 Ten client PNGs outside the library

`~/Downloads/Zipcodes/Streamline USA/Images_Streamline/` holds ten 2048×2048 PNGs (~52 MB) and
the logo master. The squares are the same size as the four all-square projects' galleries.
Are they duplicates of images already in the 887, better versions of them, or photography
that never made it onto the site? Worth answering — and the answer stays a text finding.
Those PNGs are not committed.

### 4.8 The upload set

Sanity ingests via `_sanityAsset` with an original URL, server-side, so production never
points at the legacy WordPress CDN. A deduped, best-resolution set of the 887 with alt text
attached is what the migration consumes. Writing the ingest script is fine; **running it needs
a Sanity project and write token that do not exist yet** (`workorders/README.md` §5) — build
it to be runnable, don't wait on it, and don't fake it.

## 5. Where your output goes

These paths are yours. What goes in them is your call; the names are fixed so the build lane
can depend on them.

| Path | For |
|---|---|
| `scripts/build-image-manifest.mjs` | the manifest builder PLAN §11 step 4 asks for. Node, no network, no credentials; takes the uploads path as an argument |
| `content/images/image-manifest.tsv` | one row per referenced file: attachment ID, project, served path, chosen source path, measured original dimensions, aspect, orientation, hero-capable, notes |
| `content/images/alt-text.tsv` | attachment ID, project, alt text, confidence, flag-for-review |
| `content/images/README.md` | what each file is, how to regenerate it, what a reviewer should check |
| `content/findings/<topic>-finding.md` | anything you discover that changes what gets built. Template in `content/findings/README.md` |
| `scripts/` (asset ingest) | the `_sanityAsset` ingest script, if you get there |

Label anything that cannot be recomputed from this repo plus the dump, and give it a
reproduction command. Do not put image binaries in the repo.

## 6. Hard rules

- **Never commit `wp-content/`, or any image binary, anywhere.** ~12 GB against a 100 MB
  GitHub file cap. It is git-ignored; keep it that way. Run `git status` before every commit.
- **Never filter on WordPress's attachment parent.** 137 of the 880 are `post: 0` and are live
  photography. The filter is "referenced by `project_gallery` or `_thumbnail_id`", always.
- **Never upscale, AI-enhance, retouch, or generate imagery.** Streamline's own photography
  only. A generated pixel is invented content (DESIGN §9). If a project's best image is
  640×295, that is a fact to report, not a problem to fix.
- **Never point production at the legacy WordPress CDN.**
- **Don't hand-edit `inputs/derived/**` or `content/image-audit.tsv`.** Change a script, or
  propose a row.
- **Stay in your lane** — `app/**`, `sanity/**`, `PLAN.md`, `DESIGN.md`, `CLAUDE.md` are not
  yours (`workorders/README.md` §2).
- **Local commits only; do not push** (CLAUDE.md).
- Everything lands in the repo before the session ends (COWORK.md §1). Work that exists only
  in a chat session is already lost — that has happened here once.

## 7. Done looks like

The image-side CLAUDE.md gates, answerable from your output alone:

- [ ] **887 image assets accounted for; every drop explained**, and the 137 `post: 0` present
- [ ] The **8 featured-outside-gallery projects resolve a real `heroImage`**
- [ ] Every migrated image has descriptive alt text; no filename-as-alt anywhere
- [ ] Hero-capability re-stated from measured originals, with the change from 34/58 explained
- [ ] The four all-square projects and the six unusable-at-full-bleed projects have a measured
      basis for their DESIGN §8 treatment
- [ ] `scripts/build-image-manifest.mjs` runs clean from a fresh checkout plus the dump, and
      re-verifies the 1,763 / 791 / 388 / 137 figures
- [ ] Output greps clean for `[object Object]`, `undefined`, `null`, and the DESIGN §9
      kill-list strings

## 8. When something doesn't add up

Escalate rather than absorb it:

1. A number in `PLAN.md` or a companion file is wrong → write a finding, propose a PLAN §1
   row in your session report, and say it plainly. Do not quietly correct the document.
2. Two sources disagree about an image or a project → propose a `content/source-conflicts.md`
   row. Don't pick a winner inline (COWORK.md §4).
3. You are blocked on a person → check `workorders/README.md` §5, note it, and keep going on
   everything that isn't blocked. Finish the rest in full and list what you left out.
4. A rule in §6 makes the work impossible → stop and say so. Don't route around it.
