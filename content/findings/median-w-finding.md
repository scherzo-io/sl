# Four `median_w` disagreements are an even-set convention plus featured-only extras

Found 2026-08-20, by comparing `content/image-audit.tsv` to served `width` in
`inputs/derived/project-images.tsv` and `measured_w` in
`content/images/image-manifest.tsv`. The work order guessed a median-of-even-set
convention. That is half of it. Two of the four slugs also disagree on *n*
because a featured image sits outside the gallery. `image-audit.tsv` is
Alexey’s — this proposes, it does not rewrite.

## What's there

Python’s `statistics.median` on an even list is the mean of the two middle
values. The audit’s `median_w` matches the **high** of that pair on the even
sets, and on Free People it matches that high on the **gallery-only** set of 6
rather than the union of 7.

| slug | audit n / median_w | served n / median | measured n / median | What it is |
|---|---|---|---|---|
| kat-theo | 10 / **1860** | 10 / 1857 | 10 / 1857 | Even set. Middles 1854 and 1860. Audit took high (1860); Python mean is 1857. Same files. |
| madison-ave-duplex-2 | 6 / **1027** | 6 / 982 | 6 / 982 | Even set. Middles 937 and 1027. Audit took high. Measured largest file is 2625 not 2048 (hidden original); that does not move the median. |
| hudson-street-penthouse | 10 / 1280 | **11** / 1280 | 11 / 1280 | Featured-outside-gallery adds one row. Median value happens to stay 1280. |
| free-people-retail-store | 6 / **1107** | **7** / 630 | 7 / 630 | Featured-outside-gallery adds a 513. Gallery-only even set [513, 513, 630, 1107, 1695, 1920]: high-of-middles is 1107. Union of 7: median 630. |

Served and measured medians agree on all four slugs. The audit disagrees with
both, for the two reasons above. Nothing here is a missing file or a wrong
original.

## Measured evidence

`kat-theo` served widths: 818, 820, 896, 1736, 1854, 1860, 1866, 1874, 2048, 2048.

`madison-ave-duplex-2` served: 900, 937, 937, 1027, 1642, 2048. Measured last
value 2625 (`has_larger_original`).

`hudson-street-penthouse`: 11 manifest rows, inventory `images` = 10. Featured
`Hudson-Featured-1.jpg` is outside its own gallery (CLAUDE.md’s set of 8).

`free-people-retail-store`: 7 manifest rows, inventory `images` = 6. Featured
`Free-People-Updated-Featured.jpg` is 513×601 and in no gallery.

## The catch

`lib/projects.ts` still reads `hero_capable` and `featured_dims` from
`image-audit.tsv` (review C-2). Photography itself is joined from the manifest
via `heroFor()`. The four rows do not change a rendered hero today, except
that Free People’s *featured* dims (513×601) are what the tile would use if
`public/photos` were missing. Do not patch `lib/projects.ts` from this lane.

Do not rewrite `image-audit.tsv`.

## Decision / rule

Treat the four disagreements as explained: even-set high-median on the audit,
plus featured-∉-gallery extras on Free People and Hudson. No source-conflicts
row. No PLAN §1 edit. Restate C-2: adopt measured 35/58 and manifest
`featured` / `measured_w` inside Phase F, when someone owns `lib/projects.ts`.

## Reproducing

```bash
python3 - <<'PY'
import csv, statistics
from collections import defaultdict
served, measured = defaultdict(list), defaultdict(list)
with open("inputs/derived/project-images.tsv") as f:
    for r in csv.DictReader(f, delimiter="\t"):
        served[r["project_slug"]].append(int(r["width"]))
with open("content/images/image-manifest.tsv") as f:
    for r in csv.DictReader(f, delimiter="\t"):
        measured[r["project_slug"]].append(int(r["measured_w"]))
audit = {}
with open("content/image-audit.tsv") as f:
    for r in csv.DictReader(f, delimiter="\t"):
        if r.get("slug"): audit[r["slug"]] = r
for slug in ["kat-theo","free-people-retail-store","hudson-street-penthouse","madison-ave-duplex-2"]:
    a = audit[slug]
    print(slug, "audit", a["median_w"], "n", a["images"],
          "served", statistics.median(served[slug]), "n", len(served[slug]),
          "measured", statistics.median(measured[slug]), "n", len(measured[slug]))
PY
```
