# Streamline USA — Build Brief

Decisions locked, August 19 2026. This supersedes the plan document wherever they disagree.

**Scope:** streamlineusa.com only. **Stack:** Next.js App Router + TypeScript + Tailwind + Sanity, deployed to Vercel.
**Immediate goal:** all three design directions, fully built, to show Eric this week.

---

## Design

| Decision | Locked |
|---|---|
| **Accent colour** | Red in the sidebar accents. Sidebar becomes near-black (`#1A1A1A`), red in the wordmark and hairline rules. Content area stays monochrome. |
| **Typography** | Reference type — **BenchNine 300, sentence case**. Montserrat and uppercase headings are dropped. Bold red logo against light nav is the intended contrast. |
| **Motion** | `transition: all 0.8s` copied exactly from the reference. |
| **Layout** | Fixed 200px sidebar; three patterns per the reference spec (landing / index / content-column). |
| **Project view** | Full-bleed lightbox, chevron paging, expandable panel showing location · sq ft · role · designer · architect · description. |
| **Credits** | Designer and architect only. No photographer field. |
| **Portfolio filter** | Commercial / Residential, then Restaurant · Retail · Office · Hospitality · Daycare. |
| **Directions** | Three. **A** faithful · **B** faithful shell with Streamline's content depth · **C** independent, editorial case-study. |
| **Preview scope** | Everything, all three directions, fully built. |

### Still open — building variants for you to pick from

- **Homepage** — 4 variants: non-scrolling video loop · non-scrolling rotating stills · video hero that scrolls · single still
- **Navigation / IA** — 4 variants: mirror reference (7 items) · +Partners logo wall (8) · Commercial and Residential kept separate · minimal five
- **Testimonials / credibility** — 4 variants: quotes without contact details · quotes held pending re-consent · everything from the brochure · logos only

---

## Content

| Decision | Locked |
|---|---|
| **Projects** | 58 via public REST API + ACF. No WordPress export needed for these. |
| **URLs** | `/commercial/<slug>/` and `/residential/<slug>/` unchanged. Zero redirects. |
| **Page copy** | Transcribe the 10 Elementor pages from the live site, then walk you through each one for updates. |
| **Narrative fields** | `mission`, `challenges`, `lessons_learned` all dropped. `description` only (58/58 filled). |
| **Source conflicts** | I produce a diff table of every disagreement across live ACF / spreadsheet / brochure. You decide each one before migration. |
| **Missing projects** | Twinta, Carlton Ave, 700 Park Ave, Momofuku Noodle 171 1st Ave, 40 E 66th St → created as unpublished drafts. Launch with the complete set. |
| **Photography** | WordPress files for now. Originals possibly obtainable for some projects — I'll report which ones can't carry a full-screen hero. |
| **Logo wall** | Extracted from brochure page 42. I'll flag any mark that comes out too rough to use. |
| **Press** | No Press section. Client logos carry the third-party validation instead. |
| **Property Management** | Stays in the nav as-is. |
| **Request For Pricing** | Dedicated page with a real form — project name, location, type, sq ft, timeline, drawings upload. Submissions email Eric plus estimating. |

---

## Infrastructure

| Decision | Locked |
|---|---|
| **Repo** | A folder on your machine. I scaffold in place; you can open it, run `npm run dev`, commit when you want. |
| **Sanity** | New project, free tier, `production` + `staging` datasets. Migration dry-runs against staging. |
| **Studio** | Lean — you're the editor, so no hand-holding UI. |
| **Hosting** | Vercel. Preview URLs for review. |
| **DNS** | You hold it. WordPress stays read-only 30 days post-cutover as rollback. |
| **Analytics** | GA4 + Search Console + LocalBusiness/GeneralContractor JSON-LD + Meta pixel + LinkedIn tag. |
| **Review** | You review first, then decide what reaches Eric. |

**One consequence worth knowing:** the Meta pixel and LinkedIn tag put non-essential cookies on the site, which means a consent banner. The reference site has none, and a banner is the first thing a visitor sees. I'll build it minimal and bottom-anchored so it does as little damage as possible to that first full-bleed screen — but it is a visible cost of the retargeting decision.

---

## Build order

1. Scaffold repo — Next.js, Tailwind, Sanity Studio, the sidebar shell and design tokens
2. Extract all 58 projects with ACF; audit true image dimensions per project
3. Reconcile the three sources → conflict table for you
4. Transcribe the 10 pages; extract the logo wall; pull the 5 testimonials
5. Build Direction A complete
6. Build Direction B complete
7. Build Direction C complete
8. Build the homepage / nav / testimonial variants as switchable options
9. Your review → Eric

Everything in steps 1–4 runs without further input from you.
