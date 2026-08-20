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

The library holds **1,744 images but only 938 are attached to projects** — roughly 800 unattached. Could be alternate takes, unused shoots, or junk. Worth a look before assuming a project's photography is limited to what's currently linked.

## How we use them — no download needed

The originals are public URLs, so:

- **Design previews** reference them directly. No local files, nothing to wait for.
- **Sanity migration** uses the `_sanityAsset` directive with the original URL — Sanity fetches server-side and generates its own responsive derivatives. Never point production at the legacy WordPress CDN.

That avoids a ~1.5 GB local download entirely. The one thing worth doing anyway is keeping a cold backup of the uploads directory, since the originals only exist on that one server.

## Migration rule: what "attached" means

**Decision: migrate only images used by a project. 880 in, 864 dropped.**

One trap to avoid. WordPress has its own `post` field recording which post an attachment was uploaded to — and it disagrees with reality here:

| | Count |
|---|---|
| Unique images used in project galleries | **880** |
| …of which WordPress records a parent post | 743 |
| …of which WordPress records **`post: 0`** | **137** |

Those 137 are live project photography — they show on the site right now — but they were uploaded through the media library rather than from inside a post, so WordPress considers them unattached.

So the filter is **"referenced by ACF `project_gallery` or `_thumbnail_id`"**, never WordPress's attachment parent. Filtering on `post` would silently drop 137 real photographs and nobody would notice until a gallery looked short.

Genuinely unused: **864 of 1,744** library images are referenced by no project. Those are out of scope.

## Reproducing the manifest

Requires an authenticated session (the media endpoint returns empty anonymously). `scripts/build-image-manifest.mjs` in this repo regenerates the full per-image manifest — scaled URL, original URL, true dimensions — at migration time.
