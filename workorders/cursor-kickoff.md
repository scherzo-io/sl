# Cursor kickoff — paste this as the first message

Copy everything below the line into a new Cursor Agent chat with `~/sl` open.

---

You are Cursor on the Streamline USA rebuild. You are the **local lane**.

**Repo:** `~/sl`
**Your branch:** `cursor/images` — create it from `grok/build`, not from `main`.
**Your work order:** `workorders/cursor-images.md` (binding; this prompt does not replace it)
**Grok's handoff:** `workorders/handoff-to-cursor.md`
**Where things stand:** `workorders/STATUS.md`
**How to review Grok:** `workorders/reviews/README.md`
**Decisions that win:** `PLAN.md` §1, then `CLAUDE.md`, then `DESIGN.md` §9 kill-list

## Stop. Do not execute yet.

`cursor-images.md` §0 is non-negotiable:

1. Brainstorm the work order. Argue with it. Note what is wrong, over-specified, or in the wrong order.
2. Commit `workorders/cursor-plan.md` — executable by someone who is not you: task list in order with dependencies, how you batch the 887 alt-text pass, tools, checkpoints, what you are deliberately not doing, options you rejected.
3. Then execute, updating the plan as reality corrects it.

A session that starts measuring 887 files before that plan exists has already failed.

## First fifteen minutes

```bash
cd ~/sl
git status
git log --oneline -5
cat workorders/STATUS.md
```

`grok/build` is **not on GitHub** (remote is public; neither lane pushes). `main` / `origin/main` is `347aea5` and does **not** contain the site. If `git rev-parse grok/build` fails:

- Fetch the bundle Alexey has (`git fetch grok-build.bundle grok/build:grok/build`), or
- Stop and tell him you do not have `grok/build`. Do not review against `main`. Do not invent the branch.

Once `grok/build` is present (`1c85bb9` or later):

```bash
git checkout grok/build
git checkout -b cursor/images
python3 scripts/wxr-extract.py --uploads wp-content/uploads
# must print: assertions failed: 0
# --uploads dirties inputs/derived on purpose:
git checkout -- inputs/derived
cat workorders/handoff-to-cursor.md
```

If assertions failed ≠ 0, stop and report. The ground moved.

PDF toolchain is already installed (poppler, `.venv` with PyMuPDF / pypdf / Pillow). Do not shop.

## Hard rules (you will be checked)

- Never commit `wp-content/`, photographs, video, deck PDFs, or client PNGs.
- Never touch commercial p41 / residential p42–43 (REFERENCES: architect phones and emails).
- Never filter on attachment parent. 137 gallery images are `post: 0`. Filter is always `project_gallery ∪ _thumbnail_id` = **887**.
- Never upscale, AI-enhance, retouch, generate imagery, or trace a logo.
- Never invent a value. DESIGN §9. Unresolved conflict = skip the field.
- Do not write `app/**`, `sanity/**`, `PLAN.md`, `DESIGN.md`, `CLAUDE.md`, `scripts/import-*`.
- Reviews **report**; they do not patch Grok. Alexey assigns fixes.
- Be gentle with streamlineusa.com — sequential HEAD with delay, not a flood.
- Local commits only. **Do not push.**
- End every session: commit, `workorders/sessions/YYYY-MM-DD-cursor-NN.md`, update `STATUS.md`.

## Day-one ask (do this in session 01, before you plan around their absence)

Ask Alexey, in chat and in the session log:

1. The video files, and a path **outside** this repo.
2. Whether end logos are stripped.
3. Hosting: self-hosted vs YouTube vs Vimeo (YouTube-ID schema may be wrong).
4. Which clip is homepage loop vs hero vs project.
5. Poster frames, or permission to pull a frame.

If he has them: `content/video-inventory.tsv` (filename, duration, dimensions, codec, bitrate, size, sha256, loops, audio, end logo). Files stay out of git. If he doesn't: say so in `STATUS.md` so the two video homepage variants stay visibly empty.

## Suggested order after the plan (cheapest first — argue if you disagree, in the plan)

1. Video ask (above).
2. Partner **names** off commercial deck p42 → `content/images/partners/`. Not artwork. Unblocks Grok's empty logo wall.
3. Live HEAD of 73 + 11 SKIP still-200 + `/sample-page/` `/1248-2/` + WP 564/558 → `content/link-check/YYYY-MM-DD.tsv`.
4. Adversarial review of Grok E, then G, then H, on a real screen and keyboard. `npm run build` is yours (Grok skipped it). One row per claim in `workorders/reviews/grok-2026-08-20-e.md` (etc.): confirmed / not reproduced / contradicted.
5. Logo master sample + interim rasters → `content/images/brand/`. Do not trace a vector.
6. `scripts/build-image-manifest.mjs` + 887-row `content/images/image-manifest.tsv`. Re-verify 1,763 / 791 / 388 / 137 / 887. This is what blocks Grok Phase F.
7. 8 featured-outside-gallery → real `heroImage`. Madison Ave Duplex: do **not** steal att 727 from 53rd-st-studio; use att 1109.
8. Alt text in committed batches → `content/images/alt-text.tsv`. 887 to write. Boqueria/`Boqueria` and Kat & Theo/`Screen Shot…` do not survive.
9. Deck corrections → `content/deck-corrections.tsv`. Read the page; do not re-OCR.
10. Checksums of the 887; unreferenced-876 finding; ten client-PNG finding; four `median_w` disagreements.

Switch directions for review (public URLs do not change):

- `/?d=a` Faithful · `/?d=b` Depth · `/?d=c` Archive
- `&home=still|stills|video-loop|video-scroll`
- `&nav=reference|partners|split|minimal`
- `&t=quotes|reconsent|decks|logos`

Or the collapsed **Review** control at the bottom of the sidebar.

## Output paths (fixed names — do not invent siblings)

See `cursor-images.md` §7. Surprises go in `content/findings/<topic>-finding.md`.

When the first session ends, `git status` must be clean of binaries, `cursor-plan.md` must exist if you went past brainstorm, and `STATUS.md` must say what you actually did — not what you meant to do.
