# Grok lane — council execution plan

**Date:** 2026-08-20
**Branch:** `grok/build` (never `main`)
**Work order:** [`grok-build.md`](grok-build.md) — this file does not replace it

> **Changelog 2026-08-20b/c** (merged `workorders/lane-scope-and-status`): Cursor now owns live
> HEAD of 73 URLs, deck-OCR verification, partner *names* off p42, logo raster set, and
> on-screen review of Grok handoffs. Partner *artwork* cannot come from the decks (PLAN §1
> row 31). Video files: ask Alexey first (row 32); two homepage variants stay empty. Progress
> lives in `STATUS.md` + `sessions/` + `handoffs/`. Phase G consumes `content/link-check/`;
> do not hammer production. Re-read `grok-build.md` changelog at every phase gate.

**Pre-flight:** `python3 scripts/wxr-extract.py` → `assertions failed: 0`


This is how Grok will execute the work order: eight gated phases, a six-seat council on
every gate, and a hard stop at anything the work order says is not ours. PLAN.md §1 still
wins. Unresolved conflict = skip the field. No invented values.

Companion: [`handoff-to-cursor.md`](handoff-to-cursor.md) — everything this sandbox cannot
do (no dump, no photographs, no deck PDFs).

---

## 1. Council (every phase, every gate)

Six seats. Parallel by default. The Chair does not merge a phase until Red Team signs the
gate. Seats do not edit PLAN.md / DESIGN.md / CLAUDE.md / live inventory rows.

| Seat | Job | Reads first |
|---|---|---|
| **Chair** | Sequence, file ownership, “is this still the work order?” | `grok-build.md`, this file |
| **Red Team** | Kill-list, prohibitions, SKIP redirects, public-repo leak, invented content | DESIGN §9, CLAUDE.md prohibitions, `source-conflicts.md` |
| **Content** | Facts trace to a source; Eric-blocked fields stay empty | inventory, `inputs/derived/pages/`, decks (no REFERENCES block) |
| **Engineer** | Next.js App Router · TS · Tailwind · Sanity at `/studio`; tokens; TypeGen | DESIGN §2–4, PLAN §8, CLAUDE.md conventions |
| **Design / SEO** | Directions A/B/C, lightbox a11y, 73 legacy URLs | DESIGN §6–10, `legacy-slugs-finding.md` |
| **Cursor liaison** | Consume `content/images/**`; never reproduce it | `cursor-images.md` §5, this handoff |

**Per-phase loop:** Chair assigns the work order section → specialists implement in
non-overlapping paths → Red Team + the relevant SME audit in parallel → Chair commits on
`grok/build` → session report → **Alexey looks before the next phase**.

Inside this lane, A→H is **serial**. Cursor’s image lane is the only parallel track
(PLAN §11 “4–8 parallelizable” means across lanes, not “skip Alexey’s look”).

---

## 2. Red Team findings that bind the plan

Do not “fix” PLAN.md. Follow the winning §1 row. Flag the stale prose in the session report.

| Sev | Finding | Action |
|---|---|---|
| P0 | Remote is **public** (`visibility: public`) while CLAUDE.md / PLAN §10 still say private | **Do not push** `grok/build` until Alexey flips visibility. Local commits only. Propose a PLAN §1 row. |
| P0 | 11 SKIP slugs are other projects’ *live* slugs | Never 301 them. Seed redirects from `verdict=301` only. |
| P0 | Partner-page copy carries revenue, headcount, mobiles, and 336 W 37th St | Do not migrate. Bios from decks, scrubbed. Contact is `siteSettings`. |
| P0 | `about.txt` / `site-chrome.txt` contain Lorem ipsum and dummy names | Drop. Kill-list wins over “it was on the live site.” |
| P0 | “Upper East Side Penthouse” is not a 59th project (retired slug is REVIEW) | Ignore as a project. Hand the REVIEW pair to Alexey. |
| P1 | PLAN §12 claims `content/eric-email.md` exists — **it does not** | Phase A creates it. Cover **all 21** section-A rows (not “18” or “20”). |
| P1 | PLAN §3 “Newest: Oct 2024” is stale; row 28 = **2023-10-18** | Follow row 28. Do not describe the portfolio as current. |
| P1 | EXTRACT-REPORT `image/* mime = 0` vs finding 1,763 | Assertions still 0 — do not stop, do not hand-edit derived. Flag. |
| P1 | Four phones are **not** all on `/contact/` | List with real provenance. `siteSettings.phone` empty until Eric. |
| P1 | Inventory `roles_atoms` uses `GC` shorthand; schema atoms are full names | Persist the six full names. Trim `" General Contractor"` first. |
| P2 | Work order “13 types” vs PLAN §8’s 12 named | 11 documents + `seo` object + Portable Text `blockContent`. Do not invent a 13th document. |
| P2 | Hero-capable 34 (`image-audit.tsv` YES) vs EXTRACT 35 (`max_w ≥ 1920`) | Use the 34 YES flags. Do not recompute. |
| P2 | Empty nav labels on 3 of 6 items | Resolve from linked page titles (Services, Property Management, Contact). Don’t drop, don’t invent. |
| P2 | Live HEAD of 73 slugs: this IP got SiteGround captcha (HTTP 202) | Still Grok’s job, not Cursor’s. Retry; do not ship redirects on TSV faith. |

**Stop rather than route around:** pushing to a public remote; migrating revenue/staffing/old
address; creating Upper East Side Penthouse; 301’ing a SKIP slug; inventing phones, hours,
emails, or the 55 subcategories.

---

## 3. Phases (work order order — no extras)

### Phase A — Eric’s email · PLAN §11 step 3

**Deliverable:** `content/eric-email.md` (confirmed absent). Alexey sends it.
**Council:** Content drafts · Red Team strips REFERENCES / July 10 / invented defaults · Chair commits.
**Gate:** One sitting, 12 work-order items, **21 conflict rows**, defaults only where the
work order or a locked §1 row says they are defensible. Alexey looks before B.

Must cover, grouped as the work order specifies:

1. Conflicts A — live+WB size/credit (1, 5, 10–15); deck-outlier locations (7, 8, 9);
   Bad Roman cluster (1–4); real decisions (6 Burger & Lobster swap, 18 Mercer, 19 Vivvi).
   Also A-16, A-17 Ketchy spelling, A-20 SWA display (FYI unless wrong), A-21 Atrium.
2. Sub-category: workbook 10 vs flat 5. 3 of 58 assigned (workbook). 55 need backfill.
3. 8 pipeline projects, Twinta especially (transcript-only — nothing without him).
4. Vector logo (only the 2048×566 PNG).
5. Video files without end logos + hosting.
6. WP 564 → `/commercial/washington-sq-dermatology/` + 301 (restores its own former URL).
7. WP 558 `autrium-corporate-office` typo (preserve live URL until he answers).
8. Four phones, with actual page provenance — not “all on contact”:
   `646-307-9001` (contact / home / bios) · `646-307-9007` (property-management only) ·
   `917-837-4757` (contact + Eric bio) · `516-509-2236` (Liam bio only).
9. Procore keep/drop.
10. RFP recipients (Eric + estimating). No estimating address exists in-repo — do not invent.
11. “References available on request.” Never paste the REFERENCES block.
12. One site or two (row 6: Streamline only until he says otherwise).

Never in the email: architect direct phones/emails; revenue, spend, staffing, ownership.

### Phase B — Scaffold · PLAN §11 step 6

**Deliverable:** Next.js App Router · TS · Tailwind · `/studio` stub, **inside `sl/`**
(not the outer Vite sandbox). Tokens from `lib/tokens.ts` as the single source.
**Council:** Engineer builds · Design checks 390/768/1440 + patterns A/B/C · Red Team greps
retired hexes and kill-list strings.
**Gate:** `npm run dev` and `npm run build` clean; patterns at 390 / 768 / 1440; built CSS
contains **none** of `#D42E12` `#E8492B` `#E85A3C` `#FF0000` `#990000` `#808285`.

Tokens (locked): ink `#000000` · ink-soft `#2D2D2D` · paper `#FFFFFF` · sidebar `#1A1A1A` ·
rule `#FAFAFA` · red `#DA2128` · red-on-dark `#E25257` · motion `all 0.8s`.
Type: BenchNine 300 sentence case; Lato 300–400; 16px minimum; scale 14.56 / 16 / 19.2 / 20.8;
no bold. `prefers-reduced-motion` from commit 1. Sidebar 200px. Photo slots empty — no stock.

Do not render empty phone/email/social as placeholders. Wordmark is type, not a copied PNG.

### Phase C — Sanity schema · PLAN §8

**Deliverable:** `sanity/schemaTypes/**` + TypeGen (`schema.json`, `sanity.types.ts`) committed.
**Council:** Engineer · Red Team (no `any`, no 13th document, roles are full atom names).
**Gate:** TypeGen current; every type compiles; no `any`. **Do not `schema deploy`.**

Types: `project` · `projectCategory` · `page` · `service` · `person` · `testimonial` ·
`partner` · `video` · `siteSettings` · `navigation` · `redirect` · `seo` (object) ·
`blockContent` (Portable Text). `roles[]` = six atoms only + `roleDetail`. `architect`
nullable. `subCategory` = exported workbook-10 constant citing PLAN §1 row 14; do not
assign the 55. Studio stubs when `PROJECT_ID` is empty.

### Phase D — Content assembly · PLAN §11 steps 5 + 7

**Deliverable:** `content/pages/**`, `content/copy/**`, assembled docs ready for F.
**Council:** Content · Red Team kill-list grep · Cursor liaison confirms no binaries.
**Gate:** Every rendered fact traces to inventory / `inputs/derived/` / a deck / the live
site. Grep: `555-1234` `456-7890` `123 Construction` `Hello world` `© 2024` `example.com`
`Lorem ipsum` `desiogn` `336 West 37th`. Portable Text tested on **5 projects before 58**.

10 pages from `inputs/derived/pages/` (WP `template` → `/`). Six services, deck p3 order.
People: Eric + Liam only (Michael Collins on `/about/` is flagged, not a third `person`).
9 testimonials; Mercer St **unpublished**. Partners: type + layout, names unverified, **no
marks**. `siteSettings.address` = 483 10th Ave, Suite 205, New York 10018; **phone empty**.

Skip: unresolved A-rows; Procore sentence; RFP recipient; pipeline copy; partner images.

### Phase E — Three directions · PLAN §11 step 8

**Deliverable:** Directions A, B, C fully built; homepage ×4 · nav ×4 · testimonials ×4 switchable.
**Council:** Design · Engineer · Red Team a11y · Cursor liaison (slots, not pictures).
**Gate:** All three at 390 / 768 / 1440; lightbox Esc / arrows / focus trap / title announced;
visible focus; reduced-motion; body ≥16px; AA with §2 tokens only.

- **A** faithful (pillarbox 1:1 on `#1A1A1A` for the four square projects).
- **B** same shell + metadata + Pattern C proof ($10M GL, **most** projects in 7 working days).
- **C** editorial archive. `inspo-competitors.tsv` is judgment **never site content**.

Photography = labeled empty `ProjectImageSlot` until Cursor’s manifest lands. No unsplash,
no generated pixels, no Silver Lining photos. Video homepage variants: structural slots only.

### Phase F — Migration scripts · PLAN §11 step 10 · blocked

**Deliverable:** `scripts/import-*`, runnable, not run.
**Blocked on:** Eric’s A answers + Alexey’s Sanity project + Cursor `content/images/`.
**Rules:** deterministic IDs `project-<wpid>` / `page-<slug>` / `person-<slug>` /
`category-commercial|residential`; `createOrReplace`; write order categories, people →
projects, pages; trim then map roles; architects `""`/`None`/`None Involved` → null on
exactly 8; unresolved conflict → skip field; images from Cursor only via `_sanityAsset`;
8 pipeline = unpublished title-only drafts. **Do not invent a dataset. Do not re-derive images.**

### Phase G — URLs, redirects, SEO · PLAN §11 step 11

**Deliverable:** `redirect` docs + Metadata API + JSON-LD + sitemap/robots + consent banner.
**Council:** Design/SEO · Red Team (SKIP invariant) · Engineer (middleware).
**Gate:** 73 rows classified; 37 become redirects; **11 SKIP still 200**; 25 REVIEW to Alexey;
`/sample-page/` and `/1248-2/` → 410; live HEAD of 73 (retry — captcha this session).

Preserve `/commercial|<residential>/<slug>/` exactly. WP 564 / 558 wait on Eric. Yoast is
empty — write titles fresh. JSON-LD `LocalBusiness` + `GeneralContractor`, 483 10th Ave
Ste 205, NY 10018; omit `telephone` until Eric. Consent banner: minimal, bottom-anchored;
tags do not fire before consent; no invented privacy policy.

Studio guard: a `redirect.from` that equals a live project slug cannot be published.

### Phase H — Verify and report

Run every Grok-lane box in `grok-build.md` §6 / CLAUDE.md. Honest: passed / failed-with-output
/ skipped-and-why. Propose PLAN §1 rows (public repo, anything else found). Propose a
`COWORK.md` §6 session row — Alexey applies it. Image-count boxes are Cursor’s unless F ran.

---

## 4. File ownership (do not reach across)

| Grok writes | Cursor writes | Nobody / Alexey |
|---|---|---|
| `app/**` `sanity/**` `components/**` `lib/**` `public/**` | `scripts/build-image-manifest.mjs` | `inputs/raw/**` (immutable) |
| `scripts/import-*` `package.json` config | `content/images/**` | PLAN / DESIGN / CLAUDE / inventory live rows |
| `content/pages/**` `content/copy/**` `content/eric-email.md` | findings on image facts | `wp-content/**` git-ignored |
| this file, `handoff-to-cursor.md` | | |

---

## 5. First commit of the build (after Alexey looks at this plan)

`content/eric-email.md` on `grok/build`. Then stop.

---

## 6. Proposed rows for Alexey (do not apply here)

**PLAN §1 (new row):** Remote `scherzo-io/sl` is currently **public**. Until it is private,
neither lane pushes. Supersedes PLAN §10 / CLAUDE.md “private” wording.

**COWORK.md §6:** `2026-08-20 | Grok council plan | grok-council-plan.md + handoff-to-cursor.md on grok/build; Phase A not started; assertions 0; do not push (public remote)`
