# Hidden originals in the WordPress media library

Found August 19 2026, via the authenticated REST media endpoint. This materially improves what the full-bleed design can do.

## What's there

WordPress scaled every large upload down and has been serving the scaled copy ever since. The full-resolution files are still on disk, reachable at their own URL.

| | Count |
|---|---|
| Images in the media library | 1,744 (1,760 media items total) |
| **With a larger original on disk** | **791** |
| Of the 880 project gallery images | **387 (44%)** |
| Projects affected | **28 of 58** |

## Measured uplift

Six probes, actual `naturalWidth` of the original file:

| Project | Being served | Actual original |
|---|---|---|
| Bad Roman | 1920×1280 | **3600×2400** |
| Vivvi Daycare Hudson Yards | 2048×1366 | **3600×2400** |
| Kith | 2048 | **3024×4032** |
| Mint Kitchen | 2048×1366 | **5600×3733** |
| Wyckoff Townhouse | 2048×1365 | **3600×2399** |
| Tribeca Loft | 1920×2560 | **3024×4032** |

3.5× to 7× the pixel count. Mint Kitchen is a full camera original.

## The catch

The uplift lands almost entirely on projects that were **already** ≥1920px. The genuinely low-resolution projects have no bigger version — 640px really is the original:

- 12th St Townhouse — 640×295, all 12 images, no originals
- E63rd St Penthouse — 640×392, 5 images, no originals
- Lexington Ave Townhouse — 599×399, no originals
- West 23rd Townhouse — 990px, no originals
- Horatio St Townhouse — 990px, no originals

Five projects have exactly **one** upgradeable image out of 6–17: Free People, Spring Studios, St Luke's Place, Madison Ave Duplex, Gunter Seeger.

So hero-capability stays at roughly 34 of 58. What changes is that those 34 go from *adequate* to *genuinely excellent* on retina and 4K displays — which matters a lot in a design that is nothing but full-bleed photography.

## Also worth knowing

The library holds **1,744 images, of which 887 unique files are referenced by projects** —
roughly 857 unreferenced. Could be alternate takes, unused shoots, or junk. Worth a look
before assuming a project's photography is limited to what's currently linked.

> Corrected 2026-08-20 (REST-verified). This section originally said "938 attached" — that
> was 880 gallery references + 58 featured references without dedupe. In reality **featured
> images are usually inside their project's gallery, but not always**: 8 projects have a
> featured image outside their own gallery (Free People, Hudson St Penthouse, Madison Ave
> Duplex, St Luke's Place, West 23rd Townhouse, Indeed, Atrium, 700 Park Ave), and 7 of those
> files appear in no gallery at all. 880 + 7 = **887 unique referenced files**.

## How we use them — no download needed

The originals are public URLs, so:

- **Design previews** reference them directly. No local files, nothing to wait for.
- **Sanity migration** uses the `_sanityAsset` directive with the original URL — Sanity fetches server-side and generates its own responsive derivatives. Never point production at the legacy WordPress CDN.

That avoids a ~1.5 GB local download entirely. The one thing worth doing anyway is keeping a cold backup of the uploads directory, since the originals only exist on that one server.

## Migration rule: what "attached" means

**Decision: migrate only images used by a project — `project_gallery` ∪ `_thumbnail_id` =
887 in, ~857 dropped.** (Corrected 2026-08-20; the earlier "880 in, 864 dropped" assumed
featured ⊆ gallery, which is false for 8 projects and would have silently dropped 7 featured
images — including hero sources.)

One trap to avoid. WordPress has its own `post` field recording which post an attachment was uploaded to — and it disagrees with reality here:

| | Count |
|---|---|
| Unique images used in project galleries | **880** |
| …of which WordPress records a parent post | 743 |
| …of which WordPress records **`post: 0`** | **137** |

Those 137 are live project photography — they show on the site right now — but they were uploaded through the media library rather than from inside a post, so WordPress considers them unattached.

So the filter is **"referenced by ACF `project_gallery` or `_thumbnail_id`"**, never WordPress's attachment parent. Filtering on `post` would silently drop 137 real photographs and nobody would notice until a gallery looked short.

Genuinely unused: **~857 of 1,744** library images are referenced by no project. Those are
out of scope. (The 1,744 library total is measured-from-live 19 Aug via the authenticated
media endpoint and not yet reproducible from this repo — the manifest script re-verifies both
totals at migration time.)

## Reproducing the manifest

Requires an authenticated session (the media endpoint returns empty anonymously).
`scripts/build-image-manifest.mjs` regenerates the full per-image manifest — scaled URL,
original URL, true dimensions — at migration time. **Status: not yet written** (PLAN §11
step 4); until it exists, the 1,744 / 791 / 387 / 137 numbers above are dated live
measurements, not repo-reproducible facts. The 880 gallery total and the 887 union ARE
reproducible: `content/image-audit.tsv` and the anonymous posts endpoint.

> Disk cross-check, 2026-08-20: the WordPress dump landed locally (`wp-content/`,
> git-ignored). `uploads/` holds 25,750 image files including all derivatives; 3,831
> non-derivative originals and 1,578 `-scaled` copies. Both bound the API-measured figures
> plausibly (disk > library because uploads include orphans and deleted-attachment files)
> but do not replace the authenticated manifest. The dump also satisfies the cold-backup
> requirement — keep a copy somewhere that isn't this laptop.
