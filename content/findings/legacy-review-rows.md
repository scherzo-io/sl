# 25 REVIEW legacy URLs need a human target — they 404, not 301

Found 2026-08-20, from `inputs/derived/legacy-slugs.tsv` (`verdict=REVIEW`) via
`scripts/build-redirects.mjs` → `content/copy/redirects.json`.
Phase G will not guess a destination for an ambiguous history row.

## What's there

**25 REVIEW rows, 13 unique retired slugs.** 24 are claimed by two live projects each.
One is a WordPress trash artefact (`upper-east-side-penthouse__trashed`).

Until Alexey/Eric pick a target, middleware leaves these as **honest 404**. They are
not in the 301 table. They are not 410 (except the two PLAN §9 litter URLs).

Companion classification: [`legacy-slugs-finding.md`](legacy-slugs-finding.md).

## The 13 slugs

| Retired slug | Claimants (wp_id → live path) | Notes |
|---|---|---|
| `hells-kitchen-apt` | 527 → `/residential/1st-ave-apt`; 2838 → `/residential/53rd-st-studio` | |
| `murray-hill-apartments` | 527 → `/residential/1st-ave-apt`; 558 → `/commercial/autrium-corporate-office` | Cross-category. Prefixes `/residential/` and `/commercial/` both 404 |
| `horatio-st-townhouse-2` | 520 → `/residential/tribeca-loft`; 537 → `/residential/west-23rd-townhouse-2` | |
| `jackson-heights-townhouse` | 2396 → `/residential/84th-st-townhouse`; 2409 → `/residential/upper-west-side-apartment` | |
| `sullivan-st-duplex` | 2838 → `/residential/53rd-st-studio`; 1907 → `/residential/sullivan-st-duplex-2` | Live owner of this *name* is `sullivan-st-duplex-2` |
| `upper-west-side-townhouse` | 570 → `/residential/69th-st-townhouse`; 1835 → `/residential/lexington-ave-townhouse` | |
| `west-23rd-townhouse` | 540 → `/residential/e63-st-penthouse`; 537 → `/residential/west-23rd-townhouse-2` | Live owner is `west-23rd-townhouse-2` |
| `west-village-townhouse` | 531 → `/residential/st-lukes-place-townhouse`; 537 → `/residential/west-23rd-townhouse-2` | |
| `vivvi-daycare` | 531 → `/residential/st-lukes-place-townhouse`; 494 → `/commercial/vivvi-daycare-tribeca` | Cross-category. Live Vivvi rows are `vivvi-daycare-tribeca` and `vivvi-daycare-hudson-yards` |
| `upper-east-side-penthouse` | 540 → `/residential/e63-st-penthouse`; 2345 → `/commercial/motel-23-lounge` | Name is on the DESIGN §9 kill-list as a fabricated *project*. The retired slug is real history; do not resurrect a project around it |
| `upper-east-side-penthouse__trashed` | 540 → `/residential/e63-st-penthouse` | TSV note: never a public URL — 410 rather than 301. Still 404 until you confirm 410 |
| `washington-sq-dermatology` | 2850 → `/commercial/hudson-yards-mall`; 564 → `/commercial/upper-east-side-townhouse` | **WP 564.** PLAN §1 row 16 would make this the live slug of Washington Sq. Dermatology. Not applied. Live URL stays `/commercial/upper-east-side-townhouse` (200). This path 404s |
| `atrium-corporate-office` | 558 → `/commercial/autrium-corporate-office`; 2520 → `/commercial/haus-nightclub` | **WP 558.** Correct spelling is in history; live slug is the typo `autrium-corporate-office` (200). This path 404s |

## What G did not do

- Did not 301 `washington-sq-dermatology` to Washington Sq. Dermatology. Eric has not confirmed row 16. The slug is also claimed by Hudson Yards Mall.
- Did not 301 `atrium-corporate-office` to Atrium Corporate Office. Eric has not confirmed the WP 558 typo fix. The slug is also claimed by Haus Nightclub.
- Did not 410 the `__trashed` artefact. The extractor recommends it; that is your call.
- Did not pick a winner on any two-claimant row.

## Decision / rule

1. **Alexey walks this table.** For each slug: 301 to one claimant, leave 404, or (trash artefact only) 410.
2. **WP 564 and WP 558 stay in `content/eric-email.md`.** A yes on those two also resolves their REVIEW rows — and is the *only* live-URL change allowed (PLAN §1 row 3).
3. Until then, `lookupRedirect` returns `none` and the App Router 404s.

## Reproducing

```bash
node scripts/build-redirects.mjs
node -e 'const d=require("./content/copy/redirects.json"); console.log(d.review.length, new Set(d.review.map(r=>r.slug)).size)'
# 25 13
```
