# Streamline USA — Website Rebuild — PLAN

**Prepared for:** Alexey Etcheverry · **Rebuilt:** 20 August 2026
**Site:** streamlineusa.com — Streamline USA LLC, NYC general contractor & construction manager
**Reference:** silverlininginc.com (Eric's, held via the holding company; reuse approved in writing)

This is the single source of truth. Companion documents hold detail, not decisions:

| File | Holds |
|---|---|
| `DESIGN.md` | the design brief — tokens, patterns, three directions, kill-list |
| `CLAUDE.md` | build rules for code sessions |
| `COWORK.md` | session & propagation protocol |
| `silverlining-reference-spec.md` | measured reference capture |
| `content/image-audit.tsv` | per-project image dimensions, all 58 — every total verified |
| `content/content-inventory.tsv` | canonical project registry: 58 live (REST-verified 2026-08-20) + 8 pipeline |
| `content/source-conflicts.md` | every cross-source disagreement, one row each, for Eric |
| `content/originals-finding.md` | hidden high-res originals + the migration filter rule |
| `content/findings/` | one file per research finding |
| `inputs/raw/` | snapshotted sources, immutable: the 2026-08-20 WXR export, both workbooks, the logo master (row 23) |
| `inputs/derived/` | script-generated text extracts of the above — projects, pages, attachments, legacy slugs, workbook sheets |
| `scripts/` | the extractors. Stdlib Python 3, no network, no credentials |
| `workorders/` | the two agent lanes: `cursor-images.md` (everything local) and `grok-build.md` (the build), the ownership map, and `STATUS.md` — the one place that says where the work actually stands (rows 29–30) |

> **Provenance.** The original four-document merge (19 Aug) was never persisted — its output
> existed only in a chat session and is lost. This PLAN was rebuilt 20 Aug from
> `FINAL-PLAN.md` (now deleted), the two recovered 19 Aug drafts, and a full adversarial
> review that re-verified every number against the live REST API, both workbooks, both
> capability decks, the logo master, and the July 10 transcript. §1 records both the
> reconstructed merge decisions and the review's corrections.

---

## 1. Decision table

Settled decisions with reasoning. **Do not silently change a row — add a new row that
supersedes it.** Rows 1–10 reconstruct the 19 Aug merge (labeled R — reconstructed from the
two surviving drafts; the original table is lost). Rows 11–22 are from the 20 Aug review
(labeled V — verified, with evidence). Rows 23–32 are from the 20 Aug source-ingest and
work-order sessions (labeled S — the WordPress export arriving in the repo, what it proved,
how the two agent lanes are scoped, and what the source files can and cannot supply).

| # | Decision | Resolution | Why / evidence |
|---|---|---|---|
| 1 R | Accent colour: open (Eric picks) vs locked | **Locked: red-in-sidebar.** Sidebar `#1A1A1A`, red wordmark + hairline rules, monochrome content area | Option 2 of spec §6; locked in the 19 Aug brief |
| 2 R | Typography: keep Montserrat vs adopt reference | **BenchNine 300, sentence case; Lato body.** Montserrat and uppercase dropped | Faithful to reference; brief locked it |
| 3 R | URLs: `/portfolio/...` (prototype) vs preserve | **Preserve `/commercial|residential/<slug>/` exactly** | Stable since 2022; zero re-indexing risk. See row 16 for the one exception class |
| 4 R | Builder.io prototype: continue vs replace | **Replace.** Next.js build supersedes it; prototype content is invented (see DESIGN §9 kill-list) | Prototype was a layout sketch, not a content source |
| 5 R | `mission`/`challenges`/`lessons_learned`: keep vs drop | **Dropped from schema. `description` only (58/58 filled)** | ~45% fill; deck missions become source material for `description` rewrites, not separate fields |
| 6 R | Scope: Streamline only vs + Silver Lining site | **Streamline only.** Silver Lining build = separate engagement, unconfirmed | Gemini summary ambiguity; row stays until Eric confirms either way |
| 7 R | Design deliverable: 3 sample routes vs fully built | **All three directions fully built**, switchable variants included | Eric judges on his phone with real content |
| 8 R | 10 Elementor pages: WXR parse vs transcribe | **Transcribe from the live pages; no WordPress export needed for launch** | 10 pages, cleaner than a one-use parser; WXR stays optional safety net |
| 9 R | Direction C premise | **Independent, editorial case-study direction** | Portfolio-forward premise folded into it; see DESIGN §6 |
| 10 R | Source-conflict handling: spreadsheet-wins vs per-row | **Per-conflict table; Eric decides each row** (`content/source-conflicts.md`) | Live data proved no single source is reliably right (row 15) |
| 11 V | Brand red: `#D42E12` (site CSS, both drafts) vs logo red | **Logo red family: `#DA2128`** is the brand token. Retire `#D42E12`, `#FF0000`, `#990000` | Logo master samples `#DE2426` dominant — the `#DA2128` family, not `#D42E12`. The wordmark sits on the dark sidebar; the logo's red is the identity Eric approved. `#DA2128` on white = 4.97:1 (AA pass) |
| 12 V | Red on dark grounds: `~#E8492B` (both drafts) | **`#E25257`** for normal-size red text on `#1A1A1A`; `#DA2128` allowed on dark for large type & hairlines only | `#E8492B` = 4.49:1 on `#1A1A1A` — **fails AA by 0.01** (it was derived against pure black, then the sidebar moved). `#E25257` = 4.62:1 (pass), minimal hue drift. `#DA2128` on `#1A1A1A` = 3.51:1 — passes the 3:1 non-text/large-type bar only |
| 13 V | `roles[]`: is_unique strings "verbatim" vs normalized | **Six normalized atoms** — General Contractor · Construction Management · Design Build · Millwork · Carpentry & Finishes · Consulting — **plus `roleDetail`** preserving the raw string | Live ACF has **10** raw strings (incl. `" General Contractor"` with leading space, and `"General Contractor/Design Build"` on Bad Roman). Atoms over 58: GC 49 · Millwork 17 · Finishes 5 · Carpentry 3 · CM 2 · Consulting 1 · Design Build 1. The two drafts contradicted each other; this supersedes both |
| 14 V | Portfolio sub-category filter values | **PENDING ERIC.** Workbook `Filters` sheet defines a 10-value two-level taxonomy; the 19 Aug docs locked a 5-value flat list that matches neither the sheet nor the data (3 assigned values follow the sheet) | In the Eric email. Schema ships `subCategory` as a string-from-list; list finalized on his answer. 55 of 58 need backfill either way |
| 15 V | Workbook as migration mapping | **`content/content-inventory.tsv` is the registry**, generated from live REST + workbook + decks. The v2 workbook alone is not sufficient: 13 live projects unkeyed/absent (incl. Lantern House, The Pierre), 9 rows stale-marked "not yet on site" | REST pull 2026-08-20: 58 posts, 27C/31R, gallery total 880 — all cross-checked against `image-audit.tsv` |
| 16 V | "Zero redirects" | **Zero redirects for correct URLs; corrections excepted.** WP 564 is Washington Sq. Dermatology mislabeled as `upper-east-side-townhouse` — slug corrected at migration + 301 (Eric to confirm) | Both drafts claimed WSD was "not on the site"; the workbook's own note and the live site disprove that |
| 17 V | Missing-projects list | **8 pipeline projects**, created as unpublished drafts: Twinta, 218 Carlton Ave, 870 UN Plaza, 149 Madison Ave, 220 W 19th (Covision), 144 W 23rd St, 514 Broadway Loft, Chaps & Co. **Momofuku Noodle 171 removed from the list — it is live** (16 images, hero-capable) | The 19 Aug list was wrong on both ends. Twinta exists only in the transcript — content must come from Eric |
| 18 V | Migration image filter | **Keep `project_gallery` ∪ `_thumbnail_id` = 887 unique files** (880 gallery + 7 featured that appear in no gallery; 8 projects' featured images sit outside their own gallery). Never filter on attachment-parent — 137 of 880 are `post: 0` | Featured ⊄ gallery, verified live. The old "880 in / 864 dropped" arithmetic silently dropped 7 featured images; unreferenced count is ~857 of 1,744 (library totals still to be re-verified at migration — see §7) |
| 19 V | Architect credits | **8 of 58 have no real architect** — 5 empty + 3 pseudo-blanks (`None`, `None Involved` ×2). Pseudo-blanks normalize to null at migration; project pages render the credit line only when present | The "5 blank / 53 filled" claim counted `"None"` strings as filled |
| 20 V | Capability decks | **Two distinct decks**: commercial (43pp) and residential (44pp) — not one brochure twice. **Neither has a text layer**; all transcription is OCR/manual. Residential deck carries ~25 case studies incl. Lantern House and the Pierre | pypdf/pdftotext: 0 extractable chars in both. The "43pp has a real text layer" claim was false |
| 21 V | REFERENCES block (deck C p41, deck R p42) | **Never published.** Logos and testimonials yes; the three architects' direct contacts replaced by "references available on request" | Present in both decks; publishing it burns exactly the audience the site targets |
| 22 V | Prototype content | **Kill-list enforced** (DESIGN §9): no invented names, addresses, phones, hours, or stock photography survives into the build. Every displayed fact traces to `content-inventory.tsv`, a deck, or the live site | Verified on the live prototype 20 Aug: fake project, fake address, two fake phone numbers, invented hours, © 2024 |
| 23 S | Source data: live-measured vs snapshotted in-repo | **The 2026-08-20 WXR export is committed at `inputs/raw/`, with text extracts in `inputs/derived/`.** `inputs/raw/` is the source of record and immutable; `inputs/derived/` is script-generated and never hand-edited. **Supersedes row 8's "no WordPress export needed"** — the export stays optional for *launch*, but it is now the offline source of truth for structure — and **closes §11 step 4's authenticated-manifest dependency**: no WP admin session is needed for any number in this repo | 17 assertions recompute from the one committed file: 58 projects · 27/31 · 880 gallery · **887 union** · 7 featured-outside-gallery · 137 `post: 0` · 387 gallery originals · 791 library originals · 445 ≥1920 · 259 ≥2048 · 74 square · 878 missing alt · 5+3 architects · 10 raw role strings. All pass. `content/findings/wxr-export-finding.md` |
| 24 S | Library image total | **1,763 image records (1,764 attachments), not 1,744** — so ~876 unreferenced, not ~857. Every *derived* figure is unchanged; only the denominator moves | The 1,744/1,760 pair was the 19 Aug authenticated live read. The export is the 20 Aug snapshot and is repo-reproducible. Corrected in `originals-finding.md` §Also-worth-knowing |
| 25 S | Legacy project URLs | **73 retired project URLs across 35 of 58 projects**, classified in `inputs/derived/legacy-slugs.tsv`: **37 → 301**, **11 → never redirect** (the retired slug is another project's *live* slug), **25 → human review** (24 ambiguous, 1 `__trashed`). Only the 37 become `redirect` docs; every row gets a live `HEAD` in the §9 link-check. Extends §9, which knew of three exceptions | `_wp_old_slug` repeats per retired slug, so a last-wins parse reports zero of them. The slugs were shuffled in bulk at some point: `mackage-soho`, `mexicue`, `tribeca-loft`, `haus-nightclub` and 7 more are simultaneously live slugs and other projects' history. `content/findings/legacy-slugs-finding.md` |
| 26 S | WP 564 slug fix (row 16) — evidence | **Row 16 stands, and is no longer a proposal from outside the data.** `washington-sq-dermatology` is in WP 564's own `_wp_old_slug` history; the post is already titled "Washington Sq. Dermatology", located "West Village", and described as a dermatology build-out. Still Eric's confirm | The correction restores the project's own former URL rather than inventing one |
| 27 S | WP 558 `autrium-corporate-office` | **"Atrium Corporate Office" is live at a typo'd slug.** Correctly spelled `atrium-corporate-office` is in its retired history. Same class as row 16 → **PENDING ERIC** (`source-conflicts.md` A-21). Until he answers, the live URL is preserved as-is per row 3 | Found in the export's slug history. A typo in a URL is the one case where row 3's "preserve exactly" is worth asking about |
| 28 S | Newest project date | **Lantern House and 795 5th Ave (The Pierre) were published 2023-10-18** — corrects §3's "Newest: Lantern House (Oct 2024)". No new project in 22 months | Both `wp:post_date` values in the export. Worth knowing before describing the portfolio as current |
| 29 S | Division of labour | **Two lanes, one repo: Cursor owns the image set, Grok owns everything else.** Work orders in `workorders/` — `README.md` carries the file-ownership map, branch policy (`cursor/images`, `grok/build`; `main` is Alexey's), and the blocked-on-a-person list. Deck PDFs stay out of the repo (row 21 — the REFERENCES block), so the scrubbed OCR transcripts remain the repo-side source | Cursor is on the machine with the ~12 GB dump and can see a photograph; Grok reads the repo over GitHub. The ownership map has no overlaps, so both lanes can run at once |

| 30 S | Lane scope and how progress survives a session | **All local-only work is Cursor's**, not just images: the deck PDFs (string verification + the ~30 partner logo marks off commercial p42), the logo master's red sampling, the live link-check sweep across all 73 legacy URLs, the dump's checksum manifest, and the on-screen render/keyboard gates. **Cursor also reviews Grok's handoffs adversarially.** Cursor brainstorms its work order and commits `workorders/cursor-plan.md` before executing. **Progress persists in `workorders/STATUS.md` + `workorders/sessions/`**, updated by both lanes before they stop; handoffs in `workorders/handoffs/`, reviews in `workorders/reviews/`. Unblocks the partner logo wall (was on Alexey) | Cursor is the only lane on the machine — it can open a PDF, sample a pixel, hit the live site, and watch the build render. And the failure this project already had was a session ending with its output only in a chat log (COWORK §0), so a status file plus per-session logs is the structural fix |

| 31 S | Partner logo wall — what the decks can actually supply | **Names yes, artwork no.** Every page of both decks is a single flattened raster (commercial ~1020×1320, residential ~1105×1430, zero text characters), so p42's ~30 marks are 150–200px regions of one 97 KB JPEG. Deliverable from the deck is a **human-read, verified firm-name list** plus not-for-publication reference crops; publishable marks must come from each firm's press kit or Eric — **never traced, upscaled or generated**. Build the wall's type and layout and leave the artwork slot visibly empty. Also kills any hope of better OCR: higher dpi upsamples the same pixels | Measured with PyMuPDF 2026-08-20b — `content/findings/deck-raster-finding.md`. Corrects the assumption in `workorders/cursor-images.md` §5.2 as first written. Residential deck's real filename is `Open Full residential 32824.pdf` |
| 32 S | Video assets | **Ask Alexey first, not Eric.** The dump holds **zero** video files, so two of the four homepage variants (non-scrolling loop, scrolling hero) are unbuildable and unmockable, and the `video` doc type has no content. Cursor asks Alexey directly for files, end-logo status, hosting preference, per-variant mapping and poster frames (`cursor-images.md` §5.6); files never enter the repo — an inventory does (`content/video-inventory.tsv`). If self-hosting wins, the `video` type's YouTube-ID shape (§8) becomes a schema question | PLAN §12 had this queued behind Eric; it is one question to Alexey that unblocks half the homepage variant set, so it goes first |

Open items requiring people, not analysis: §12.

---

## 2. What we're building

Replace a WordPress/Astra/Elementor site with a Next.js + Sanity build, restyled to the
format of Eric's other site: a fixed 200px sidebar carrying the whole navigation, the rest
of the viewport given to full-bleed photography.

The audience changed on the July 10 call: **architects**, not end clients. They hold the
relationships and need to trust that Streamline will make them look good. The site must
prove estimating reliability, schedule discipline, and self-performed trades — with words as
well as photographs. Three design directions get built; Eric picks one.

---

## 3. The current site — verified

Numbers below re-verified against the live REST API on 2026-08-20.

### Stack

WordPress + Astra + Elementor 3.25.9, header/footer via Elementor H&F builder and Astra
Advanced Hooks (content outside pages — extract deliberately). REST API open. `wp-sitemap.xml`
live; no SEO-plugin metadata.

### Content

**10 real pages** (+ `/sample-page/` and `/1248-2/`, WordPress litter → 410):

`/` · `/services/` · `/about/` · `/about/eric-ortense/` · `/about/liam-treanor/` ·
`/commercial-projects/` · `/residential-projects/` · `/property-management/` · `/clients/` · `/contact/`

Existing faults: `/about/` and both partner pages unreachable from the nav; nav label
"Testimonials" points at `/clients/`; "desiogn team" typo on `/services/`; footer reads 2022.

**58 projects** — plain posts, two categories: commercial **27** at `/commercial/<slug>/`,
residential **31** at `/residential/<slug>/`. Newest: Lantern House (Oct 2024).

### The projects are ACF, not Elementor

`post_content` empty on all 58; the portfolio is clean structured data in the open REST API.

| ACF field | Live fill | Disposition |
|---|---|---|
| `location` | 58/58 | → `location` (some need tidying — e.g. `"SoHo: 406 Broome St"`) |
| `description` | 58/58 | → Portable Text |
| `size_sq_ft` | 58/58 | → number, sortable |
| `role` | 58/58 — **10 raw strings** | → `roles[]` atoms + `roleDetail` (row 13) |
| `designed_by` | 58/58 | → `designer` |
| `architecture_by` | 50/58 real (5 empty + 3 pseudo-blank) | → `architect`, nullable (row 19) |
| `project_gallery` | 58/58 — **880 images** | → `gallery[]` |
| `mission` / `challenges` / `lessons_learned` | 23 / 27 / 26 | **dropped** (row 5) |

### Brand tokens, measured

Site CSS: `#000000` dominant · four reds in play (`#D42E12` most used, `#DA2128`, `#FF0000`,
`#990000`) · grays `#808285` (3.85:1 on white — fails AA) / `#666666` / `#FAFAFA` / `#2D2D2D`.
**The logo master is the `#DA2128` family (sampled `#DE2426`)** — the ramp builds from the
logo, not the CSS (row 11). Montserrat 700 uppercase headings; body 500 at 13–14px — both replaced.

---

## 4. The reference format

Measured capture in `silverlining-reference-spec.md`. One sentence: a fixed 200px sidebar
holding the entire navigation, full-bleed photography everywhere else, and on content pages a
~400px white column between the two. No header, no footer, no hero, non-scrolling homepage.
Three patterns (landing / index / content), lightbox project detail with chevron paging,
mobile top-bar collapse. 800ms global transitions carry the luxury signal.

Fix rather than copy: `object-fit: fill` distortion → `object-cover`; no `srcset` → `next/image`.

---

## 5. Design decisions — locked

| | Decision |
|---|---|
| **Palette** | Sidebar `#1A1A1A`; content area monochrome; ink `#000000`; paper `#FFFFFF`; rule `#FAFAFA` |
| **Red ramp** | `--red: #DA2128` (wordmark, hairlines, red-on-white text — 4.97:1). `--red-on-dark: #E25257` (normal red text on `#1A1A1A` — 4.62:1). `#DA2128` on dark for large type/hairlines only (3.51:1 ≥ 3:1). No other reds anywhere |
| **Type** | BenchNine 300, sentence case; Lato body, 16px minimum. Scale 14.56 / 16 / 19.2 / 20.8 |
| **Motion** | `transition: all 0.8s`, copied exactly, tokenized |
| **Layout** | Fixed 200px sidebar; patterns A / B / C per spec |
| **Project view** | Full-bleed lightbox, chevron paging; expandable panel: location · sq ft · role · designer · architect (when present) · description |
| **Credits** | Designer and architect only; architect line omitted for the 8 projects without one. No photographer field (data doesn't exist) |
| **Filter** | Commercial / Residential first-class; sub-category **pending Eric** (row 14) |
| **Directions** | Three, fully built: **A** faithful · **B** faithful shell + Streamline's content depth · **C** independent editorial case-study |
| **Property Management** | Stays in the nav |
| **Press** | No Press section; client logos carry third-party validation |
| **Request For Pricing** | Dedicated page, real form: project name, location, type, sq ft, timeline, drawings upload. Emails Eric + estimating (addresses needed — §12) |

### Open variants — built switchable, Eric picks

- **Homepage** — non-scrolling video loop · non-scrolling rotating stills · scrolling video hero · single still
- **Navigation** — mirror reference (7) · +Partners logo wall (8) · Commercial/Residential separate · minimal five
- **Testimonials** — quotes without contact details · quotes pending re-consent · everything from the decks · logos only

---

## 6. Content

### Sources and precedence

`content/content-inventory.tsv` is the canonical registry (58 live + 8 pipeline). Conflicts
across live ACF / workbook / decks are enumerated in `content/source-conflicts.md` — **Eric
resolves each row**; nothing conflicting is migrated until its row is resolved.

| Source | Use | Trust |
|---|---|---|
| Live ACF (REST, snapshotted) | structure, galleries, descriptions | high for structure; strings need hygiene |
| Workbook v2 (`StreamlineUSA_WebContent_v2.xlsx`) | sort order, sub-category taxonomy, notes, testimonials | accurate where keyed; 13 live projects unkeyed; stale status notes |
| Commercial deck (43pp) | ~20 commercial case studies, bios, services copy, 5 named testimonials, ~30-firm logo wall (p42), proof points | image-only; OCR/manual (row 20) |
| Residential deck (44pp) | ~25 residential case studies incl. Lantern House & the Pierre | image-only; previously ignored |

### Proof points for the architect audience (deck p3, verbatim-verified)

$10M GL insurance ("almost every building in the city and 5 boros") · pricing for **most**
projects in 7 working days (keep the qualifier) · in-house millwork shop and carpenters ·
"Streamline USA v2.0 runs on Procore" (keep-or-drop = Eric) · five named testimonials, one
from an architect (Antonio Di Oronzo, Bluarch) · closing line "Let us build your next project."

### Page copy

Transcribe the 10 live pages, then walk each with Alexey for updates. Fix the known copy
faults (§3). Partner bios come from the decks (richer than the site).

### Missing projects (row 17)

8 pipeline projects created as unpublished drafts; live launch = complete set. Twinta and
Carlton Ave were promised on the call — Eric also wants them on the *current* site, which is
a separate quick WP task, not part of this build.

---

## 7. Assets

### The audit (all verified against `image-audit.tsv`)

**880 gallery images + 58 featured across 58 projects.** 445 of 880 ≥1920px. **34 of 58**
hero-capable. 878 of 880 lack alt text (exceptions: one each on Kat & Theo, Boqueria).
74 images square 2048×2048; four projects entirely square — Lantern House, The Pierre,
652 Hudson, 40 E 66th — the newest work; square-in-landscape-hero needs the deliberate
treatment in DESIGN §8. Unusable at full-bleed: 12th St Townhouse (640×295), E63rd St
Penthouse, Lexington Ave, West 23rd, Horatio St, Free People & Spring Studios featured.

### Hidden originals

WordPress serves scaled copies; originals are on disk (measured up to 5600×3733 — 3.5–7×
the pixels). Reported: 791 of 1,744 library images have larger originals; 387 of the 880
across 28 projects. **These library-wide numbers are measured-from-live (19 Aug) and not yet
reproducible from this repo** — `scripts/build-image-manifest.mjs` gets written in Phase 1
and re-verifies them (§11 step 4). Hero-capability stays ~34/58 either way; the uplift is
retina quality, not new heroes.

### The migration filter (row 18 — corrected)

**Keep every image referenced by `project_gallery` or `_thumbnail_id`: 887 unique files**
(880 + 7 featured outside all galleries; 8 projects have featured ∉ own gallery). Do NOT
filter on WordPress attachment-parent: 137 of the 880 are `post: 0` and are live photography.
Expected unreferenced: ~857 of 1,744 — re-verify both totals when the manifest script runs.

### No download needed

Originals are public URLs; Sanity migration uses `_sanityAsset` with original URLs and
generates derivatives server-side. Production never points at the legacy CDN. The cold
backup exists as of 20 Aug: the ~11 GB dump landed in `wp-content/` locally (git-ignored,
verified) — 25,750 image files on disk, bounds consistent with the library measurements.
Keep a second copy off this machine.

---

## 8. Sanity schema

`defineType` / `defineField` / `defineArrayMember` throughout; TypeGen after every schema or
GROQ change. Full conventions in `CLAUDE.md`.

| Type | Kind | Fields |
|---|---|---|
| `project` | doc | title · slug · category (ref) · **subCategory (pending row 14)** · heroImage · gallery[] · location · sizeSqFt (number) · **roles[] (atoms) · roleDetail (string)** · designer · **architect (nullable)** · description (Portable Text) · featured (bool) · sourceId (WP ID) |
| `projectCategory` | doc | Commercial / Residential — drives nav, filtering, URLs |
| `page` | doc | title · slug · sections[] · seo |
| `service` | doc | the 6 services, ordered (deck p3 list is canonical) |
| `person` | doc | Eric, Liam — bio (deck), role, headshot, contact |
| `testimonial` | doc | quote · name · title · company · optional project ref |
| `partner` | doc | firm name · logo — the ~30 marks from deck p42 |
| `video` | doc | title · caption · YouTube ID · poster frame |
| `siteSettings` | singleton | logo · address (483 10th Ave Ste 205, NY 10018) · phone · social · footer |
| `navigation` | singleton | replaces the WP menu; fixes the orphaned About pages |
| `redirect` | doc | legacy path → new path, editable without deploy (first entries: the two 410s, WP 564 slug fix) |
| `seo` | object | reused on page and project |

Studio stays lean — Alexey is the editor.

---

## 9. URLs and SEO

- `/commercial/<slug>/` and `/residential/<slug>/` preserved exactly (row 3)
- `/sample-page/`, `/1248-2/` → 410 Gone
- WP 564 → `/commercial/washington-sq-dermatology/` + 301, pending Eric (row 16)
- `/clients/` keeps its URL; nav label corrected
- Metadata API from `seo`; `LocalBusiness` + `GeneralContractor` JSON-LD; new sitemap + robots
- Link-check old vs new; every legacy URL resolves 200/301/410-by-intent
- Analytics: GA4 · Search Console · Meta pixel · LinkedIn tag → **consent banner required**
  (minimal, bottom-anchored; a visible cost of the retargeting decision)

---

## 10. Infrastructure

| | |
|---|---|
| Repo | `~/sl` — GitHub `scherzo-io/sl`, private; Alexey commits/pushes |
| Framework | Next.js App Router · TypeScript · Tailwind |
| CMS | Sanity — new project, free tier, `production` + `staging` datasets |
| Hosting | Vercel, preview URLs per direction |
| DNS | Alexey holds it. WordPress read-only 30 days post-cutover as rollback |
| Review | Alexey first; then Eric |
| Scope | Streamline only (row 6) |

---

## 11. Build sequence

| # | Step | Needs input? |
|---|---|---|
| 1 | ✅ Document set rebuilt; repo hygiene; conflict table; content inventory | done (20 Aug) |
| 2 | ✅ Extract all 58 projects; image audit; REST verification | done |
| 3 | Send Eric the conflict email (conflicts · taxonomy · pipeline content · logo · videos) | **Eric answers** |
| 4 | Write `scripts/build-image-manifest.mjs`; snapshot REST JSON to `/inputs/raw/`; re-verify library totals | no |
| 5 | Finish deck transcription (both decks, OCR started; REFERENCES block excluded) | no |
| 6 | Scaffold repo — Next.js, Tailwind, Studio, sidebar shell, tokens from §5 | no |
| 7 | Transcribe the 10 pages; extract logo wall; wire testimonials | no |
| 8 | Build Directions A, B, C — fully, with switchable variants | no |
| 9 | Swatch/variant review with Eric → one direction locked in writing | **Eric picks** |
| 10 | Migration into `staging` per CLAUDE.md gates; conflicts must be resolved first | blocked by 3 |
| 11 | SEO/redirect layer; verification checklist (§12 of CLAUDE.md) | no |
| 12 | Staging sign-off → DNS cutover → WP read-only 30 days | **Eric sign-off** |

Steps 4–8 are parallelizable; the critical path is 6 → 8 → 9. Rough total unchanged: **4–5
weeks** with normal client latency, if step 3's email goes out this week.

---

## 12. Still needed

**From Eric (one email + one review):** the 18 conflict rows · sub-category taxonomy pick +
backfill review · content-or-kill for the 8 pipeline projects (Twinta content especially) ·
vector logo (only a 2048×566 PNG exists) · video files without end logos + hosting preference ·
Mercer St Loft testimonial attribution + re-consent posture · references-page approach ·
Procore mention keep/drop · RFP recipient addresses · confirm WSD slug fix · one-site-or-two.

Two asks were added by the 20 Aug source-ingest session and are not in the list above:
**confirm the WP 558 `autrium-corporate-office` slug typo** (row 27) and **say which of the
four phone numbers on the live contact page are publishable** (row 23 — two office lines and
two mobiles). The full draft lives in `content/eric-email.md`.

**From Alexey:** Sanity account when scaffolding starts · real contact phone for siteSettings ·
decide whether the two rescued 19 Aug drafts get archived into the repo (they quote
call-level commercial detail; currently kept out) · push policy for `scherzo-io/sl`.
