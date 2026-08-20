# Streamline USA — Website Rebuild
## Final Plan

**Prepared for:** Alexey Etcheverry · **Date:** 19 August 2026
**Site:** streamlineusa.com — Streamline USA LLC, NYC general contractor & construction management
**Reference:** silverlininginc.com (Eric's, held via the holding company; reuse approved in writing)

This is the single source of truth. It supersedes the earlier plan and brief documents. Three companion files hold detail rather than decisions:

- `content/image-audit.tsv` — per-project image dimensions, all 58
- `content/originals-finding.md` — the hidden high-res originals, and the migration filter rule
- `silverlining-reference-spec.md` — the measured reference capture

---

## 1. What we're building

Replace a WordPress/Astra/Elementor site with a Next.js + Sanity build, restyled to the format of Eric's other site: a fixed sidebar carrying the whole navigation, with the rest of the viewport given to full-bleed photography.

The audience changed on the July call. It is now **architects**, not end clients — they hold the relationships and need to trust that Streamline will make them look good. That shifts what the site has to prove: estimating reliability, schedule discipline, self-performed trades. Three design directions get built; Eric picks one.

---

## 2. The current site — verified

Every number below was read from the live site or its REST API, not estimated.

### Stack

WordPress + **Astra** theme + **Elementor 3.25.9**, with Elementor Header & Footer builder and Astra Advanced Hooks — so header, footer and injected blocks live outside page content. REST API is open. `wp-sitemap.xml` live; no SEO plugin sitemap, so SEO metadata is thin or absent.

### Content

**10 real pages** (plus `/sample-page/` and `/1248-2/`, both WordPress litter to be deleted):

`/` · `/services/` · `/about/` · `/about/eric-ortense/` · `/about/liam-treanor/` · `/commercial-projects/` · `/residential-projects/` · `/property-management/` · `/clients/` · `/contact/`

Two existing faults: `/about/` and both partner pages are **unreachable from the navigation**, and the nav label "Testimonials" points at `/clients/`.

**58 projects** — plain WordPress posts, not a custom post type:

- `commercial` — **27**, at `/commercial/<slug>/`
- `residential` — **31**, at `/residential/<slug>/`

Most last edited April 2022. Newest is Lantern House, October 2024. Footer copyright reads 2022.

### The projects are ACF, not Elementor

`post_content` is **empty on all 58**. The entire portfolio lives in Advanced Custom Fields, exposed in the public REST API. No Elementor parsing is needed for the portfolio — only for the 10 pages.

| ACF field | Filled | Disposition |
|---|---|---|
| `location` | 58/58 | → `location` |
| `description` | 58/58 | → Portable Text |
| `size_sq_ft` | 58/58 | → number, sortable |
| `role` | 58/58 | → normalised multi-select |
| `designed_by` | 58/58 | → `designer` |
| `architecture_by` | 53/58 | → `architect` |
| `project_gallery` | 58/58 | → 880 images |
| `mission` | 23/58 | **dropped** |
| `challenges` | 27/58 | **dropped** |
| `lessons_learned` | 26/58 | **dropped** |

`role` is dirty free text — nine distinct strings including one `" General Contractor"` with a leading space that sorts as its own value. Your `is_unique` sheet already has the canonical list; it becomes the Sanity multi-select verbatim.

### Brand tokens, measured

`#000000` (dominant) · **`#D42E12`** (brand red) · `#FFFFFF` · `#808285` · `#666666` · `#FAFAFA` · `#2D2D2D`

Four different reds are in play — `#D42E12`, `#DA2128`, `#FF0000`, `#990000`. Consolidating to one ramp off `#D42E12` is free.

Montserrat throughout. Headings 700 uppercase; body 500 at **13–14px**.

Contrast, computed: `#D42E12` on white **5.0:1** (passes AA) · on black **4.2:1** (fails normal text) · `#808285` on white **3.85:1** (fails).

---

## 3. The reference format

Measured from silverlininginc.com. Full detail in the companion spec.

**One sentence:** a fixed 200px sidebar holding the entire navigation, with the rest of the viewport given to full-bleed photography — and on content pages, a narrow white column floating between the two. No header, no footer, no hero section, and a homepage that does not scroll.

### Tokens

| | Reference | Streamline |
|---|---|---|
| ink | `#000000` | `#000000` |
| ink-soft | `#1F1F1F` | `#2D2D2D` |
| paper | `#FFFFFF` | `#FFFFFF` |
| sidebar | `rgba(121,121,121,.95)` | **`#1A1A1A` near-black** |
| rule | `#EFEFEF` | `#FAFAFA` |
| accent | *none exists* | **`#D42E12`** — wordmark + hairlines |
| display | BenchNine 300 | **BenchNine 300** |
| body | Lato 300 | Lato, 16px minimum |
| motion | `all 0.8s` | **`all 0.8s`** |

Weight 300 on everything. Sentence case, not uppercase. Four-step scale: 14.56 / 16 / 19.2 / 20.8px. The 800ms transition is most of the luxury signal — at 200ms the same layout reads cheap.

### Three layout patterns

**A — Landing.** Sidebar + full-bleed image filling the viewport. `scrollHeight === innerHeight`; it does not scroll.

**B — Index.** Sidebar + 3-column image wall, 332px tiles at native aspect ratios so rows are ragged. Gutters ~4px. One `FILTER` control. No titles or captions on the grid. Grid scrolls internally; sidebar stays fixed.

**C — Content page.** Sidebar + **~400px white content column** + full-height photograph. This is the pattern worth stealing: it's where Streamline's operational copy lives while photography still holds half the screen.

**Project detail.** Full-bleed lightbox inside the persistent sidebar. Chevron paging left and right, title bottom-left, × to close, ⌃ to expand. Their expanded panel shows exactly two lines: Architect/Designer and Photographer.

**Mobile (390px).** Sidebar collapses to a dark top bar with hamburger; single column below.

### Two things to fix rather than copy

`object-fit: fill` distorts every non-conforming photo. And there is no `srcset` at all — 480px sources into 332px slots.

---

## 4. Design decisions — locked

| | Decision |
|---|---|
| **Accent** | Red in the sidebar accents. Sidebar `#1A1A1A`, red wordmark and hairline rules, monochrome content area. Lighten to ~`#E8492B` for any red text on dark. |
| **Type** | BenchNine 300, sentence case. Montserrat and uppercase headings are dropped. |
| **Motion** | `all 0.8s`, copied exactly. |
| **Layout** | Fixed 200px sidebar; the three patterns above. |
| **Project view** | Lightbox with chevron paging. Expandable panel shows location · sq ft · role · designer · architect · description. |
| **Credits** | Designer and architect only. No photographer field — the data doesn't exist on any of the 58. |
| **Filter** | Commercial / Residential, then Restaurant · Retail · Office · Hospitality · Daycare, from your Sub-Category column. |
| **Directions** | Three. **A** faithful · **B** faithful shell with Streamline's content depth · **C** independent, editorial case-study. All fully built. |
| **Property Management** | Stays in the nav. |
| **Press** | No Press section. Client logos carry third-party validation instead. |
| **Request For Pricing** | Dedicated page with a real form — project name, location, type, sq ft, timeline, drawings upload. Emails Eric plus estimating. |

### Open — building variants for you to pick from

- **Homepage** — non-scrolling video loop · non-scrolling rotating stills · video hero that scrolls · single still
- **Navigation** — mirror reference (7 items) · +Partners logo wall (8) · Commercial and Residential kept separate · minimal five
- **Testimonials** — quotes without contact details · quotes held pending re-consent · everything from the brochure · logos only

---

## 5. Content

### Sources and precedence

Three sources disagree on real values — Bad Roman is 12,500 sq ft in your spreadsheet and 11,200 in the brochure; Kat & Theo 2,300 vs 2,500; Burger & Lobster's designer and architect look swapped. **You resolve each conflict.** I produce a diff table — field, three values, affected project — before anything is migrated.

| Source | Use |
|---|---|
| Live ACF (REST) | All 58 projects, structural truth |
| Your spreadsheet | 61 rows, normalised roles, Sub-Category taxonomy, gap notes |
| Capabilities brochure (43pp) | Partner bios, services copy, 5 testimonials, ~30 firm logos, RFP pitch |

### From the brochure

Richer partner bios than the site has. An architect-facing services page with the proof points the site is missing — **$10M GL policy**, all five boroughs, **pricing in 7 working days**. Five named testimonials: Antonio Di Oronzo (Bluarch — an architect), Charles Bonnello (Vivvi), Nick Annacone (Kith), Joseph Vicari (Trust3), James Famularo (Meridian). A ~30-firm logo wall. And a usable hero line: *"Let us build your next project."*

Not on the site but in the brochure: **Washington Sq. Dermatology**.

**Do not publish** the brochure's REFERENCES block — three architects' direct phone numbers and emails. Fine in a PDF to one prospect; not fine indexed by Google.

### Page copy

Transcribe the 10 live pages, then walk through each one with you for updates. No WordPress export needed. Known fix: "desiogn team" typo on `/services/`.

### Missing projects

Created as **unpublished drafts**; launch with the complete set.

| Project | Status |
|---|---|
| Twinta | promised on the call, no content |
| Carlton Avenue townhouse | promised on the call, no content |
| Momofuku Noodle 171 1st Ave | "need copy" |
| 700 Park Ave | your note says images too low res — **but featured is 1920×1280 and 16/18 are ≥1920. Note looks stale.** |
| 40 E 66th St | your note says "need pics" — **but it has 19 images at 2048×2048. They appear to have landed.** |

---

## 6. Assets

### The audit

**880 gallery images + 58 featured, across 58 projects.**

- **445 of 880 (51%)** are ≥1920px
- **34 of 58 projects** can carry a full-screen hero; 24 cannot
- **878 of 880 have no alt text** — two exceptions, on Kat & Theo and Boqueria
- **74 images are square 2048×2048**, and four projects are *entirely* square: Lantern House, The Pierre, 652 Hudson, 40 E 66th. Square crops into a landscape hero either letterbox or lose the top and bottom of frame — these are the newest and best work, so this needs a deliberate treatment.

Unusable at full-bleed: 12th St Townhouse (all 12 at 640×295), E63rd St Penthouse (640×392), Lexington Ave (599×399), West 23rd and Horatio St (990px), Free People and Spring Studios (513–640px featured).

### Hidden originals

WordPress scaled large uploads down and has been serving the scaled copies. The originals are still on disk.

**791 of 1,744 library images** have a larger original — **387 of the 880 project images**, across **28 of 58 projects**. Measured: 1920×1280 → **3600×2400**; 2048 → **3024×4032**; 2048×1366 → **5600×3733**. Three and a half to seven times the pixels.

The uplift lands where quality was already fine, so hero-capability stays around 34/58 — but those 34 go from adequate to excellent on retina and 4K, which matters in a design that is nothing but photography.

### The migration filter

**Keep only images referenced by ACF `project_gallery` or `_thumbnail_id`. 880 in, 864 dropped.**

Do **not** filter on WordPress's attachment-parent field: **137 of the 880** are marked `post: 0` yet are live project photography. They were uploaded via the media library rather than from inside a post. Filtering on "attached" silently drops 137 real photographs.

### No download needed

Originals are public URLs. Previews reference them directly; Sanity migration uses `_sanityAsset` with the original URL and Sanity generates its own derivatives server-side. That skips ~1.5 GB of transfer. Production never points at the legacy WordPress CDN.

Worth doing anyway: a cold backup of the uploads directory. Those originals exist on one server.

---

## 7. Sanity schema

Modelling what the content *is*, not how Elementor rendered it. `defineType` / `defineField` / `defineArrayMember` throughout; TypeGen after every schema or GROQ change.

| Type | Kind | Fields |
|---|---|---|
| `project` | doc | title · slug · category (ref) · subCategory · heroImage · gallery[] · location · sizeSqFt (number) · roles[] · designer · architect · description (Portable Text) · featured · sourceId |
| `projectCategory` | doc | Commercial / Residential — drives nav, filtering, URLs |
| `page` | doc | title · slug · sections[] · seo |
| `service` | doc | the 6 services, ordered — currently hardcoded in Elementor |
| `person` | doc | Eric, Liam — bio, role, headshot, contact |
| `testimonial` | doc | quote · name · title · company · optional project ref |
| `partner` | doc | firm name · logo — the ~30 marks from brochure p42 |
| `video` | doc | title · caption · YouTube ID · poster frame |
| `siteSettings` | singleton | logo · address · phone · social · footer |
| `navigation` | singleton | replaces the WP menu; fixes the orphaned About pages |
| `redirect` | doc | legacy path → new path, editable without a deploy |
| `seo` | object | reused on page and project |

**Studio stays lean** — you're the editor, so no hand-holding UI.

### Normalised `roles`

`General Contractor` · `Construction Management` · `Design Build` · `Millwork` · `Carpentry & Finishes` · `Consulting`

---

## 8. URLs and SEO

**Existing URLs are preserved exactly** — `/commercial/<slug>/` and `/residential/<slug>/`. Stable since 2022. Zero redirects for 58 pages, zero re-indexing risk.

- `/sample-page/` and `/1248-2/` → 410 Gone
- `/clients/` keeps its URL; the nav label is corrected
- Per-page metadata via the Next.js Metadata API from the `seo` object
- `LocalBusiness` + `GeneralContractor` JSON-LD (483 10th Ave Ste 205, NY 10018) — absent today, and it matters for a local trade business
- New `sitemap.xml` and `robots.txt`
- Link-check old against new; every legacy URL resolves 200 or 301

**Analytics:** GA4 · Search Console · JSON-LD · Meta pixel · LinkedIn tag.

One consequence: the pixel and LinkedIn tag are non-essential cookies, so a consent banner is required. The reference site has none, and the banner is the first thing a visitor meets on that full-bleed screen. It'll be minimal and bottom-anchored, but it is a visible cost of the retargeting decision.

---

## 9. Infrastructure

| | |
|---|---|
| Repo | `/Users/alexeyetcheverry/sl` — scaffolded in place, yours to run and commit |
| Framework | Next.js App Router · TypeScript · Tailwind |
| CMS | Sanity — new project, free tier, `production` + `staging` datasets |
| Hosting | Vercel, preview URLs per direction |
| DNS | You hold it. WordPress stays read-only 30 days post-cutover as rollback |
| Review | You review first, then decide what reaches Eric |
| Scope | Streamline only |

---

## 10. Build sequence

| # | Step | Needs input? |
|---|---|---|
| 1 | Scaffold repo — Next.js, Tailwind, Studio, sidebar shell, design tokens | no |
| 2 | ✅ Extract all 58 projects; audit image dimensions | done |
| 3 | Build the source-conflict table | **you resolve** |
| 4 | Transcribe the 10 pages; extract logo wall; pull testimonials | no |
| 5 | Build Direction A — faithful | no |
| 6 | Build Direction B — faithful shell, Streamline's content depth | no |
| 7 | Build Direction C — editorial case-study | no |
| 8 | Build the homepage / nav / testimonial variants as switchable options | no |
| 9 | Verify, then hand to you | no |

Steps 1 and 4 run immediately. Step 3 produces something for you to decide on rather than waiting on you.

---

## 11. Verification before handoff

- [ ] Project count reconciles: **58** — 27 commercial, 31 residential
- [ ] **880** gallery images accounted for; every drop explained
- [ ] The **137** `post: 0` images are present, not filtered out
- [ ] `roles[]` contains only the six normalised values — no free text, no whitespace duplicates
- [ ] `sizeSqFt` is a number on all 58, not a string
- [ ] All three directions render at 390 / 768 / 1440
- [ ] Red-on-dark sidebar passes AA at the sizes used
- [ ] No project shows a missing or broken image
- [ ] Every legacy URL resolves
- [ ] `npm run dev` runs clean

---

## 12. Still needed from you

| # | Item | Blocks |
|---|---|---|
| 1 | Resolve the source-conflict table | migration |
| 2 | Video files, and confirm YouTube channel access | Videos section |
| 3 | Per-page copy review, once transcribed | pages |
| 4 | Sanity account — I'll prompt when scaffolding | CMS wiring |
| 5 | Twinta and Carlton Ave content | those two projects |
| 6 | Pick from the homepage / nav / testimonial variants | final build |

Everything else is unblocked.
