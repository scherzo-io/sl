# Source conflicts — one row per disagreement, Eric decides each

Produced by the 2026-08-20 review. The plan (`FINAL-PLAN.md` §5, step 3 of the build
sequence) promises this table; it had not been produced until now. Sources compared:

- **WB** — `StreamlineUSA_WebContent_v2.xlsx`, `Portfolio` sheet (61 rows, 45 keyed by WP ID)
- **DECK-C** — commercial capabilities deck, 43 pp, image-only (page refs = PDF page)
- **DECK-R** — residential capabilities deck, 44 pp, image-only
- **LIVE** — the live site as captured in `content/image-audit.tsv` (slugs, categories, counts)

Neither deck has a text layer, so DECK values were read from rendered pages, not extracted text.

## Field conflicts — need Eric's call

| # | Project | Field | WB says | DECK says | LIVE says | Note |
|---|---------|-------|---------|-----------|-----------|------|
| 1 | Bad Roman | size | 12,500 | 11,200 (C-p4) | — | |
| 2 | Bad Roman | role | General Contractor | Design Build (C-p4) | — | Deck mission copy: "delivered this design build in 6 months" |
| 3 | Bad Roman | location | Upper West Side | Columbus Circle Mall (C-p4) | slug `bad-roman-columbus-circle-mall` | Live slug supports the deck. Deck header spells it "Colombus" — typo, don't propagate |
| 4 | Bad Roman | credits | Designed by Michael Stillman / Arch GRT Architects LLP | "Designed by: GRT Architecture / Michael Stillman Quality Branded" (C-p4) | — | Deck merges both into one line |
| 5 | Kat & Theo | size | 2,300 | 2,500 (C-p19) | — | |
| 6 | Burger & Lobster | designer / architect | Designed by MZA Architecture / Arch Design LSM | Designed by: MZA Architecture, no architect line (C-p27) | — | Suspected swap: MZA is an architecture firm (arch-of-record on 4+ other WB rows); DesignLSM is a hospitality **design** studio. Likely correct: Designed by DesignLSM / Arch MZA. Deck carries the same suspect credit |
| 7 | Boqueria | location | Midtown | Times Square (C-p11) | — | |
| 8 | Indeed | location | Midtown | Tribeca (C-p23) | — | Verify at print res before resolving |
| 9 | Mexicue | location | NoHo | Chelsea (C-p31) | — | Verify at print res before resolving |
| 10 | Grand Ole Opry | architect display | SWA Architecture | — | WB note: site shows designer but **not** SWA as architect | Site display vs data issue |
| 11 | Ketchy Shubby | spelling | "Ketchy Shubby" | "KETCHY SHUBY" (C-p8) | slug `ketchy-shubby` | Confirm the restaurant's own spelling |
| 12 | Washington Sq. Dermatology | identity/URL | WP 564, note: "site slug is 'upper-east-side-townhouse' which is a mislabeled URL" | In deck (C-p38) | slug `upper-east-side-townhouse` (commercial, 5 imgs) | Plan text saying it is "not on the site" is wrong — it is live under a mislabeled slug. Fixing the slug at migration = one redirect, which breaks the "zero redirects" claim by exactly one |
| 13 | Vivvi ×2 | designer/architect roles | Tribeca: Designed by Eleven of Eleven **Architecture** / Arch Carol Gretter · Hudson Yards: Designed by Eleven of Eleven **Design** / Arch Carol Gretter + Eleven of Eleven | — | — | The two rows invert who is designer vs architect; normalise |
| 14 | Testimonial "Mercer St Loft Owners" | attribution | In WB `Testimonials` sheet | Not in either deck | No Mercer project live or in WB | Multi-project client per the quote ("all of my renovations… 8 years"). Attribute to a real project, keep unattributed, or drop |
| 15 | Momofuku KO / Noodle | credits normalisation | KO: "Richard Lewis Design" + "Richard Lewis Architecture"; Noodle: "Richard Lewis" both fields | — | — | Same firm, three spellings |
| 16 | Antonio Di Oronzo | spelling | "Antonio DiOronzo" (Portfolio) vs "Antonio Di Oronzo" (Testimonials) | "ANTONIO DI ORONZO" (C-p41) | — | Pick one |

## Coverage gaps — workbook vs live site (blocks "migrate from the workbook")

**13 live projects are not keyed in the WB Portfolio sheet.** 9 have rows still marked
"Not yet on site" (stale — they are live per `image-audit.tsv`): Mexicue (3349), Bad Roman
(3451), Ketchy Shubby (3467), Momofuku Noodle 171 (3493), 262 Mott (3496), 92 Laight (3454),
652 Hudson (3490), 700 Park (3432), 40 E 66th (3487). **4 have no row at all:** Lantern House
(3966), 795 5th Ave The Pierre (3946), 11th Ave Apt (3392), W 23rd St Duplex (3364) — these
include the newest, strongest work. Sub-category, sort order, and blurbs cannot come from the
WB for these 13 until the sheet is updated.

**7 pipeline rows have a title and nothing else:** 870 UN Plaza, 149 Madison Ave,
220 W 19th St (Covision), 218 Carlton Ave Townhouse, 144 W 23rd St, 514 Broadway Loft,
Chaps & Co Barber Shop. Twinta — promised on the July 10 call — has **no row anywhere**.

## Taxonomy conflict — blocks the portfolio filter

Locked filter in the plan: `Restaurant · Retail · Office · Hospitality · Daycare`.
The WB `Filters` sheet defines a different, two-level taxonomy:

- Residential: Townhouses · Penthouses · Full-Floor & Duplexes · Apartments & Lofts · Historic Renovations
- Commercial: Restaurants & Bars · Nightlife & Events · Retail & Showrooms · Corporate Offices · Institutional & Community

The 3 assigned values in the data ("Restaurants & Bars", "Nightlife & Events",
"Retail & Showrooms") follow the WB taxonomy, not the locked list. Pick one scheme,
then someone assigns the other 55 projects.

## Role-list conflict — blocks the roles[] schema field

The plan says both "the is_unique list becomes the multi-select **verbatim**" (8 raw
strings) and "normalised roles: General Contractor · Construction Management · Design Build
· Millwork · Carpentry & Finishes · Consulting" (6 atoms). These are different lists; the
WB contains no "Design Build" value at all (it appears only in the deck's Bad Roman page
and, reportedly, one live ACF string). Decide: raw strings or decomposed atoms.
