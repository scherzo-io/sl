# Cursor plan — local lane, bar B

Living plan for `cursor/images`. Written 2026-08-20 before execution. Update it when
reality corrects it.

**Bar:** B — unblock Grok's seams (measure, manifest, checksums, hero, partner names,
brand sample, live link-check, deck corrections that will ship) plus the video ask.
**Out:** Sanity ingest / `_sanityAsset` / project tokens; the 887-image alt-text pass;
876 unused-library characterisation; client-PNG dedupe; Builder kill-list re-check.

---

## Options considered

1. **Serial Cursor solo** — safest, too slow.
2. **Parallel specialist seats + thin GPT review (chosen).** Three builders own
   disjoint Track A/B chunks; 2–3 GPT seats spot-check once; then wait on Grok.
3. **Full council on every artifact** — rejected; burns the session.

Rejected earlier: bar A (too thin — Grok's SEO phase needs the link-check) and
bar C (starts 887 vision writes before a handoff exists).

---

## File map (Cursor-owned; names fixed)

| Path | Owner seat | What |
|---|---|---|
| `scripts/build-image-manifest.mjs` | A | Node, no network, uploads path as argv |
| `content/images/image-manifest.tsv` | A | 887 rows, measured originals |
| `content/images/checksums-887.tsv` | A | sha256 of chosen source file |
| `content/images/README.md` | A | regenerate + reviewer check |
| `content/link-check/<date>.tsv` | B | dated live sweep |
| `content/deck-corrections.tsv` | C | OCR → corrected, page, confidence |
| `content/images/partners/` | C | verified names + `reference/` crops |
| `content/images/brand/` | C | sampling report + interim rasters |
| `content/video-inventory.tsv` | C / parent | two WhatsApp reels landed 2026-08-20; binaries live outside the repo |
| `workorders/reviews/grok-<date>.md` | parent | after Grok hands off |
| `workorders/sessions/<date>-cursor-NN.md` | parent | session log |
| `content/findings/<topic>-finding.md` | whoever | only if a PLAN number moves |

Do not write `app/**`, `sanity/**`, `content/eric-email.md`, `content/pages/**`,
`content/copy/**`, `PLAN.md` §1, `DESIGN.md`, `CLAUDE.md`. Do not hand-edit
`inputs/derived/**` or `content/image-audit.tsv`. Do not commit `wp-content/`,
photographs, videos, or the deck PDFs.

---

## Execution order

```
Phase 0  branch + wxr --uploads (0 failures) + this file
Phase 1  Wave 1 in parallel (A, B, C) then light GPT review then commit
Phase 2  idle / watch workorders/handoffs/  (do not cross lanes)
Phase 3  light adversarial review of Grok handoff
Phase 4  leftover sweep + Claude Code handback
```

Dependencies: A, B, C have none on each other. Phase 3 waits on Grok. Alt-text
is a later pass and is not this plan.

---

## Phase 0 — start (done this session)

```bash
git checkout -b cursor/images
python3 scripts/wxr-extract.py --uploads wp-content/uploads   # assertions failed: 0
git checkout -- inputs/derived     # --uploads dirties the committed extracts
```

Committed extracts stay the no-flag output. `--uploads` is verification only.

---

## Phase 1 — Wave 1 seats

### Seat A — manifest / measure / checksums / hero
**Model:** Grok 4.5 high-fast

Write `scripts/build-image-manifest.mjs`:

- Args: uploads root (default `wp-content/uploads`).
- Input: `inputs/derived/project-images.tsv` (887 rows).
- For each row, open the **chosen source**: `original_file` when
  `has_larger_original=yes`, else `file`. Never an Imagify `.webp`.
- Measure true pixel width/height off disk (macOS `sips` or a header parse;
  do not trust WXR `width`/`height` for the 388 with larger originals).
- Emit TSV columns at least:
  `attachment_id`, `project_slug`, `served_path`, `source_path`,
  `measured_w`, `measured_h`, `aspect`, `orientation`, `hero_capable`,
  `featured_only`, `parent_is_zero`, `notes`
- Hero rule (state it in README): `measured_w >= 1920` and not a known
  unusable-at-full-bleed exception unless the original actually upgrades it.
  Re-state hero-capable project count vs PLAN's 34/58 and EXTRACT-REPORT's
  35/58 (widest gallery ≥1920). Write a finding only if the count moves.
- Confirm the 8 featured-outside-gallery projects resolve a real source
  file: Free People, Hudson St Penthouse, Madison Ave Duplex, St Luke's
  Place, West 23rd Townhouse, Indeed, Atrium (`autrium-corporate-office`),
  700 Park Ave.
- Re-verify 1,763 / 791 / 388 / 137 from disk + TSV (library image records
  are 1,763 image mimes of 1,764 attachments).
- `content/images/checksums-887.tsv`: `attachment_id`, `source_path`, `sha256`, `bytes`.
- `content/images/README.md`: how to regenerate, what to check.
- Also record dump totals (file count, bytes) in the README or a finding —
  that is the backup-integrity claim.

Checkpoints: script runs clean → commit; TSVs land → commit.

### Seat B — live link-check
**Model:** Grok 4.6 high-fast

Gentle sequential HTTP against `https://streamlineusa.com` with a small delay
(production). Date every row. Record the command.

Sweep:

1. All 73 rows of `inputs/derived/legacy-slugs.tsv` — status, final URL.
   Especially the 11 `SKIP` rows: confirm each currently serves 200 as its
   own live project.
2. 58 project URLs (`/commercial/<slug>/` or `/residential/<slug>/`).
3. 10 real pages (from `inputs/derived/pages/` minus litter).
4. `/sample-page/` and `/1248-2/` (litter; expected still live).
5. `/commercial/upper-east-side-townhouse/` (WP 564),
   `/commercial/washington-sq-dermatology/`,
   `/commercial/autrium-corporate-office/` (WP 558),
   `/commercial/atrium-corporate-office/`.

Output: `content/link-check/2026-08-20.tsv`. Columns at least:
`url`, `verdict_in_tsv`, `http_status`, `final_url`, `ok`, `notes`.
Label **measured-from-live, 2026-08-20**. Skip if a request hangs; log it.

Do **not** flood. Sequential + ~300–500 ms delay.

### Seat C — decks, partners, brand, video ask
**Model:** Composer 2.5 fast

**Video (do first, one question to Alexey):** files, where to put them (outside
the repo), end-logo status, hosting (self / YouTube / Vimeo), which variant
each is for, poster frames. Confirm independently that `wp-content/` has
zero `.mp4/.mov/.webm/.m4v`. Record the ask + answer in STATUS / session
log. Inventory TSV only if files arrive.

**Deck corrections** — read the page, do not re-OCR. Decks live at
`~/Downloads/Zipcodes/Streamline USA/Sample Portfolios_Streamline/`:
`Commercial Portfolio .pdf` (43 pp), `Open Full residential 32824.pdf` (44 pp).
Toolchain: poppler + `.venv` PyMuPDF/Pillow. **Never open or extract
commercial p41 or residential p42–43** (REFERENCES block).

Ship-strings only, into `content/deck-corrections.tsv`
(`ocr_string`, `corrected`, `deck`, `page`, `confidence`):

- Commercial p3 proof points + six services
- Commercial p2 partner bios (scrub direct contacts)
- Five named testimonials + attributions (Antonio Di Oronzo / Bluarch spelling)
- Commercial p42 firm names on the logo wall
- Residential case-study titles that will ship (Lantern House, The Pierre, …)

Do not rewrite `content/deck-transcripts/*`.

**Partners:** verified name list + native-resolution reference crops in
`content/images/partners/reference/`, labelled not-for-publication.
No upscale, no trace. Publishable artwork is an ask, not a task.

**Brand:** sample `inputs/raw/brand/streamline-logo.png`. Dominant red,
spread, relation to `#DA2128` and retired `#D42E12`. Commit the sampling
script (stdlib or venv, recorded here). Interim rasters in
`content/images/brand/`: trimmed, transparent, retina, light-on-dark for
`#1A1A1A`. Do not trace a vector.

### Light review (after Wave 1)
**Model:** GPT-5.6-sol ×2–3, one pass each, report only

1. Manifest counts vs 887 / 388 / 137 / 8 featured-outside-gallery.
2. Link-check: 73 rows present, SKIP rows 200, no flood leftovers.
3. Deck/partner/brand: no REFERENCES pages, no invented names, `#DA2128`
   claim is reproducible.

No re-do loops. Parent merges, commits, updates STATUS + session log.

---

## Phase 2 — wait for Grok

Watch `workorders/handoffs/` and `grok/build`. Do not edit Grok-owned paths.
Alt-text batches are a separate follow-on if idle time stretches.

---

## Phase 3 — Grok handoff review (light)

Reproduce only cheap claimed gates: greps, `npm run build` if a scaffold
exists, redirect wiring vs SKIP/301, invented-content spot-check,
sensitivity in diff + messages. Viewport/lightbox marathon only if the
handoff claims UI ready.

Write `workorders/reviews/grok-<date>.md`. Report; do not patch.

---

## Phase 4 — leftover + Claude Code handback

Diff STATUS / PLAN §11 vs the repo. Session log **Next step** is the single
most useful Claude Code action. STATUS **Next up** lists: Eric email send,
Sanity project (later), alt pass, merge strategy. No speculative fixes.

---

## What this plan is deliberately not doing

| Skip | Why |
|---|---|
| Sanity ingest / `_sanityAsset` / TypeGen against a dataset | Alexey: no project yet; this run forbids it |
| 887 alt-text | Largest job; wait until after Grok handoff / a later pass |
| 876 unreferenced + `uploads/backup/` glance | Out of migration scope; not on Grok's critical path |
| Ten client PNGs in `~/Downloads/.../Images_Streamline/` | Finding-only, not blocking |
| Builder kill-list re-verify | Already measured 20 Aug; not this bar |
| Push | CLAUDE.md — local commits only |
| Commits to `main` | Lane branch only |

---

## Tooling (already on this machine)

| | |
|---|---|
| poppler | `pdfimages`, `pdftoppm`, `pdftotext`, `pdfinfo` |
| `.venv` | PyMuPDF 1.28.2, pypdf 6.16.1, Pillow 12.3.0 |
| Also | tesseract, sips, node, npm, python3 3.13.5 |

Repo scripts stay dependency-free (`build-image-manifest.mjs` = Node stdlib +
`sips` for pixels). New venv packages get recorded here if added.

---

## Alt-text (deferred — cost note for later)

887 vision passes. Batch by project (~10–20 images). Commit each batch.
Pattern: `<Project name> — <room/space>, <notable feature>`. Flag rather
than guess. Not this session.

---

## Checkpoints

1. This file committed on `cursor/images` before Wave 1.
2. Each seat's artifacts committed as they land (not one mega-commit).
3. After light review: STATUS + `workorders/sessions/2026-08-20-cursor-01.md`.
4. After Grok review: review file + STATUS.
5. Before stop: session log + STATUS current, `git status` clean of keepers.
