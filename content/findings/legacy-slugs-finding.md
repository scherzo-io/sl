# 73 retired project URLs exist, and a third of them cannot be redirected

Found 2026-08-20, from `_wp_old_slug` records in the committed WXR export
(`inputs/raw/streamlineusa.WordPress.2026-08-20.xml`, parsed by
`scripts/wxr-extract.py` into `inputs/derived/legacy-slugs.tsv`).

PLAN §9 promises "every legacy URL resolves 200/301/410-by-intent" and lists three known
exceptions (two 410s and the WP 564 slug fix). There are in fact **73 more** legacy project
URLs still live on WordPress today — and they are not a clean list to redirect, because
Streamline's slugs were shuffled in bulk at some point: some retired slugs are now a
*different* project's live slug.

## What's there

**35 of the 58 projects carry slug history: 73 retired URLs, 60 distinct slugs.** WordPress
stores one `_wp_old_slug` meta row per retired slug and 301s each of them to the post's
current URL. Each row is classified rather than assumed:

| Verdict | Rows | Meaning |
|---|---|---|
| **301** | 37 | one claimant, not live anywhere else — safe to redirect |
| **SKIP** | 11 | the retired slug is another project's **live** slug — redirecting would hijack a live URL |
| **REVIEW** | 25 | 24 claimed by two projects each (ambiguous target) + 1 `__trashed` artefact |

A last-wins meta parse reports **zero** of these, because the key repeats. That is how the
whole set went unnoticed until now.

## Measured evidence

The 11 that must never become redirects — each retired slug is currently serving a real,
different project:

| Retired slug (live for) | …also claimed as history by |
|---|---|
| `mackage-soho` (Mackage SoHo) | 12th St Townhouse |
| `mint-kitchen-restaurant` (Mint Kitchen) | 69th St Townhouse |
| `mexicue` (Mexicue) | Duane Street Penthouse **and** Warren St Apt |
| `thompson-st-studio` (Thompson St. Studio) | Ground Central Coffee |
| `upper-east-side-townhouse` (Washington Sq. Dermatology) | Lexington Ave Townhouse |
| `haus-nightclub` (Haus Nightclub) | Riverside Drive Apartment |
| `tribeca-loft` (Tribeca Loft) | Sullivan St Duplex |
| `ground-central-coffee-company` (Ground Central Coffee) | Vivvi Hudson Yards |
| `st-lukes-place-townhouse` (St. Lukes Place) | West 23rd Townhouse |
| `hudson-street-penthouse` (Hudson Street Penthouse) | Wyckoff Townhouse |

Two findings fall straight out of the same data:

- **`washington-sq-dermatology` is in WP 564's own slug history.** PLAN §1 row 16 proposes
  moving that project from `upper-east-side-townhouse` to
  `/commercial/washington-sq-dermatology/`. That is not a new slug being invented — it is the
  project's own former URL. Its title in WordPress is already "Washington Sq. Dermatology",
  its location is "West Village", and its description is a dermatology build-out. (The same
  retired slug also appears in `hudson-yards-mall`'s history — the shuffle showing.)
- **WP 558 is live at a typo'd slug.** "Atrium Corporate Office" sits at
  `/commercial/autrium-corporate-office/`, and the correctly spelled
  `atrium-corporate-office` is in its retired history. Same class of defect as row 16 — a new
  row in `source-conflicts.md` (A-21), Eric's call.
- **The prototype's "invented" project has a real ancestor.** DESIGN §9 kill-lists
  "Upper East Side Penthouse" as fabricated. There is a retired
  `upper-east-side-penthouse` slug (claimed by both E63rd St Penthouse and Motel 23 Lounge)
  and an `upper-east-side-penthouse__trashed` artefact. The kill-list stands — no such
  project exists among the 58, and the prototype's copy around it was invented — but the name
  probably came off an old sitemap rather than out of thin air.

## The catch

`legacy-slugs.tsv` builds `old_path` as `/<current category>/<retired slug>/`. That assumes
the project never changed category. WordPress resolves old slugs by slug, so a legacy URL may
have lived under the other category prefix. The table is a work list, not a verified set of
live URLs — each row needs a live `HEAD` before it ships.

The 37 "301" rows are also only safe *as of this export*. Adding a new project whose slug
collides with a retired one flips a 301 row into a SKIP row. Re-run the script before cutover.

Nothing here touches the two known 410s (`/sample-page/`, `/1248-2/`) — those stay as PLAN §9
has them.

## Decision / rule

1. **`inputs/derived/legacy-slugs.tsv` is the seed for the `redirect` doc type** (PLAN §8),
   alongside the three exceptions PLAN §9 already names.
2. **Only `verdict = 301` rows become redirects.** The 11 SKIP rows are never redirected —
   their URLs must keep resolving 200 to the live project that owns them. Wiring them up
   would take a working project page off the site.
3. **REVIEW rows need a human target or an honest 404.** Ambiguous history is not a mandate to
   guess; a wrong 301 sends an architect to the wrong project.
4. **Every row gets a live `HEAD` check in the PLAN §9 link-check pass**, old site vs new,
   before cutover. Re-run `scripts/wxr-extract.py` at that point so the classification is
   current.
5. Slug corrections (row 16's WP 564, and WP 558 if Eric agrees) are the *only* deliberate
   slug changes. Everything else preserves its live URL exactly (PLAN §1 row 3).

Related: [`wxr-export-finding.md`](wxr-export-finding.md) — the export these records come from.

## Reproducing

```bash
python3 scripts/wxr-extract.py
column -ts$'\t' inputs/derived/legacy-slugs.tsv | less -S
awk -F'\t' 'NR>1{print $8}' inputs/derived/legacy-slugs.tsv | sort | uniq -c
```

No network or credentials needed. The classification lives in `scripts/wxr-extract.py`
(legacy-slug section) — change it there, never in the TSV.
