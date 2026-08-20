# Source conflicts — one row per disagreement, Eric decides each

Produced by the 2026-08-20 review; **LIVE column populated from the REST/ACF pull the same
day** (all 58 posts). Sources:

- **WB** — `StreamlineUSA_WebContent_v2.xlsx`, `Portfolio` sheet (61 rows, 45 keyed by WP ID)
- **DECK-C / DECK-R** — commercial (43pp) / residential (44pp) capability decks, both image-only
- **LIVE** — live ACF via REST, snapshotted 2026-08-20 (see `content/content-inventory.tsv`)

Where LIVE agrees with one source, that's evidence, not a verdict — Eric still calls it
(deck copy was client-approved once; ACF may be the typo, or vice versa).

## A. Needs Eric's call

| # | Project | Field | WB | DECK | LIVE | Note |
|---|---------|-------|----|------|------|------|
| 1 | Bad Roman | size | 12,500 | 11,200 (C-p4) | **12,500** | live sides with WB |
| 2 | Bad Roman | role | General Contractor | Design Build (C-p4) | **GC/Design Build** | live sides with deck; atoms: GC + DB |
| 3 | Bad Roman | location | Upper West Side | Columbus Circle (C-p4) | **Columbus Circle Mall** | live+deck+slug agree; deck header spells "Colombus" — typo, don't propagate |
| 4 | Bad Roman | credits | Des: Michael Stillman / Arch: GRT Architects LLP | "GRT Architecture / Michael Stillman Quality Branded" as one line (C-p4) | Des: Michael Stillman / Arch: GRT Architects LLP | live sides with WB split |
| 5 | Kat & Theo | size | 2,300 | 2,500 (C-p19) | **2,300** | live sides with WB |
| 6 | Burger & Lobster | designer / architect | Des: MZA Architecture / Arch: Design LSM | Des: MZA Architecture, no arch line (C-p27) | Des: MZA / Arch: Design LSM | **Suspected swap in all three**: MZA is an architecture firm (arch-of-record on 4+ other rows); DesignLSM is a hospitality design studio. Likely correct: Des DesignLSM / Arch MZA |
| 7 | Boqueria | location | Midtown | Times Square (C-p11) | **Midtown** | deck is the outlier |
| 8 | Indeed | location | Midtown | Tribeca (C-p23) | **Midtown** | deck is the outlier |
| 9 | Mexicue | location | NoHo | Chelsea (C-p31) | **NoHo** | deck is the outlier |
| 10 | Momofuku Noodle 171 | size | 4,200 | — | **3,500** | NEW (live-found) |
| 11 | 262 Mott St | size | 1,400 | — | **1,598** | NEW (live-found) |
| 12 | 700 Park Ave | size | 2,100 | — | **2,800** | NEW (live-found) |
| 13 | 700 Park Ave | credits | Des+Arch: "Griffin Design Studios / Jorge Porta" | — | Des: **Irene Pappas** / Arch: **Jorge Porta GDSNY architecture** | live disagrees with WB on designer entirely |
| 14 | 40 E 66th St | size | 2,200 | — | **2,803** | NEW (live-found) |
| 15 | 40 E 66th St | designer | Cetra Ruddy | — | **Ximena Rodriguez of CR** | same firm, person-level credit — pick display style |
| 16 | Washington Sq. Dermatology | identity/URL | WP 564; WB note: slug `upper-east-side-townhouse` is mislabeled | in deck (C-p38, West Village) | live slug `upper-east-side-townhouse` | Working assumption (PLAN §1 row 16): correct slug at migration + 301. **Confirm** |
| 17 | Ketchy Shubby | spelling | "Ketchy Shubby" | "KETCHY SHUBY" (C-p8) | slug `ketchy-shubby` | confirm the restaurant's own spelling |
| 18 | Testimonial "Mercer St Loft Owners" | attribution | WB Testimonials sheet | not in decks | no Mercer project anywhere | multi-project client per the quote; attribute, anonymize, or drop |
| 19 | Vivvi ×2 | designer/architect roles | Tribeca: Des "Eleven of Eleven Architecture" / Arch "Carol Gretter" · Hudson Yards: Des "Eleven of Eleven Design" / Arch "Carol Gretter / Eleven of Eleven" | — | matches WB | the two rows invert who's designer vs architect — normalize |
| 20 | Grand Ole Opry | architect display | SWA Architecture | — | ACF **has** "SWA architecture" | site template hides it — display bug on the old site, not a data gap. New site shows it; nothing for Eric unless the credit is wrong |

## B. Data hygiene — fixed mechanically at migration (no Eric needed)

- `" General Contractor"` leading space (11th Ave Apt, WP 3392) → trim
- Pseudo-blank architects → null: `"None"` (Lantern House), `"None Involved"` (92 Laight, 262 Mott) — plus the 5 truly empty (Indeed, Hudson Yards Mall, Mackage, Tribeca Loft, Wainscott) = **8 of 58 render no architect line**
- Location strings: `"SoHo: 406 Broome St"` (Ketchy) → "SoHo"; `"Meat Packing District"` (Horatio) → "Meatpacking District"; `"5th Ave"` (Pierre) → style-normalize
- Name spellings unified at migration: Antonio Di Oronzo (not DiOronzo) · Richard Lewis Design/Architecture (KO) vs plain "Richard Lewis" (Noodle) · "Built In Studios" vs "Built-in Studios" (652 Hudson vs Pierre) — one canonical form each, mapping kept in the migration script

## C. Coverage — RESOLVED 2026-08-20

The 13 live projects missing from the workbook are now fully covered by
`content/content-inventory.tsv` (live ACF values for all 58). The workbook's 9 stale
"not yet on site" rows and 4 absent rows (Lantern House, The Pierre, 11th Ave Apt, W 23rd St
Duplex) no longer gate migration. Still open, for Eric: **content for the 8 pipeline
projects** — Twinta (transcript-only; no row anywhere), 218 Carlton Ave, 870 UN Plaza,
149 Madison Ave, 220 W 19th (Covision), 144 W 23rd St, 514 Broadway Loft, Chaps & Co.

## D. Taxonomy — PENDING ERIC (PLAN §1 row 14)

Two candidate schemes for the portfolio sub-filter:

- **Workbook `Filters` sheet (two-level, 10 values):** Residential — Townhouses · Penthouses ·
  Full-Floor & Duplexes · Apartments & Lofts · Historic Renovations; Commercial — Restaurants
  & Bars · Nightlife & Events · Retail & Showrooms · Corporate Offices · Institutional & Community
- **19 Aug locked list (flat, 5 values):** Restaurant · Retail · Office · Hospitality · Daycare

The 3 values actually assigned follow the workbook scheme. Whichever wins, 55 of 58 need
assignment — Alexey can draft from photos/decks, Eric approves.

## E. Roles — RESOLVED (PLAN §1 row 13)

Six normalized atoms + `roleDetail` raw string. Mapping table in `CLAUDE.md`. The
"is_unique verbatim" instruction is superseded; live raw strings number 10, not 8 or 9.
