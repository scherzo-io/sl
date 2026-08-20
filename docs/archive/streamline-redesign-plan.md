# Streamline USA — Redesign Plan
### WordPress/Elementor → Next.js + Sanity

**Prepared for:** Alexey Etcheverry
**Date:** August 19, 2026 — **Revision 2**, after reading the Jul 10 call notes
**Target:** streamlineusa.com — Streamline USA LLC, NYC general contractor / construction management

---

## 0. Revision 2 — what the call notes changed

Read this before anything else. The Jul 10 Gemini notes and the Builder design notes contradict several assumptions in Revision 1.

### 0.1 Reference site: settled ✅

**silverlininginc.com** is the reference, and it's Eric's — held through his holding company. The transcript reads as though he's describing a competitor he admires; that's an artifact of how he talked about it on the call, not the actual relationship. **Approval is already in writing.**

So there is no rights question to resolve: no ownership confirmation to chase, no permission gate on Phase 2. What he wants is the **format**:

> "But you see the format. I like this"

Two scope notes carried forward from this:

- **Their photography is out of scope.** Streamline's own imagery is used throughout — the ~940 gallery images, the 11 new high-res files, and the brochure photography. Fidelity to the reference means layout, type, spacing and motion, not borrowed pictures.
- **Silver Lining is residential-only.** Its IA is built for that, so lifting it wholesale would bury the commercial and hospitality work — Momofuku, Kith, Free People, Bad Roman, Grand Ole Opry. That's a design problem, not a legal one, and §9 handles it.

### 0.2 The reference site is captured — see the companion spec

`silverlining-reference-spec.md` holds the measured capture: real tokens, the three layout patterns, the project-detail interaction, mobile behaviour. Phase 2 is done, not planned.

Headline finding: the format is a **fixed 200px sidebar** carrying the whole nav, with the rest of the viewport given to full-bleed photography — no header, no footer, no hero, and a homepage that doesn't scroll. Revision 1 assumed conventional stacked sections. It isn't that at all, and Phases 3–5 below are corrected accordingly.

### 0.3 The Gemini summary is unreliable — verify before acting on it

The notes contain a **"Silver Lining website development"** section — [engagement budget and timeline figures removed for archive] — and an action item *"Design Silver Lining: Draft an initial design for the Silver Lining site."*

Given that Eric owns Silver Lining, that may be a genuine second engagement — but nothing in the verbatim transcript supports it. Every mention of Silver Lining in the actual dialogue is about using it as a layout reference. Gemini appears to have merged the benchmark discussion with the budget discussion.

**Worth confirming: is a Silver Lining site in scope, or just Streamline?** It changes what gets built, so it's a scoping question, not a commercial one.

Separately, the same summary says *"High-value brands like Italy identified as target accounts."* Eric said **Eataly**, the food hall.

Treat that document as a lead, not a source. The verbatim transcript further down the same file is reliable; the AI summary at the top is not.

### 0.35 Your other chats — checked, nothing there

You asked me to look through your other chats for anything on copying the site. All eight local sessions read: *Visual clarification* (Cowork docs reorg), *App design critique* (design subagents), *Griswold project ownership transfer* (Strapi migration runbook), *Paneling cowork handoff* (a paneling estimate), *Weekly review* (abandoned), *iPhone home screen app swap*, *Skip sample* (lead scoring), *Greeting Nickeesa*.

Nothing about Streamline or copying a site. The only adjacent thing is the Griswold job — you've done a **Strapi** migration before, so if Sanity's editing model ever feels wrong to Eric, there's a known fallback you've already run.

### 0.4 Work is already underway elsewhere

The Builder design notes point at a live prototype:

`https://ac13b657bd2a4fec8691-main.projects.builder.my/portfolio/residential/upper-east-side-penthouse`

So there's a **Builder.io** build in flight with a round of feedback already logged, plus mockups from **Nikisa** (00:40:42) and a **testimonials draft on Canva** (testimonialdraft.my.canva.site). Before committing to Next.js + Sanity, the honest question is whether you're replacing that work or duplicating it. Revision 1 assumed a greenfield build. It isn't one.

Also note the prototype's URL scheme — `/portfolio/residential/<slug>` — **conflicts** with §7's recommendation to preserve `/residential/<slug>`. Pick one now; changing it after launch means a second redirect migration.

### 0.5 The good news: most of the content problem is already solved

Revision 1 treated content as a gap. The attached files show it mostly isn't. Between the **capabilities brochure** and your **two migration spreadsheets**, the hard content work is largely done:

**The 43-page capabilities brochure (©2023)** contains, already written and designed:

- Full partner bios for Eric and Liam — considerably richer than anything on the website
- A services page written **explicitly for the new audience**: *"ARCHITECTS, OWNERS, REPS, DESIGNERS, DEVELOPERS — Request For Pricing."* Plus the proof points the site is missing: **$10M GL insurance policy**, works in all five boroughs, **pricing in 7 working days**
- ~20 project case studies in a consistent **THE PROJECT / THE MISSION** format — size, role, designed by, architecture by, plus narrative
- **Five real named testimonials** — Antonio Di Oronzo (Bluarch), Charles Bonnello (Vivvi), Nick Annacone (Kith), Joseph Vicari (Trust3 Hospitality), James Famularo (Meridian Retail Leasing). One is from an *architect*, which is the exact audience.
- A **partner logo wall** — ~30 architect, designer and owner's-rep firm marks under *"Special thanks to the architects, owner's reps and designers that we have built with."* **This is the logo page Eric signed off on, already assembled.** I-15 is largely closed.
- A closing line worth stealing for the hero: **"Let us build your next project."**

**This solves the `mission` field problem.** §3 flagged `mission` at 23/58 filled. The brochure has mission copy for projects where the ACF field is blank — so it's a transcription job, not a writing job.

**Your spreadsheets are the migration mapping, already built.** Sheet 1 (`Current`) has 61 project rows keyed by WordPress ID with Title, Location, Size, Role, Designed By, Architecture By, Category, **Sub-Category / Filter**, Link, Notes. Sheet 2 (`is_unique`) is a normalized value list — unique locations, roles, design firms, architecture firms.

Two things follow:

1. **The `role` normalization I proposed in Phase 6, you already did.** Sheet 2 gives nine canonical values: General Contractor, General Contractor + Millwork, Construction Manager, Carpentry + Millwork, Carpentry + Finishes, Millwork + Finishes, Carpentry Millwork + Finishes, Construction Consultant. Use that list verbatim as the Sanity multi-select options.
2. **There's a second taxonomy the live site doesn't have** — `Sub-Category / Filter`, with values like Restaurant, Retail, Office (mixed use). That's a planned enhancement sitting in a spreadsheet. It should become a real Sanity field, because "show me your restaurant work" is precisely how an architect browses a GC's portfolio.

**Known content gaps, from your own Notes column:**

| Project | Gap |
|---|---|
| 700 Park Ave | "Need copy, images are too low res" |
| Momofuku Noodle, 171 1st Ave | "Need copy" |
| 40 E 66th St | "Need pics and copy" — WP ID reads *"new photos coming"* |

**Three sources now disagree, and one has to win.** Live ACF, the spreadsheet, and the brochure conflict on real values — Bad Roman is 12,500 sq ft in the sheet and 11,200 in the brochure; Kat & Theo is 2,300 vs 2,500; Burger & Lobster's designer and architect look swapped between sources. Nominate the **spreadsheet as source of truth** (newest, has a Notes column, already normalized), reconcile the deltas into it once, then migrate from it. Doing this per-project during the build is how you end up with a site nobody trusts.

**⚠️ One thing that must not ship.** Brochure page 41 has a **REFERENCES** block with named architects' direct phone numbers and email addresses — Michael Rosani at MZA, Michael Tower, Doug Huntington at Barlis Wedlick. That's fine in a PDF handed to one prospect. On a public website it's publishing three people's contact details without their consent, and it will annoy exactly the architects Eric is trying to court. Keep the **logos** and the **testimonials**; leave the reference contacts out, or replace them with "references available on request."

**Also in the brochure but not on the site:** Washington Sq. Dermatology. Worth adding.

**Asset files:** 11 high-resolution project photographs (4.5–6.4 MB each) and a **2048px master logo** — the live site is serving a 202×56 pixel logo, so that's an easy upgrade. The brochure arrived twice: a 43-page version with a real text layer (usable directly) and a 44-page iOS export that is **image-only with no text layer**. The image-only copy has one extra page, so it may contain a newer project sheet — that page needs OCR or a manual look.

**Logo asset:** a 2048px master is in the files. The live site serves a 202×56 copy, so that's a free upgrade. Silver Lining renders its wordmark at 160×70 from a 250px source in a 200px sidebar — size yours to match that slot.

---

## 1. Decisions locked

| Decision | Choice |
|---|---|
| Frontend | Next.js (App Router) + React + TypeScript |
| CMS | **Sanity** |
| WordPress access | You export WXR + media; I process the files |
| Design deliverable | **Live Next.js routes** — three variants in one repo at `/preview/a`, `/preview/b`, `/preview/c` |
| Design directions | 2 modeled on the client's reference site, 1 independent |

---

## 2. Inputs still needed from you

Everything below is a hard blocker on the phase noted. Drop files into the working folder; I'll pick them up.

| # | Input | Blocks | Notes |
|---|---|---|---|
| ~~I-1~~ | ~~Reference site URL~~ | — | ✅ **Resolved: silverlininginc.com** — Eric's, via his holding company. See §0.1. |
| ~~I-2~~ | ~~Confirmation client owns reference site~~ | — | ✅ **Closed.** Eric owns silverlininginc.com through his holding company and has approved reuse in writing. His photography is out of scope by choice. |
| ~~I-3~~ | ~~Call transcript~~ | — | ✅ **Received** — Jul 10 Gemini notes. Summary is unreliable (§0.3); verbatim is good. |
| ~~I-4~~ | ~~Your notes~~ | — | ✅ **Received** — Builder design notes, testimonials draft, 20 asset files. |
| **I-10** | **Colour decision: how `#D42E12` enters a monochrome design** | Phase 3, 4 | ⚠️ **Top blocker.** The reference has no accent colour at all, so there's no slot to drop the red into. Three options, all defensible, in the reference spec §6. Only Eric can pick. |
| **I-11** | **Builder.io prototype: replace it or continue it?** | Phase 4, 5 | ⚠️ Work already exists. Deciding this after Phase 4 wastes Phase 4. |
| **I-12** | **URL scheme: `/residential/<slug>` or `/portfolio/residential/<slug>`?** | Phase 7 | The prototype and this plan disagree. See §0.4. |
| **I-13** | **Video files** — Eric's action item, exports without end logos | Phase 5 | Now a first-class requirement, not a nice-to-have. Also: where do they host — YouTube, Vimeo, self-hosted? |
| **I-14** | **Twinta + Carlton Avenue townhouse** project content | Phase 6 | Promised on the call as new site content. Not in the current 58. |
| **I-15** | **Partner/client logo files** | Phase 5 | For the logo page Eric signed off on. Needs the actual marks, and permission to display each. |
| I-5 | **WXR export + media zip** | Phase 1B Track 2 only | Downgraded after the audit — the 58 projects come through the public REST API, so this is now only needed for the **10 Elementor pages** and as a media safety net. WP Admin → Tools → Export → *All content*; zip `/wp-content/uploads/` via SFTP or *Export Media Library*. |
| I-9 | **Decision: keep or cut `mission` / `challenges` / `lessons_learned`** | Phase 5 schema | Only ~45% filled. Either the client commits to writing the missing ones or they leave the schema. See §3. |
| I-6 | **Sanity project + dataset** | Phase 5, 6 | New project, or an existing org project? I'd use `production` + a throwaway `staging` dataset for migration dry runs. |
| I-7 | **Hosting target** | Phase 8 | Vercel is the default assumption. Also: who controls DNS today? |
| I-8 | **High-res photo originals** | Phase 4 | Silver Lining's images are out of scope, so every full-bleed treatment runs on Streamline's own photography. The 11 new files are 4.5–6.4 MB, which is ideal — but are the other ~940 available as originals, or only as web-sized uploads? |

**Not blockers, but worth asking the client:** does he want a project inquiry form (and where do submissions go), and does he want the Procore mention kept?

---

## 3. What the current site actually is — audit findings

Completed. All of this is verified from the live site, not assumed.

### Stack

- **WordPress** + **Astra** theme + **Elementor 3.25.9** (a year+ behind current)
- Elementor Header & Footer builder + Astra Advanced Hooks — meaning **header, footer and injected blocks live outside page content** and are easy to miss in a migration
- REST API is **open and reachable** (`/wp-json/wp/v2/` responds) — I can pull structured content today without waiting on the export
- `wp-sitemap.xml` is live; no Yoast/Rank Math sitemap, so SEO plugin metadata may be thin or absent

### Content inventory

**Pages — 12 total, 10 real:**

| URL | Keep? |
|---|---|
| `/` | Yes |
| `/services/` | Yes |
| `/about/` | Yes — **not in the main nav today** |
| `/about/eric-ortense/` | Yes → becomes a `person` doc |
| `/about/liam-treanor/` | Yes → becomes a `person` doc |
| `/commercial-projects/` | Yes → becomes a filtered index |
| `/residential-projects/` | Yes → becomes a filtered index |
| `/property-management/` | Yes |
| `/clients/` (labeled "Testimonials" in nav) | Yes — **URL and label disagree** |
| `/contact/` | Yes |
| `/sample-page/` | **Delete** — WordPress default, never removed |
| `/1248-2/` | **Delete** — orphan draft artifact |

**Projects — 58 posts** (verified against the REST category counts, not the sitemap), as regular `post` records in two categories:

- `commercial` — **27** posts, URLs `/commercial/<slug>/` (Momofuku Ko, Boqueria, Free People, Kith, Hudson Yards Mall, Grand Ole Opry City Stage, Bad Roman, Indeed, Vivvi Daycare ×2, …)
- `residential` — **31** posts, URLs `/residential/<slug>/` (Lantern House, The Pierre, 700 Park Ave, Tribeca Loft, townhouses, …)

**Content freshness:** most projects last touched April 2022. Newest is Lantern House (Oct 2024). Homepage and project indexes edited Jan 2025. Footer still reads **"Streamline USA LLC 2022."**

### The projects are ACF, not Elementor — and this changes the plan

Whoever built this (you) put the project data in **Advanced Custom Fields**, and ACF is exposed in the public REST API. `post_content` is **empty on all 58 projects** — there is no Elementor blob and no HTML to untangle. The entire portfolio is already clean structured data, readable today without any export.

Measured field fill across all 58:

| ACF field | Filled | Maps to |
|---|---|---|
| `location` | 58/58 | `location` (string) |
| `description` | 58/58 | `description` → Portable Text |
| `size_sq_ft` | 58/58 | `sizeSqFt` (number) — sortable/filterable |
| `role` | 58/58 | `roles[]` — **needs normalizing, see below** |
| `designed_by` | 58/58 | `designer` (string → later a `firm` ref) |
| `architecture_by` | 53/58 | `architect` (string; 5 blank) |
| `project_gallery` | 58/58 | `gallery[]` — **880 images total** |
| `mission` | **23/58** | schema decision — see below |
| `challenges` | **27/58** | schema decision |
| `lessons_learned` | **26/58** | schema decision |

**Gallery weight:** 880 images across 58 projects — median 13 per project, range 5 to 47, none empty. Every project also has a featured image. This is the real bulk of the migration, and the reason `next/image` matters more here than on a typical brochure site.

**Two content decisions this surfaces:**

1. **`role` is dirty free text.** At least eight distinct strings for what should be about four tags: `General Contractor` (35), `General Contractor + Millwork` (12), `Millwork + Finishes` (3), plus one-offs including `General Contractor/Design Build`, `Carpentry + Millwork`, `Carpentry Millwork + Finishes`, `Construction Consultant` — and one `" General Contractor"` with a leading space that would sort and filter as a separate value. Normalize to a fixed multi-select (`General Contractor`, `Construction Management`, `Design Build`, `Millwork`, `Carpentry & Finishes`, `Consulting`) during migration. Then "show me every project where we self-performed millwork" becomes a real filter instead of a guess.
2. **`mission` / `challenges` / `lessons_learned` are ~45% filled.** These are the narrative fields that would make each project a genuine case study instead of a photo dump — and they're blank on more than half. Either the client commits to filling them (they're the strongest sales content on the site) or they come out of the schema. Worth raising directly; don't migrate half-empty fields silently and let them render as gaps.

**Where Elementor still bites:** the 10 pages. Those *are* Elementor, plus header/footer in `elementor-hf` and Astra Advanced Hook records. That's the only part of the extraction that's genuinely hard.

### Brand tokens, measured from the live site

| Role | Value | Notes |
|---|---|---|
| Primary / text | `#000000` | Dominant by far |
| Brand accent | **`#D42E12`** | Most-used red — treat this as *the* brand red |
| Surface | `#FFFFFF` | |
| Muted gray | `#808285` | |
| Body gray | `#666666` | |
| Off-white | `#FAFAFA` | |
| Near-black | `#2D2D2D` | |

**Color drift:** four different reds are in play — `#D42E12`, `#DA2128`, `#FF0000`, `#990000`. Nobody chose that; it accumulated. Consolidating to one red with a defined tint/shade ramp is a free win in the redesign.

**Typography:** Montserrat throughout (Google Fonts). Headings 700, uppercase, ~39px H2 / ~23px H4. Body 500 weight at **13–14px** — small for a site whose audience includes architects and owners reading on phones. Eyebrow labels use tiny uppercase `h6` ("— 01", "— 02").

**Accessibility, computed:**

| Pair | Ratio | Verdict |
|---|---|---|
| `#000000` on white | 21.0:1 | Pass |
| `#D42E12` on white | 5.0:1 | Pass AA normal text |
| `#D42E12` on **black** | **4.2:1** | **Fails** AA normal text (4.5 needed) |
| `#808285` on white | **3.85:1** | **Fails** AA normal text |
| `#FF0000` on white | 4.0:1 | Fails |

The `#D42E12`-on-black failure matters a lot if the reference site turns out to be dark-themed. Plan for a lightened brand red (roughly `#E8492B`+) reserved for dark surfaces.

### Copy issues to fix while we're in there

- `/services/` — "desiogn team" typo
- Footer copyright frozen at 2022
- "Testimonials" nav label → `/clients/` URL
- About / team pages exist but are unreachable from the nav
- `/services/` mixes the company boilerplate into the services page; the same paragraph appears on `/about/`

---

## 4. Phase plan

### Phase 0 — Setup *(½ day)*

1. Create the repo: Next.js App Router + TypeScript + Tailwind, embedded Sanity Studio at `/studio`.
2. Create the Sanity project; `production` + `staging` datasets.
3. Create `/inputs/` in the working folder for the transcript, notes, WXR, and media zip.
4. Stand up a `SPEC.md` in-repo as the single source of truth — every decision below lands there, so nothing lives only in chat.

---

### Phase 1 — Capture the truth about the current site

**1A. Audit** — ✅ done, §3 above.

**1B. Content extraction** *(1 day)*

Two independent tracks. Track 1 needs nothing from you and can start today; only Track 2 waits on the export.

**Track 1 — Projects via REST API. No blocker.**

```
/wp-json/wp/v2/posts?per_page=100&_fields=id,slug,link,title,featured_media,categories,acf,date,modified
/wp-json/wp/v2/categories
/wp-json/wp/v2/media/<id>          → resolve the 880 gallery + 58 featured IDs
```

ACF comes down in the same payload, so this single pass captures the entire portfolio: 58 projects, every field, every image ID. Snapshot raw JSON to `/inputs/raw/rest/` before transforming anything, so the transform is rerunnable without re-hitting the API.

**Track 2 — Pages via WXR export (needs I-5).** Parse with `fast-xml-parser`. This is the only route to `wp:postmeta`, which holds `_elementor_data` and any SEO fields. Unwrap every CDATA value through a `text()` helper before writing anything — raw parser objects leaking into Sanity is the classic failure mode here.

**The Elementor problem, now scoped to 10 pages.** Elementor keeps page structure in a `_elementor_data` JSON blob, not in `post_content`, so the rendered HTML is a lossy artifact. Approach: parse `_elementor_data`, walk the section/container tree, and classify at *section* level by widget mix — not one Sanity type per Elementor widget. Widget fields worth mapping: `heading.settings.title`, `text-editor.settings.editor`, `image.settings.image`, `button.settings.{text,link}`, `icon-list.settings.icon_list[]`.

Because header, footer, and Astra hooks live in separate post types, extract `elementor-hf` and `astra-advanced-hook` records too, or the nav and footer content will silently vanish. (Every project also carries a full block of Astra layout postmeta — header/footer/background overrides. That's presentation, not content: drop all of it deliberately rather than by accident.)

Honest fallback: for 10 pages, hand-transcribing copy from the rendered pages into the new schema is a couple of hours and is often *cleaner* than a parser you'll use once. Decide at Gate 1B based on how gnarly the blobs look.

**Gate 1B:** a `content-inventory.json` with every page and project, its source ID, slug, extracted copy, image references, normalized `role` tags, and a per-item flag for anything needing human review.

**1C. Media — the heaviest phase** *(1 day)*

**~940 images** to move: 880 gallery + 58 featured, minus overlap.

Bulk `/media?per_page=100` listing returned empty on my test (likely restricted), but per-ID lookups work — and I have every ID from the ACF payload. So: resolve each attachment by ID, build a map of `{id → url, alt, width, height, mime}`, download originals, then upload to Sanity.

- Prefer **full-size originals** over Elementor's resized variants (`-300x37`, `-202x56`, …)
- Log every image with **missing or junk alt text** — on a 58-project photo portfolio, alt text is both the accessibility story and a real chunk of the SEO story
- Dedupe by file hash; a gallery of 47 images almost certainly has repeats
- The uploads zip (I-5) is still the safety net if per-ID lookups get rate-limited or if originals were replaced by resized versions on disk

Budget realistically: at 940 images this is a script that runs for a while and needs a resume-on-failure loop, not a one-shot.

**1D. Brand tokens** — ✅ done, §3. Deliverable `tokens/streamline-brand.json`.

**1E. Requirements register** *(½ day, needs I-3, I-4)*

Read the call transcript and your notes; extract every client statement into a numbered register: hard requirement / preference / nice-to-have / open question. Each register item gets an ID so later design decisions can cite it. This is what stops "he said he wanted X" from turning into an argument in week 4. Rerunnable when more notes land.

---

### Phase 2 — Capture silverlininginc.com — ✅ **DONE**

Full measured capture is in **`silverlining-reference-spec.md`**. Summary of what's in it:

- **Design tokens**, read from computed styles: monochrome palette (`#000`, `#1F1F1F`, `rgba(121,121,121,.95)`, `#EFEFEF`), **BenchNine** display / **Lato** body, weight **300** throughout, four-step scale (14.56 / 16 / 19.2 / 20.8px), sentence case, global `transition: all 0.8s`
- **Three layout patterns** — landing (non-scrolling, sidebar + full-bleed image), index (3-col ragged image wall, 332px tiles, native aspect ratios, one FILTER control), and content page (**sidebar + narrow white column + full-height photo**, which is the pattern worth stealing)
- **Project detail** — full-bleed lightbox inside the persistent sidebar, chevron paging, title bottom-left, expandable info revealing exactly two credit lines
- **Mobile** — sidebar collapses to a dark top bar with hamburger, single column below
- **IA** — seven items, millwork promoted to top level
- **Build notes** — Tailwind grid recipe, plus two things to fix rather than copy (`object-fit: fill` distorts their images; no `srcset` at all)

Rebuilt from spec in React, not lifted — the colours, type and imagery all change anyway, and their Fastboil markup carries a platform's worth of dead weight. Photography is Streamline's own throughout, per §0.1; what's copied is layout and image *treatment* (crop ratios, scale, placement, how galleries advance).

---

### Phase 3 — Merge: reference structure + Streamline brand *(1 day)*

Now that the reference is measured, the merge is concrete — and one slot is genuinely empty:

```
reference.ink        #000000                  → #000000          (identical, no change)
reference.ink-soft   #1F1F1F                  → #2D2D2D          (Streamline's near-black)
reference.paper      #FFFFFF                  → #FFFFFF
reference.sidebar    rgba(121,121,121,.95)    → ⚠️ I-10 decision
reference.rule       #EFEFEF                  → #FAFAFA
reference.accent     — none exists —          → ⚠️ I-10 decision
reference.display    BenchNine 300 sentence   → ⚠️ keep BenchNine, or Montserrat 300?
reference.body       Lato 300                 → Lato, min 16px
reference.motion     all 0.8s                 → all 0.8s         (copy exactly)
```

**The accent row is the whole problem.** The reference has no brand colour — not one saturated pixel. So `#D42E12` has nowhere to map *to*; it has to be newly introduced, and whatever it touches becomes the loudest thing on screen. Three coherent options are laid out in the reference spec §6 — red as a single reserved accent, red in the sidebar, or a red-forward sidebar. All three work. Only Eric picks.

Typography is a full inversion: reference is **BenchNine 300, sentence case**; Streamline today is **Montserrat 700, uppercase**. Going faithful means abandoning Montserrat and uppercase headings entirely. Worth deciding deliberately rather than discovering it mid-build.

Carry-overs regardless of the above: retire `#DA2128`, `#FF0000`, `#990000` in favour of one ramp off `#D42E12`; body copy to 16px minimum (up from 13–14px); `#D42E12` needs lightening to roughly `#E8492B` for use on dark surfaces (4.2:1 fails, 5.0:1 on white passes).

**Gate 3:** a swatch board showing the three accent options in situ on the actual sidebar layout — not abstract chips. Eric picks one before anything gets built.

---

### Phase 4 — Three design directions *(3–4 days)*

One repo, real content, three routes. Client clicks through on his phone; the winner becomes the build with zero rework.

**Direction A — Faithful.** The captured spec, executed: 200px fixed sidebar, non-scrolling landing screen, 3-column ragged image wall with one FILTER control, lightbox project view with chevron paging and a two-line credit, 800ms transitions, BenchNine 300 sentence case. Streamline's photography and the I-10 accent decision. This is the literal answer to what Eric asked for.

**Direction B — Faithful shell, Streamline's content depth.** Same sidebar and same full-bleed language, but the project view carries what Streamline actually has and the reference doesn't: location, square footage, role, designer, architect, and the mission copy from the brochure. Plus the operational proof points in Pattern C's content column — estimating, schedules, self-performed millwork, $10M GL, pricing in 7 days. And the two-level filter from your spreadsheet (Commercial/Residential, then Restaurant/Retail/Office).

Also fixes what the reference does poorly: `srcset` and `next/image` instead of 480px sources in 332px slots, `object-cover` instead of their distorting `object-fit: fill`, 16px body minimum, real alt text.

The argument for B: the reference is built for a residential firm whose projects need no explanation. Streamline is selling estimating and schedule reliability to architects, and that requires words. Same shape, more substance.

**Direction C — Independent: portfolio-forward.** A different premise entirely, chosen because it fits *this* business rather than the other one. Streamline's real asset is **58 built projects and ~940 photographs** for names like Momofuku, Kith, Free People, and The Pierre. Direction C leads with that:

- Full-bleed project photography, minimal chrome, typography-led — the language of architecture and design-firm sites, which is what his clients (architects, designers, owners) look at all day
- Project-first navigation instead of services-first
- Real case-study depth, using data that **already exists in ACF**: location, square footage, designer, architect, scope. Nothing to invent.
- A filterable project index — by category, sqft, and self-performed trade — which the current site structurally cannot do
- Client logo wall as social proof rather than a testimonials page nobody clicks
- Services demoted to a supporting page

The pitch: A and B win on familiarity; C wins the bid against other high-end GCs. Worth showing even if he picks A.

Each direction ships **homepage + one project detail + the project index** — enough to judge, not so much that three throwaway builds eat the budget.

**Gate 4:** client review. One direction chosen (or an explicit A+C hybrid). Locked in writing before Phase 5.

---

### Phase 5 — Build *(1–1.5 weeks after sign-off)*

**Sanity schema** — modeling what the content *is*, not how Elementor rendered it:

| Type | Kind | Notes |
|---|---|---|
| `project` | doc | Maps 1:1 off ACF: `title`, `slug`, `category` (ref), `heroImage`, `gallery[]`, `location`, `sizeSqFt` (number), `roles[]` (normalized multi-select), `designer`, `architect`, `description` (Portable Text), plus optional `mission` / `challenges` / `lessonsLearned` pending the §3 decision. Add `featured` (bool) and `sourceId` (WP post ID). |
| `projectCategory` | doc | commercial / residential — a reference doc, since it drives nav, filtering, and URLs |
| `page` | doc | title, slug, section array (page builder), seo object |
| `service` | doc | the 6 services, ordered — currently hardcoded in Elementor |
| `person` | doc | Eric, Liam — bio, role, headshot, contact |
| `testimonial` | doc | quote, attribution, optional project ref |
| `siteSettings` | singleton | logo, address, phone, social, footer |
| `navigation` | singleton | replaces the WP menu; fixes the missing About link |
| `redirect` | doc | legacy path → new path, editable without a deploy |
| `seo` | object | reused on page and project |

Use `defineType` / `defineField` / `defineArrayMember`. Run schema extract + TypeGen after every schema or GROQ change. Deploy the schema before pointing any content tooling at the dataset.

**Frontend:** App Router with static generation, `next/image` across all **~940 gallery images** (the single biggest performance win over the current site — Elementor is serving unoptimized JPEGs today), Portable Text renderer with custom serializers, Sanity Visual Editing so the client can click-to-edit, ISR or webhook revalidation.

Because `sizeSqFt` and `roles[]` become typed fields, the project index gets real filtering — by category, by square footage, by whether Streamline self-performed millwork. That's a capability the current site can't offer at all, and it's a fair chunk of the argument for replatforming rather than restyling.

---

### Phase 6 — Migration & validation *(2–3 days)*

Deterministic IDs off WordPress post IDs — `project-1248`, `page-42`, `person-eric-ortense`, `category-commercial`. Never random IDs for source-backed content, or reruns duplicate everything.

Write order: categories and people first, then projects and pages that reference them. `createOrReplace` throughout, or `sanity dataset import --replace`, so the whole migration is idempotent and can be rerun as many times as it takes.

Dry-run against `staging` first. Convert rich text to **Portable Text** — never store raw HTML as canonical. Test conversion on 5 real projects before running all 58, checking that: body is a block array not a string; no `<p` survives in text spans; link annotations sit in the block's `markDefs`; empty blocks are filtered.

**Validation gate — migration is not done until all of these pass:**

- [ ] Sanity counts match source: **58 projects (27 commercial / 31 residential), 10 pages, 2 categories, 2 people**
- [ ] **Gallery image count reconciles: 880 gallery + 58 featured assets accounted for**, with every drop explained (dedupe or documented failure)
- [ ] **`roles[]` contains only the normalized allowed values** — zero free-text leftovers, no whitespace duplicates
- [ ] `sizeSqFt` is a number on all 58, not a string
- [ ] Skipped WP types are intentional and listed (`attachment`, `nav_menu_item`, `sample-page`, `1248-2`, all Astra layout postmeta)
- [ ] 5+ rich-text docs spot-checked by hand across old and new content
- [ ] Output greps clean for `<p`, `_cdata`, `[object Object]`
- [ ] Every project resolves a real hero image asset — no TODOs, no nulls
- [ ] All category and person references resolve to existing docs
- [ ] No duplicate slugs
- [ ] Quality log reviewed: missing alt text, failed media, unsupported Elementor widgets, the 5 blank `architecture_by` values

---

### Phase 7 — URLs, SEO, redirects *(1 day)*

**Recommendation: preserve the existing URL structure exactly** — `/commercial/<slug>/` and `/residential/<slug>/`. Those 58 URLs have been stable since 2022 and carry whatever link equity and indexing the site has. Restructuring to `/projects/<slug>/` buys tidiness and costs rankings. Not worth it.

- Redirect map: `/sample-page/` and `/1248-2/` → 410 Gone (they should never have been indexed)
- `/clients/` → keep the URL, fix the nav label mismatch
- Per-page metadata via Next.js Metadata API, sourced from the `seo` object
- `LocalBusiness` + `GeneralContractor` JSON-LD (483 10th Ave Ste 205, NY 10018) — currently absent, and it matters for a local NYC trade business
- `ImageObject` / project schema on project pages
- New `sitemap.xml` + `robots.txt`
- Crawl old vs. new with a link checker; every legacy URL must resolve 200 or 301

---

### Phase 8 — Launch *(1 day + monitoring)*

Content freeze on WordPress → final delta sync → deploy to Vercel on a staging domain → client sign-off → DNS cutover → keep WordPress running read-only for 30 days as a rollback path.

Post-launch week 1: Search Console coverage, 404 log, Core Web Vitals, form submissions arriving.

---

## 5. Sequence

```
Phase 0  Setup                      ├─ ½d
Phase 1  Audit ✅ / Extract         ├──── 2–3d   (1B,1C need WXR; 1E needs transcript)
Phase 2  Reference capture          ├── 1d       (BLOCKED on reference URL)
Phase 3  Token merge                ├── 1d
Phase 4  Three directions           ├────── 3–4d
         ▼ CLIENT GATE — pick one
Phase 5  Build                      ├──────────── 1–1.5w
Phase 6  Migrate + validate         ├──── 2–3d
Phase 7  SEO + redirects            ├── 1d
Phase 8  Launch                     ├── 1d
```

Phases 1 and 2 are independent — the moment the reference URL lands, they run in parallel.

**Rough total: 4–5 weeks** with normal client review latency. The critical path runs through the Phase 4 gate; everything after it is mechanical.

---

## 6. Review gates

| Gate | Approver | Artifact |
|---|---|---|
| G1 | You | Content inventory complete, nothing lost |
| G2 | You | Reference spec is faithful enough to build from |
| G3 | Client | Token sheet + swatch board |
| **G4** | **Client** | **Three directions — one chosen, in writing** |
| G5 | You | Migration validation checklist all green |
| G6 | Client | Staging sign-off before DNS |

---

## 7. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Elementor blobs lose content on the 10 pages | Medium *(was High — projects turned out to be ACF)* | Diff extracted copy against rendered pages; hand-transcribe if the parser fights back |
| ~940-image migration partially fails and nobody notices | High | Resume-on-failure loop; count reconciliation is a hard gate in Phase 6 |
| ~~Reference-site rights~~ | — | ✅ Closed — owned via holding company, approved in writing |
| Residential-shaped IA buries the commercial/hospitality half of the portfolio | High | §9; category filter stays first-class; Directions B and C test alternatives |
| Only web-sized images exist (no high-res originals) | **High** | The whole design is full-bleed photography — at 480px sources it falls apart. Resolve I-8 before Phase 4. |
| Accent-colour decision slips | High | Nothing visual can be built without it; Gate 3 swatch board exists to force it early |
| BenchNine / Lato licensing for a second domain | Low | Both are Google Fonts — verify, but almost certainly fine |
| Client keeps editing WordPress during the build | Medium | Content freeze at Phase 8; delta sync catches drift |
| Scope creep: "can we also add a blog / Procore portal / careers page" | Medium | Requirements register (1E) is the baseline; anything not in it is a change order |

---

## 8. Fixes worth mentioning to the client now

Cheap, visible, and they build goodwill before you show any designs:

1. Footer copyright says **2022**
2. **"desiogn team"** typo on `/services/`
3. **About / team pages are invisible** — Eric and Liam have real bios that no visitor can reach. For an owner-operated GC where "our CEO and COO are involved start to finish" is a selling point, that's a straight loss.
4. Newest project is from **Oct 2024** — ask what's been built since; a portfolio site's credibility is its recency
5. Nav says "Testimonials," URL says `/clients/`
6. Body text at 13–14px, and `#808285` gray fails accessibility contrast
7. No structured data — invisible to local search in a category where local search is how owners find GCs

---

## 9. What to take from Silver Lining, and what to leave

Rights are settled (§0.1), so this is purely a design question: which parts of the reference transfer, and which would actively hurt.

**Take the information architecture.** It maps onto Streamline's business almost one-to-one, and the mapping exposes two real gaps:

| Silver Lining | Streamline equivalent | Status today |
|---|---|---|
| About Us → Company Profile / Team | `/about/` + Eric & Liam | exists, **unreachable from nav** |
| About Us → In-House Millwork + Cabinet Shop | Streamline's own millwork shop and carpenters | buried as service #4/#5 — and it's the actual differentiator |
| Services | `/services/` | exists |
| Portfolio | Residential + Commercial | exists, 58 projects |
| **References** | `/clients/` (labeled "Testimonials") | thin — but 5 real named quotes sit in the brochure |
| **Videos** | — | **doesn't exist.** Eric's top ask. |
| Press | — | doesn't exist |
| Contact | `/contact/` | exists |

Two structural gaps — **Videos** and **Press** — plus one buried asset: the in-house millwork shop gets its own top-level nav item on Silver Lining, and on Streamline it's service #4 of 6. It's the actual differentiator ("we control the most important trade"), and Eric's own brochure leads with it. Promote it.

**Take the layout, type, spacing and motion.** Rebuilt from spec in your codebase — clean markup, Streamline's palette (§3), and Streamline's own photography, of which there's plenty and it's good.

**Leave the residential-only IA.** Silver Lining does luxury residential exclusively. Streamline is roughly half commercial and hospitality — Momofuku, Kith, Free People, Bad Roman, Grand Ole Opry, Hudson Yards. Adopting a residential-shaped portfolio structure buries the work that gets Streamline hired for the biggest jobs. The fix is straightforward: keep the two-category split as a first-class filter rather than folding everything into one "Portfolio," and use the `Sub-Category` taxonomy from your spreadsheet (Restaurant / Retail / Office) as the second level. Directions B and C in §4 push on this.

**Leave the sparseness where it costs you.** A residential firm can afford a near-wordless site because the photography does everything. Streamline's pitch to architects is operational — estimating, schedules, self-performed trades, $10M GL, pricing in 7 days. Those are words. The brochure already has them written; don't design a site with nowhere to put them.

---

## 10. Next actions

**Decisions I need from you:**

1. **The accent colour (I-10).** Three options in the reference spec §6. Nothing visual can start until this lands, because the reference has no colour slot to inherit.
2. **Typography.** Faithful means BenchNine 300 sentence case and dropping Montserrat 700 uppercase entirely. Keep the reference's type, or keep Streamline's?
3. **The Builder.io prototype (I-11).** Replace it or continue it — don't let me build a third parallel thing.
4. **URL scheme (I-12).** `/residential/<slug>` or `/portfolio/residential/<slug>`.
5. **One site or two (§0.3)** — is a Silver Lining build in scope?
6. **Video files (I-13)** and where they host — YouTube/Vimeo/self-hosted changes the build.
7. **Sanity project (I-6)** and **hosting/DNS (I-7)**.
8. WordPress export + uploads zip (I-5) — only needed for the 10 Elementor pages now.

**Startable immediately, nothing needed from you:**

- Phase 0 repo + embedded Studio scaffold, with the sidebar shell from the captured spec
- Full REST extraction of all 58 projects with ACF intact, snapshotted to disk
- Reconcile the three content sources into one clean project table — live ACF vs. your spreadsheet vs. the brochure, every conflict listed for your call
- Transcribe the brochure into structured content: partner bios, services copy, 5 testimonials, ~20 project missions, the logo-wall firm list
- `role` multi-select from your `is_unique` sheet, `tokens/streamline-brand.json`, the Sanity schema, `SPEC.md`
- Build the Gate 3 swatch board: the three accent options rendered in the real sidebar layout so Eric can pick from something concrete

Phase 2 is done. Say go and I'll start on the above.
