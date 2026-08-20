# CLAUDE.md — build rules for streamlineusa.com

Read `PLAN.md` first; §1 is the decision table and it wins over anything here. This file is
the operational rulebook for code sessions. `DESIGN.md` owns visuals; `COWORK.md` owns
session protocol. If you are an agent working one of the two lanes, your work order in
`workorders/` says what is yours; this file says how to build it.

## Stack & repo

- Next.js App Router · TypeScript · Tailwind · Sanity (embedded Studio at `/studio`)
- Vercel hosting; `production` + `staging` Sanity datasets; migrations dry-run against staging
- Never commit: `wp-content/` (an ~12 GB dump is present locally — `.gitignore` blocks it;
  keep it out of the repo folder anyway), `.env*`, `node_modules/`, any image binary, the
  capability deck PDFs (they carry the REFERENCES block — see Hard prohibitions), the
  internal-notes folder, or the website proposal
- Local commits fine; **do not push** without Alexey. Remote is `scherzo-io/sl` (private).
  Lane branches: `cursor/images`, `grok/build`; `main` is Alexey's

## Sources (PLAN §1 row 23)

- **`inputs/raw/` is the source of record and immutable.** The 2026-08-20 WXR export, both
  content workbooks, the 2022 WP All Export CSV, the logo master. Never edit, never regenerate
- **`inputs/derived/` is generated.** Change the script in `scripts/` and re-run; never
  hand-edit an extract. `python3 scripts/wxr-extract.py` must print `assertions failed: 0` —
  it checks 17 numbers against PLAN.md, and a failure means a human looks before anything
  downstream runs
- A number in this repo must recompute from this repo. Anything that can only come from the
  live site is labelled measured-from-live, dated, with a reproduction command (COWORK §3)
- Structure, ACF values, page copy, the media library, the menu and the retired-slug history
  all come from the export — no authenticated WordPress session is needed for any of it

## Sanity conventions

- `defineType` / `defineField` / `defineArrayMember` for every schema
- Run schema extract + **TypeGen after every schema or GROQ change**; deploy schema before
  pointing content tooling at a dataset
- Deterministic document IDs from WordPress IDs: `project-<wpid>`, `page-<slug>`,
  `person-<slug>`, `category-commercial|residential`. Never random IDs for source-backed docs
- Writes are idempotent: `createOrReplace` (or `sanity dataset import --replace`)
- Write order: categories, people → projects, pages (references resolve)
- Rich text → **Portable Text**, never raw HTML. Test on 5 projects before 58. Gates: body is
  a block array; no `<p`, `_cdata`, `[object Object]` anywhere in output; links in `markDefs`;
  empty blocks filtered

## Content rules

- **Registry:** `content/content-inventory.tsv` (58 live + 8 pipeline). If a value conflicts
  with the registry, stop and check `content/source-conflicts.md`. **Unresolved conflict =
  don't migrate that field; flag it.** Never invent a value (DESIGN §9 kill-list)
- **Roles:** `roles[]` = atoms from this exact mapping (trim whitespace first — live data
  contains `" General Contractor"`):

| Raw ACF string (10 exist live) | atoms |
|---|---|
| General Contractor | GC |
| General Contractor + Millwork | GC · Millwork |
| General Contractor/Design Build | GC · Design Build |
| Construction Manager | Construction Management |
| Construction Consultant | Consulting |
| Carpentry + Millwork | Carpentry & Finishes · Millwork |
| Carpentry + Finishes | Carpentry & Finishes |
| Millwork + Finishes | Millwork · Carpentry & Finishes |
| Carpentry Millwork + Finishes | Carpentry & Finishes · Millwork |

  Store the trimmed raw string in `roleDetail`. Allowed atoms (exactly six): General
  Contractor · Construction Management · Design Build · Millwork · Carpentry & Finishes ·
  Consulting
- **Architect:** normalize `""`, `"None"`, `"None Involved"` → null (8 of 58). UI renders the
  credit line only when non-null
- **subCategory:** schema field exists; value list pending Eric (PLAN §1 row 14). Only 3 are
  assigned today — do not guess the other 55
- **Pipeline projects:** create the 8 as **drafts** (unpublished), title-only where that's all
  that exists
- Location strings may need tidying (`"SoHo: 406 Broome St"`, `"Meat Packing District"` vs
  `"Meatpacking District"`) — normalize display, preserve raw in a note field if changed

## Images

- **Migration set = `project_gallery` ∪ `_thumbnail_id` = 887 unique files** (880 gallery +
  7 featured that appear in no gallery). 8 projects have featured ∉ own gallery — handle
  explicitly. **Never filter on attachment-parent**: 137 of the 880 are `post: 0` and are
  real photography
- Prefer the hidden full-size originals (strip WordPress `-scaled`/`-WxH` suffixes; see
  `content/originals-finding.md`); migrate via `_sanityAsset` original URLs so Sanity builds
  derivatives; production never references the legacy WordPress CDN
- **Alt-text gate:** `npm run check:alt` reports coverage and `--strict` fails the migration.
  Until `content/images/alt-text.tsv` exists, photographs render `alt=""` inside a figure
  labelled by the project title — honest, and not invented (PLAN §1 row 39).
- Every image gets descriptive alt text at migration. Pattern:
  "<Project name> — <room/space>, <notable feature>". No filename-as-alt — which makes the
  real count **887 to write, not 885**: the only two images with any alt value carry
  `Boqueria` (the project name) and `Screen Shot 2016-03-02 at 1.48.15 PM` (a filename), and
  neither survives this rule
- The image set is one lane's job (`workorders/cursor-images.md`), working from the committed
  export plus the local dump — all 887 referenced files, and their originals, are present on
  disk. Everything else consumes `content/images/` and never re-derives it
- **The export records the dimensions WordPress *serves*.** For the 388 files with a larger
  original, true dimensions must be measured off disk — never trusted from metadata
- No upscaling, AI enhancement, retouching or generated imagery. Streamline's own photography
  only; a generated pixel is invented content
- `next/image` everywhere; `object-cover`; tiles keep native aspect ratios
- **Serving:** `scripts/link-photos.mjs` symlinks the dump to `public/photos` (git-ignored) and
  `next/image` resizes on demand — no derivative is ever committed. WebP only, deliberately;
  AVIF decoded blank in the review browser. Heroes are `priority`, index tiles stay lazy
  (PLAN §1 row 38)

## URLs, redirects, SEO

- Preserve `/commercial/<slug>/` and `/residential/<slug>/` exactly
- `/sample-page/`, `/1248-2/` → **410**
- WP 564 `upper-east-side-townhouse` → `/commercial/washington-sq-dermatology/` + **301**
  (pending Eric's confirm — PLAN §1 rows 16, 26); use the `redirect` doc type
- WP 558 is live at the typo'd `autrium-corporate-office` — pending Eric (row 27); until he
  answers, preserve it exactly per row 3
- **73 retired project URLs** in `inputs/derived/legacy-slugs.tsv` (PLAN §1 row 25): the 37
  marked `301` become `redirect` docs; the **11 marked `SKIP` are never redirected** — each is
  another project's live slug, and a redirect would take a working page off the site; the 25
  marked `REVIEW` need a human target or an honest 404. Re-run the extractor before cutover —
  adding a project can flip a `301` row to `SKIP`
- Metadata API from the `seo` object; `LocalBusiness` + `GeneralContractor` JSON-LD
  (483 10th Ave Ste 205, NY 10018); sitemap + robots; link-check old vs new before cutover
- GA4 · Search Console · Meta pixel · LinkedIn tag → consent banner (minimal, bottom-anchored)

## Hard prohibitions

- The decks' REFERENCES block (architect names + direct phones/emails, deck C p41 / deck R
  p42) never enters the repo, the CMS, or the site. "References available on request"
- Nothing from the July 10 transcript except decisions: no revenue, marketing-spend, staffing,
  or ownership content in code, CMS, comments, or commit messages
- No invented content (DESIGN §9). No placeholder strings in any rendered path
- Do not edit PLAN §1 rows; supersede them with new rows

## Verification gates (all must pass before handoff)

- [ ] 58 projects (27 commercial / 31 residential), 10 pages, 2 categories, 2 people in Sanity
- [ ] **887 image assets** accounted for; every drop explained; the 137 `post: 0` present
- [ ] The 8 featured-outside-gallery projects resolve a real `heroImage`
- [ ] `roles[]` contains only the six atoms; `roleDetail` populated; no whitespace variants
- [ ] `architect` null on exactly the 8 known projects; credit line hidden for them
- [ ] `sizeSqFt` numeric on all 58 **less the slugs with an open `source-conflicts.md` §A row**
      (6 today: A-1, A-5, A-10, A-11, A-12, A-14 — they render no value at all), and the
      suppressed count is reported, not inferred (PLAN §1 row 36)
- [ ] No duplicate slugs; every category/person reference resolves
- [ ] Output greps clean: `<p`, `_cdata`, `[object Object]`, `555-1234`, `456-7890`,
      `123 Construction`, `Hello world`
- [ ] Contrast: red text on white is `#DA2128`; red normal text on `#1A1A1A` is `#E25257`;
      no retired reds in CSS output
- [ ] All three directions render at 390 / 768 / 1440; lightbox keyboardable;
      `prefers-reduced-motion` respected
- [ ] Every legacy URL resolves 200 / 301 / intentional 410 — including all 73 rows of
      `inputs/derived/legacy-slugs.tsv`. **Each of the 11 `SKIP` slugs terminates at its own
      live project, directly or via one 301, and is never redirected to a different project**
      (PLAN §1 row 35 — 7 of the 11 are 301→200 on production, not 200). The 25 `REVIEW` rows
      take their measured targets from `content/redirect-decisions.tsv` (row 33), and every
      live slug's other-category path 301s to it (row 34)
- [ ] `python3 scripts/wxr-extract.py` prints `assertions failed: 0`
- [ ] `npm run dev` and `npm run build` clean; TypeGen current
