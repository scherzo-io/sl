# Work order — Grok — everything except the images

**Lane:** the build. Eric's email, scaffold, Sanity schema, content assembly, all three
design directions, migration scripts, SEO and redirects.
**Not your lane:** the image set — the dump, originals, dimensions, alt text, the asset
upload. That is Cursor's (`cursor-images.md`), and it is running in parallel.
**Where:** `scherzo-io/sl` on GitHub, branch `grok/build`. Never `main`.

Read `workorders/README.md` §1 first — the read order and the rules binding both lanes are
there and are not repeated here.

> **Changelog — 2026-08-20b, added after this lane started.** Additive only; nothing already
> in this file was retracted. Re-read this block at your next phase gate.
> 1. **§8 progress protocol** — commit at checkpoints, write a session log, update
>    `workorders/STATUS.md` before you stop. This is how the project survives a session ending.
> 2. **§9 handoffs** — at each phase gate, write `workorders/handoffs/grok-<date>.md`. Cursor
>    reviews it adversarially and reproduces your gate claims locally.
> 3. **Work that needs this machine moved to Cursor** and now arrives as an input rather than a
>    gap: the partner firm-name manifest, deck-OCR corrections, the live link-check sweep, the
>    logo raster set, and the on-screen render/keyboard verification. Marked inline in phases D,
>    E and G below.
> 4. **2026-08-20c, two measured corrections:** the deck pages are flattened rasters, so the
>    partner logo *artwork* cannot come from them at all — names and layout only (Phase D,
>    `content/findings/deck-raster-finding.md`); and there are zero video files anywhere on the
>    machine, so two homepage variants stay declared-but-empty until Alexey supplies them
>    (Phase E).

---

## 1. Mission

Replace a WordPress/Astra/Elementor site with a Next.js + Sanity build, restyled to the
format of Eric's other site, and build **all three design directions fully** so Eric can pick
one on his phone with real content in front of him.

The audience changed on the July 10 call: **architects, not end clients.** They hold the
client relationships and carry the risk of recommending a GC. Everything you write and build
is in service of making that recommendation feel safe — estimating reliability, schedule
discipline, self-performed trades — worn lightly, because the reference format is
near-wordless luxury. DESIGN.md §1 is the brief for that; read it before you write copy.

## 2. First thirty minutes

The repo has binary sources and a 13 MB XML you cannot usefully read. **Every one of them has
a text twin under `inputs/derived/`.** Use the twin.

1. `PLAN.md` §1 (decision table — it outranks this file), then §§2–12
2. `CLAUDE.md` — the role mapping table, the hard prohibitions, the verification gates
3. `DESIGN.md` — tokens §2, type §3, patterns §4, nav §5, the three directions §6, variants
   §7, imagery §8, the kill-list §9, accessibility §10
4. `inputs/derived/EXTRACT-REPORT.md` — 17 assertions against PLAN.md, plus the anomalies
5. `content/findings/wxr-export-finding.md` and `legacy-slugs-finding.md`
6. `content/source-conflicts.md` — what is not yours to decide
7. `workorders/README.md` §5 — what is blocked, and on whom

If anything in `inputs/derived/EXTRACT-REPORT.md` shows a failed assertion, stop and report.

## 3. What you are working from

| Input | Use |
|---|---|
| `inputs/derived/projects.tsv` | the 58 projects, one row each — every ACF field, per-project image counts, `architect_status`, previous slugs |
| `inputs/derived/projects/<slug>.md` | the same 58 as prose: description, and the `mission` / `challenges` / `lessons_learned` fields that PLAN §1 row 5 drops from the schema but keeps as rewrite material |
| `inputs/derived/pages/<slug>.txt` | **the copy of all 10 live pages**, Elementor wrapper unwrapped. This replaces the manual transcription PLAN §1 row 8 planned for |
| `inputs/derived/site-chrome.txt` | header, footer, Astra hook and Elementor templates — the copy that lives *outside* pages, which PLAN §3 flagged for deliberate extraction |
| `inputs/derived/nav-menu.tsv` | the live menu, six items — the orphaned About pages show up as absences |
| `inputs/derived/legacy-slugs.tsv` | 73 retired project URLs, classified 301 / SKIP / REVIEW |
| `inputs/derived/workbook-v2/*.tsv` | `portfolio` (sort order, sub-categories, notes) · `filters` (the 10-value taxonomy) · `testimonials` (9 quotes with attributions) · `is_unique` · `inspo-competitors` |
| `inputs/derived/workbook-v1/*.tsv` | the earlier workbook's six sheets |
| `content/content-inventory.tsv` | **the canonical registry.** If a value conflicts with it, stop and check `source-conflicts.md` |
| `content/deck-transcripts/*.md` | both capability decks as raw OCR — bios, case studies, services copy, testimonials, proof points. Machine transcription: verify any string before publishing it |
| `inputs/derived/project-images.tsv` | image *references* — IDs, paths, dimensions. Read-only for you; Cursor owns the image work |
| `inputs/raw/brand/streamline-logo.png` | the 2048×566 logo master, source of the `#DA2128` red family |
| `silverlining-reference-spec.md` | the measured reference capture the whole format comes from |

Two sources worth knowing about that PLAN.md does not mention:

- **`workbook-v2/inspo-competitors.tsv`** — Eric's own competitor and inspiration list: five
  NYC competitors, plus Selldorf, Andre Architecture, Ingrao and the Awwwards architecture
  gallery as design references, each with a note on what he values in it. Directly relevant to
  Direction C. It is context for your judgment, never content for the site.
- **`site-chrome.txt`** — the footer that still reads 2022 lives here, not in any page.

## 4. Phases

Work in this order. Each phase ends at a gate: commit, report, and let Alexey look before the
next one. Where a phase is blocked on a person, build everything that isn't and list what you
skipped — do not guess your way past it.

### Phase A — Eric's email · PLAN §11 step 3 · unblocks step 10

The single highest-value thing you can produce, because migration is blocked behind it.

Deliverable: `content/eric-email.md` — **a draft. Alexey sends it.** One pass, answerable in
one sitting, defaults proposed where a default is defensible.

Must cover:

1. The 21 rows of `source-conflicts.md` section A (row 21 is the WP 558 typo, added 20 Aug). Group them so he can rattle through:
   the six size/credit disagreements where live and workbook agree (1, 5, 10–15), the three
   where the deck is the lone outlier (7, 8, 9), the Bad Roman cluster (1–4), and the ones
   needing a real decision (6 Burger & Lobster's suspected designer/architect swap, 18 the
   Mercer St testimonial, 19 the two Vivvi rows).
2. **Sub-category taxonomy** (PLAN §1 row 14). Lay out both candidates — the workbook's
   two-level 10 values (`workbook-v2/filters.tsv`) vs the retired flat five — say that the 3
   assigned values follow the workbook, and that 55 of 58 need backfill either way with
   Alexey drafting and Eric approving.
3. Content or kill for the 8 pipeline projects, Twinta especially — it exists only in the
   July 10 transcript, so nothing can be written without him.
4. Vector logo. Only a 2048×566 PNG exists.
5. Video files without end logos, and where he wants them hosted — **but ask Alexey before you
   write this one**: Cursor is chasing him for the files directly (PLAN §1 row 32), so this may
   already be answered, or may need to be sharper than "please send video".
6. **WP 564** — confirm the slug correction to `/commercial/washington-sq-dermatology/`. Worth
   telling him it is not a new name: it is that project's own former URL, still in WordPress's
   history, and the post is already titled "Washington Sq. Dermatology".
7. **WP 558 — new.** "Atrium Corporate Office" is live at `/commercial/autrium-corporate-office/`.
   The typo is in the URL; the correctly spelled slug is in its history. Same fix, same
   question.
8. **Which phone numbers are publishable.** The export carries four, all currently on the
   live contact page: the main office line, a second office line, and Eric's and Liam's
   mobiles. Publishing a mobile is his call, not a migration default.
9. Procore mention — keep or drop ("Streamline USA v2.0 runs on Procore").
10. RFP recipient addresses (Eric + estimating).
11. References-page approach — confirm "references available on request", since the decks'
    REFERENCES block is never published.
12. One site or two (PLAN §1 row 6 — the Silver Lining build is unconfirmed).

Never in this email: architect direct phones or emails, or anything from the July 10
transcript beyond decisions.

### Phase B — Scaffold · PLAN §11 step 6

Next.js App Router · TypeScript · Tailwind · Sanity Studio embedded at `/studio`.

- Tokens from DESIGN §2, exactly: `ink #000000`, `ink-soft #2D2D2D`, `paper #FFFFFF`,
  `sidebar #1A1A1A`, `rule #FAFAFA`, `red #DA2128`, `red-on-dark #E25257`, `motion all 0.8s`.
  One definition, referenced everywhere. **No other reds exist** — `#D42E12`, `#E8492B`,
  `#E85A3C`, `#FF0000`, `#990000`, `#808285` are retired and must not appear in CSS output.
- Type: BenchNine 300 display/nav/UI in **sentence case**; Lato 300–400 body, **16px
  minimum**; scale 14.56 / 16 / 19.2 / 20.8. No bold anywhere.
- Motion: the 800ms global transition, tokenized, and `prefers-reduced-motion` respected from
  the first commit rather than retrofitted.
- Shell: fixed 200px sidebar carrying the whole navigation — wordmark, nav at ~52px rhythm,
  social, email, phone, © — full-bleed photography everywhere else. Patterns A (landing,
  non-scrolling), B (index, 3-column ragged wall, 332px tiles, ~4px gutters, one FILTER
  control), C (~400px white column beside a full-height photograph) as layout primitives.
- Mobile 390px: sidebar collapses to a dark top bar with a hamburger, single column.
- Fix the reference's faults rather than copying them: `object-cover` never `fill`,
  `next/image` with real `srcset`, 16px body.

Gate: `npm run dev` and `npm run build` clean; the three patterns render at 390 / 768 / 1440;
grep the built CSS for every retired hex and find nothing.

### Phase C — Sanity schema · PLAN §8

All 13 types, `defineType` / `defineField` / `defineArrayMember` throughout: `project`,
`projectCategory`, `page`, `service`, `person`, `testimonial`, `partner`, `video`,
`siteSettings`, `navigation`, `redirect`, and the reusable `seo` object.

- `project`: title · slug · category (ref) · subCategory · heroImage · gallery[] · location ·
  sizeSqFt (number) · **roles[] (atoms only) · roleDetail (raw string)** · designer ·
  **architect (nullable)** · description (Portable Text) · featured · sourceId (WP ID).
- `roles[]` accepts exactly six atoms: General Contractor · Construction Management ·
  Design Build · Millwork · Carpentry & Finishes · Consulting. The mapping from the 10 raw
  ACF strings is the table in CLAUDE.md — including the trim that fixes
  `" General Contractor"`. `roleDetail` keeps the trimmed raw string.
- `subCategory`: ships as a string-from-list, and **the list is pending Eric** (row 14). Put
  the workbook's 10 candidate values in one exported constant with the row cited next to it so
  switching lists is a one-line change. Do not assign values to the 55 unassigned projects.
- `architect`: nullable, and the UI renders the credit line only when non-null — exactly 8 of
  58 have none.
- Run schema extract + **TypeGen after every schema or GROQ change**, no exceptions.
- Studio stays lean: Alexey is the only editor.

Gate: TypeGen output current and committed; every type compiles; no `any` smuggled in to make
TypeGen pass. Schema *deploy* is blocked — no Sanity project exists yet
(`workorders/README.md` §5). Write it to be deployable and say so.

### Phase D — Content assembly · PLAN §11 steps 5 and 7

- **The 10 pages** from `inputs/derived/pages/*.txt`: `/` (WordPress slug `template`),
  `/services/`, `/about/`, `/about/eric-ortense/`, `/about/liam-treanor/`,
  `/commercial-projects/`, `/residential-projects/`, `/property-management/`, `/clients/`,
  `/contact/`. Copy comes across as content, not layout. Verify anything that reads oddly
  against the live page.
- **Fix the known faults** (PLAN §3): `/about/` and both partner pages unreachable from the
  nav; the nav label "Testimonials" pointing at `/clients/`; the "desiogn team" typo on
  `/services/`; the footer reading 2022. The `navigation` singleton replaces the WP menu and
  is where the orphans get fixed — with **In-House Millwork + Cabinet Shop** promoted under
  About Us, per DESIGN §5, because it is the differentiator.
- **Services**: exactly six, ordered, deck p3 canonical — general contracting, construction
  management, design build, millwork, carpentry, pre-construction planning. The live
  `/services/` page copy for each is in `pages/services.txt`.
- **People**: Eric and Liam. Bios from the decks (richer than the site) — commercial deck p2.
  Scrub direct contact details; the site's contact route is `siteSettings`, not a bio.
- **Testimonials**: 9 quotes with attributions in `workbook-v2/testimonials.tsv`; 5 named ones
  in the commercial deck, including the architect voice (Antonio Di Oronzo, Bluarch — one
  canonical spelling, not "DiOronzo"). "Mercer St Loft Owners" has no matching project
  anywhere — conflicts row 18, Eric's call, so leave it flagged and unpublished.
- **Partners**: the ~30 firm marks on commercial deck p42. **Updated 2026-08-20b —** Cursor
  now extracts the marks from the PDF locally and reads the firm names off the page, landing
  them in `content/images/partners/` with a manifest of verified spellings. **Corrected
  2026-08-20c — the artwork does not exist in a usable form.** Every deck page is a single
  flattened raster (p42 is one 1020×1320 JPEG, 97 KB), so each mark is a ~170px region of a
  low-resolution scan. What you get is the **verified firm-name manifest** plus
  not-for-publication reference crops; publishable marks must come from each firm's press kit or
  from Eric. **Build the wall's type and layout against the name manifest and leave the artwork
  slot visibly empty.** Never publish a name straight from the OCR, and never trace, upscale or
  generate a third-party logo. `content/findings/deck-raster-finding.md`.
- **Deck strings — updated 2026-08-20b.** Cursor is verifying the strings that will actually
  ship against the page images and filing `content/deck-corrections.tsv` (OCR string →
  corrected string, page, confidence). Apply those corrections; do not publish raw OCR,
  especially the proof points and testimonial attributions.
- **Logo — updated 2026-08-20b.** An interim raster set (trimmed, transparent, retina, plus a
  light-on-dark treatment for the sidebar) arrives from Cursor at `content/images/brand/`. A
  vector is still pending Eric; do not trace or regenerate one.
- **`siteSettings`**: address 483 10th Ave, Suite 205, New York 10018. Phone is pending Phase
  A question 8 — leave the field empty rather than choosing a number, and never render an
  empty field as a placeholder.
- **Portable Text** for all rich text, never raw HTML. Test the converter on 5 projects before
  running 58. Gates: body is a block array; no `<p`, `_cdata` or `[object Object]` anywhere;
  links live in `markDefs`; empty blocks filtered.
- Deck mission copy becomes source material for `description` rewrites (row 5) — it does not
  come across as its own field.

Gate: every rendered fact traces to `content-inventory.tsv`, `inputs/derived/`, a deck, or the
live site. Grep the output for the DESIGN §9 kill-list: `555-1234`, `456-7890`,
`123 Construction`, `Hello world`, `© 2024`, invented hours, `example.com`.

### Phase E — Three directions · PLAN §11 step 8

All three built fully, not sketched, with the variants switchable:

- **A — Faithful.** The reference executed with Streamline's tokens and photography.
- **B — Faithful shell, Streamline's depth.** Same shell; full project metadata in the lightbox
  panel, operational proof points in Pattern C columns (estimating, schedule, self-performed
  millwork, $10M GL, pricing for **most** projects in 7 working days — keep the qualifier,
  architects notice overclaims), two-level filter on the index.
- **C — Independent, editorial case-study.** The archive is the argument: 58 projects, 880
  photographs, names architects respect. Project-first navigation, long-form case studies,
  typography-led, filterable by category / sub-category / sqft / self-performed trade, logo
  wall as ambient proof, services demoted to one supporting page.

Variants, switchable: homepage ×4 (non-scrolling video loop · non-scrolling rotating stills ·
scrolling video hero · single still), nav ×4, testimonials ×4. **Updated 2026-08-20b/c:** the
local dump contains **zero video files** of any format, so the two video homepage variants
cannot be built or even mocked until files arrive — build the two stills variants, and leave the
video ones as declared-but-empty rather than faking a placeholder loop. Cursor is asking Alexey
for the files directly (PLAN §1 row 32); if the answer is self-hosted rather than YouTube, the
`video` doc type's YouTube-ID shape in PLAN §8 needs revisiting, so treat that as a schema
question you may get handed.

Project detail in every direction: full-bleed lightbox inside the persistent sidebar, thin
chevron paging, title bottom-left, × close, ⌃ expand → panel with location · sq ft · role ·
designer · architect (only when present) · description.

Gate (DESIGN §10): all three render at 390 / 768 / 1440; lightbox fully keyboardable — Esc
closes, arrows page, focus trapped, title announced; visible focus states on nav, filter,
lightbox controls and the RFP form; `prefers-reduced-motion` respected; body never below 16px;
AA contrast using only the §2 tokens. **Updated 2026-08-20b:** Cursor re-runs these on a real
screen and keyboard as part of reviewing your handoff — state your gate results as claims it
can reproduce, and say which ones you could not verify yourself rather than asserting them.

### Phase F — Migration · PLAN §11 step 10 · blocked on Phase A + a Sanity project

Scripts complete and runnable, run when unblocked.

- Deterministic IDs from WordPress: `project-<wpid>`, `page-<slug>`, `person-<slug>`,
  `category-commercial|residential`. Never random IDs for source-backed documents.
- Idempotent writes: `createOrReplace`, or `sanity dataset import --replace`.
- Write order: categories, people → projects, pages, so references resolve.
- Roles via the CLAUDE.md mapping, whitespace trimmed first. Architects `""` / `"None"` /
  `"None Involved"` → null, on exactly 8 projects. Location strings tidied for display with
  the raw value preserved in a note field where changed (`"SoHo: 406 Broome St"` → SoHo;
  `"Meat Packing District"` → Meatpacking District). Name spellings unified per
  `source-conflicts.md` section B, with the mapping kept in the script.
- The 8 pipeline projects created as **unpublished drafts**, title-only where that is all that
  exists.
- **Images come from Cursor's manifest and alt-text files** (`content/images/`). Do not
  re-derive them, do not invent alt text, and do not commit image binaries. Migration uses
  `_sanityAsset` with original URLs so Sanity builds its own derivatives; production never
  references the legacy WordPress CDN.
- Anything whose `source-conflicts.md` row is unresolved: **skip the field and flag it.** An
  unresolved conflict is not a tie to break.
- Dry-run against `staging` before `production`, always.

### Phase G — URLs, redirects, SEO · PLAN §11 step 11

This is bigger than PLAN §9 knew. Read `content/findings/legacy-slugs-finding.md` first.

- Preserve `/commercial/<slug>/` and `/residential/<slug>/` exactly.
- `/sample-page/` and `/1248-2/` → **410**.
- WP 564 → `/commercial/washington-sq-dermatology/` + **301** (Eric confirming).
- **73 retired project URLs** in `legacy-slugs.tsv`: the **37 marked `301`** become `redirect`
  documents. The **11 marked `SKIP` are never redirected** — each of those retired slugs is
  another project's *live* slug, and redirecting one would take a working project page off the
  site. The **25 marked `REVIEW`** need a human target or an honest 404; hand them to Alexey.
- `redirect` doc type so Alexey can add entries without a deploy.
- Metadata API driven by the `seo` object. Nothing to migrate: Yoast is installed but holds no
  titles or meta descriptions, so every one is written fresh.
- `LocalBusiness` + `GeneralContractor` JSON-LD, 483 10th Ave Ste 205, NY 10018. Sitemap and
  robots.
- Link-check old vs new before cutover, and give every one of the 73 legacy rows a live `HEAD`
  — the table is a work list, not a verified set. **Updated 2026-08-20b:** the live sweep is
  Cursor's (it runs from the machine), landing dated results in `content/link-check/<date>.tsv`
  — including confirmation that each of the 11 `SKIP` rows serves 200 as its own live project.
  Consume that file; don't hammer production yourself.
- GA4 · Search Console · Meta pixel · LinkedIn tag, behind a **consent banner**: minimal,
  bottom-anchored. It is a visible cost of the retargeting decision, not an afterthought.

### Phase H — Verify and report

Run every gate in CLAUDE.md §"Verification gates" that belongs to your lane and report
honestly: what passed, what failed with its output, what you skipped and why. Propose PLAN §1
rows for anything you found that changes a decision, and a `COWORK.md` §6 session row.

## 5. Hard rules

- **Never invent a value.** No placeholder strings in any rendered path, no lorem, no
  `example.com`, no invented phones, addresses, hours or emails — the only email domain is
  `streamlineusa.com`, and any hyphenated variant is invented. DESIGN §9 is the list; the rule
  is that a fact renders only if it traces to a source.
- **Unresolved conflict = don't migrate that field.** Flag it.
- **The decks' REFERENCES block never enters the repo, the CMS, or the site.** Architect
  names with direct phones and emails, commercial deck p41 / residential deck p42.
  "References available on request."
- **Nothing from the July 10 transcript except decisions** — not in code, CMS, comments, or
  commit messages.
- **Don't re-litigate `DESIGN.md` or `PLAN.md` §1.** Propose a superseding row in your session
  report if you think a decision is wrong; never edit one in place, and never quietly build
  something else.
- **Don't touch the image lane** — `content/images/**`, `scripts/build-image-manifest.mjs`, or
  the dump. Consume Cursor's output; don't reproduce it.
- **`inputs/raw/` is immutable. `inputs/derived/` is generated** — change the script and
  re-run; never hand-edit an extract.
- **Branch `grok/build` only.** Never commit to or merge into `main`.
- Commit as you go. Anything that exists only in a chat session is already lost — that has
  happened on this project once (COWORK.md §0/§1).

## 6. Done looks like

From CLAUDE.md, the gates that are yours:

- [ ] 58 projects (27 commercial / 31 residential), 10 pages, 2 categories, 2 people in Sanity
- [ ] `roles[]` contains only the six atoms; `roleDetail` populated; no whitespace variants
- [ ] `architect` null on exactly the 8 known projects, and the credit line hidden for them
- [ ] `sizeSqFt` numeric on all 58
- [ ] No duplicate slugs; every category and person reference resolves
- [ ] Output greps clean: `<p`, `_cdata`, `[object Object]`, `555-1234`, `456-7890`,
      `123 Construction`, `Hello world`
- [ ] Red text on white is `#DA2128`; red normal text on `#1A1A1A` is `#E25257`; no retired
      reds in CSS output
- [ ] All three directions render at 390 / 768 / 1440; lightbox keyboardable;
      `prefers-reduced-motion` respected
- [ ] Every legacy URL resolves 200 / 301 / intentional 410 — including the 73 in
      `legacy-slugs.tsv`, with the 11 SKIP rows still serving 200
- [ ] `npm run dev` and `npm run build` clean; TypeGen current

## 7. When something doesn't add up

1. A PLAN or companion number looks wrong → write `content/findings/<topic>-finding.md`,
   propose a PLAN §1 row in your report, say it plainly. Don't quietly correct a document.
2. Two sources disagree → propose a `content/source-conflicts.md` row. Don't pick a winner
   inline.
3. Blocked on a person → `workorders/README.md` §5. Note it, finish everything that isn't
   blocked, and list what you left out. Scaling the work down is Alexey's call, not yours.
4. A rule in §5 makes the work impossible → stop and say so rather than routing around it.

## 8. Progress protocol — added 2026-08-20b, non-negotiable

The point is that Alexey can come back after a week and see exactly where things stand,
without you being there to explain it.

- **Commit at every checkpoint**, not at the end of a phase. A working scaffold, a schema type
  that compiles, a page whose copy is assembled — that is a commit.
- **Before you stop**, three things: commit; write
  `workorders/sessions/<date>-grok-NN.md` from the template in that directory; update
  `workorders/STATUS.md` (**Last updated**, **In flight**, **Next up**, and your lane's row).
- **Nothing important stays in chat.** Findings go to `content/findings/`, decisions into your
  session log as *proposed* PLAN §1 rows, numbers into a committed file with a reproduction
  command. If it only exists in a conversation, it is already lost — that has happened on this
  project once (COWORK.md §0), and it cost the entire 19 Aug document merge.
- **Say what you skipped**, in the session log, every time. A silent gap reads as done.

## 9. Handoffs — added 2026-08-20b

At each phase gate, write `workorders/handoffs/grok-<date>.md`. Cursor reviews it — and it
reviews adversarially, reproducing your claims locally rather than reading them, because it is
the lane that can run the build on a real screen and keyboard.

Make that review cheap and honest:

- **State gate results as reproducible claims**, each with the command that produces it. "Build
  clean" is not a claim; `npm run build` with its output is.
- **Separate what you verified from what you asserted.** Anything you could not check yourself
  — rendering at three widths, keyboard behaviour, contrast on real pixels — say so plainly and
  hand it over as unverified. Asserting it and being wrong costs far more than flagging it.
- **List every skip and every guess**, including fields you deliberately left empty because a
  conflict row or a blocked decision wasn't resolved. Those are the right call; hiding them
  isn't.
- **Name the files you touched** outside the obvious, and any place you came close to the
  ownership boundary in `README.md` §2.
- Expect the review to come back as a file of its own under `workorders/reviews/`, one row per
  claim: confirmed / not reproduced / contradicted. Disagreeing with a finding is fine — do it
  in writing, in the repo.
