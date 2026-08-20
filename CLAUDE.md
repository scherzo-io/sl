# CLAUDE.md — build rules for streamlineusa.com

Read `PLAN.md` first; §1 is the decision table and it wins over anything here. This file is
the operational rulebook for code sessions. `DESIGN.md` owns visuals; `COWORK.md` owns
session protocol.

## Stack & repo

- Next.js App Router · TypeScript · Tailwind · Sanity (embedded Studio at `/studio`)
- Vercel hosting; `production` + `staging` Sanity datasets; migrations dry-run against staging
- Never commit: `wp-content/` (an ~11 GB dump may appear locally — `.gitignore` blocks it;
  keep it out of the repo folder anyway), `.env*`, `node_modules/`
- Local commits fine; **do not push** without Alexey. Remote is `scherzo-io/sl` (private)

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
- Every image gets descriptive alt text at migration (878/880 currently missing). Pattern:
  "<Project name> — <room/space>, <notable feature>". No filename-as-alt
- `next/image` everywhere; `object-cover`; tiles keep native aspect ratios

## URLs, redirects, SEO

- Preserve `/commercial/<slug>/` and `/residential/<slug>/` exactly
- `/sample-page/`, `/1248-2/` → **410**
- WP 564 `upper-east-side-townhouse` → `/commercial/washington-sq-dermatology/` + **301**
  (pending Eric's confirm — PLAN §1 row 16); use the `redirect` doc type
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
- [ ] `sizeSqFt` numeric on all 58
- [ ] No duplicate slugs; every category/person reference resolves
- [ ] Output greps clean: `<p`, `_cdata`, `[object Object]`, `555-1234`, `456-7890`,
      `123 Construction`, `Hello world`
- [ ] Contrast: red text on white is `#DA2128`; red normal text on `#1A1A1A` is `#E25257`;
      no retired reds in CSS output
- [ ] All three directions render at 390 / 768 / 1440; lightbox keyboardable;
      `prefers-reduced-motion` respected
- [ ] Every legacy URL resolves 200 / 301 / intentional 410
- [ ] `npm run dev` and `npm run build` clean; TypeGen current
