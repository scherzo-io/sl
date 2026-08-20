# Handoff — Cursor — after the fix session

**Date:** 2026-08-20 · **From:** Claude Code · **To:** Cursor
**Revision 2** — adds the homepage video variants and the rebuilt variant switcher (§0, §3.2a, §6a)
**Tree:** local `main`, two commits on top of `b802778`. Working tree clean, **not pushed**.
**Supersedes:** `handoff-to-claude.md` (that job is done — see `reviews/claude-2026-08-20.md`).

Paste this as your first message for a cold start. Read it, then §2 before you touch anything.

---

## 0. What changed while you were away

I reviewed both lanes, then fixed the blocker and made photography work. **All of it is on
`main`, and it touches files your work order calls Grok-owned** — that was Alexey's instruction,
not a boundary slip. Re-read your own work order's §7 paths; they are unchanged.

| Fixed | Where |
|---|---|
| **The 404 blocker.** 32 of 73 legacy URLs would have died at cutover. All 73 now terminate at 200, each on production's exact target, in one hop | `content/redirect-decisions.tsv`, `scripts/build-redirects.mjs`, `lib/redirects.ts`, `middleware.ts` |
| **Photography renders.** 887 measured originals wired to `next/image` through a symlink | `lib/photos.ts`, `scripts/link-photos.mjs`, `components/media/*`, `components/patterns/PortfolioWall.tsx` |
| **Trailing slash restored** — `/commercial/<slug>/` is canonical again, honouring PLAN §1 row 3 | `next.config.mjs`, `middleware.ts`, `app/sitemap.ts` |
| `PROGORE` → `Procore` (your correction, finally applied) | `content/copy/proof-points.json` |
| `flags.json` no longer claims your landed work is missing | `content/copy/flags.json` |
| The two `playwright` QA scripts replaced with one that actually runs | `scripts/qa-render.mjs` |
| **Homepage video variants now play** — `video-loop` at full strength and `video-tint` under a 45% black, plus `video-scroll`. Reels staged into a git-ignored `public/videos` | `scripts/prepare-videos.mjs`, `lib/videos.ts`, `components/media/HomeVideo.tsx` |
| **The variant switcher rebuilt.** It read as broken for three real reasons; all three fixed | `components/review/ReviewControls.tsx`, `components/review/ReviewProvider.tsx`, `app/layout.tsx` |
| New gate: alt-text coverage | `scripts/check-alt.mjs`, `npm run check:alt` |
| PLAN §1 rows **33–42** record every decision above; CLAUDE.md gates reworded to match | `PLAN.md`, `CLAUDE.md` |

**Nothing of yours was reverted.** The manifest, checksums, link-check, partner names, brand
sampling and deck corrections are all still exactly as you left them — and three of them turned
out to be load-bearing:

- `content/link-check/2026-08-20.tsv` is what proved the 404 regression. Without your dated
  production sweep the blocker was invisible.
- `content/images/image-manifest.tsv` is what photography now renders from — `source_path` and
  `measured_w/h` per frame.
- `content/images/partners/names.tsv` is what `/partners` renders.

## 1. Do not

- **Do not re-run `node scripts/build-image-manifest.mjs --uploads …` and commit the result**
  unless you mean to. The build now reads the manifest, so a silent change to it changes the site.
- **Do not delete or move `public/photos`.** It is a git-ignored symlink to the dump. If it
  vanishes, every photo slot falls back to the empty dark field and nothing errors — which is by
  design and easy to miss. `npm run photos:link` rebuilds it.
- Do not commit image binaries, video files, the deck PDFs, or anything under `wp-content/`.
- Do not open, OCR or quote the decks' REFERENCES pages (commercial p41, residential p42–43).
- Do not edit `PLAN.md` §1 rows. Propose a new row.
- Do not push. Remote is public and Alexey has not flipped it.
- Do not invent alt text to make `check:alt` pass. That gate exists to stay red until the work
  is done.
- **Do not delete `public/videos/` expecting it to regenerate itself.** `npm run videos:prepare`
  rebuilds it from `content/video-inventory.tsv`; without it the video variants correctly render
  the empty field and the switcher greys them out.
- Do not try to make the reels shippable — no upscaling, no cropping out the burned-in titles.
  See §3.2a.

## 2. First ten minutes

```bash
cd ~/sl && git log --oneline -4
npm run photos:link                       # public/photos -> wp-content/uploads, probe OK
python3 scripts/wxr-extract.py            # assertions failed: 0
npm run typecheck && npm run check:copy
npm run redirects:build && npm run check:redirects -- --offline
npm run videos:prepare                    # stages both reels + poster frames (ffmpeg)
npm run build && npm run check:tokens && npm run check:alt
npm run start &                           # :8080
node scripts/qa-render.mjs                # all checks passed
```

Expected, exactly:

```
redirects.json  301=111 (legacy=37 cross=58 review=16)  skipSlugs=10  reviewUnresolved=0  gone=2  live=58
check-retired-hex: ok (1 css files, 0 retired hexes)
check-alt: 0/887 photographs have descriptive alt (887 to write) — 0/58 projects complete
qa-render: all checks passed
```

If `check-alt` is not 0/887 when you start, someone has been writing alt text — find out who
before you add more.

**One trap that cost me an hour.** `next start` keeps port 8080 even after the shell that
launched it exits, so a stale server serves a stale build and your verification silently tests
the wrong thing. Always `lsof -ti:8080 | xargs kill` before restarting. And images are lazy: in
a background browser tab `document.hidden` is true, nothing intersects, and `complete` stays
false forever. Foreground the tab, or assert on the markup instead of the pixels.

## 3. Your job now, in priority order

### 3.1 The 887 alt-text pass — this is the big one, and it is yours alone

Everything else in the build is done or blocked. This is the last large piece of work, it is the
only one that needs vision, and it now has a gate watching it (`npm run check:alt`).

- Output: `content/images/alt-text.tsv`, columns `attachment_id`, `project_slug`, `alt`,
  `confidence`, `flag`. Keyed by `attachment_id` from `content/images/image-manifest.tsv`.
- **The wiring already exists.** `lib/photos.ts` reads that file the moment it appears and
  prefers it over WordPress's own alt. Land a batch, rebuild, and those frames carry real alt.
- Pattern, from CLAUDE.md: `<Project name> — <room/space>, <notable feature>`.
- The bar, using projects that are now easy to look at:
  - ✅ `Mackage SoHo — storefront, arched cast-iron entry under the 123 transom`
  - ❌ `Mackage SoHo` · `retail interior` · `20230310_10ColumbusBadRoman-1129.jpg`
- Describe what is in the frame. Do not infer a room you cannot see, do not name materials you
  are guessing at, and do not carry a claim from the project description onto a photograph that
  does not show it. Ambiguous frame → plain description plus `flag`, never a confident guess.
- Batch by project (10–22 frames), commit each batch, and let `check:alt` climb. 58 projects.
- Two rows to fix while you are in there: Boqueria's featured image has alt `Boqueria` and Kat &
  Theo's has `Screen Shot 2016-03-02 at 1.48.15 PM`. `lib/photos.ts` already rejects both, which
  is why the count is 887 and not 885 — but they should get real values like everything else.

**Fastest way to see a frame:** `open public/photos/<source_path>` from the manifest, or
`http://localhost:8080/_next/image/?url=%2Fphotos%2F<urlencoded>&w=1200&q=75` in a browser.

### 3.2a The homepage video variants — look, then tell Eric what to send

Two new variants play the reels for real: `?home=video-loop` at full strength and
`?home=video-tint` under a 45% black. The tint exists because the footage is bright and busy
and the sidebar is not; muting it lets the red wordmark and nav read. Both are worth showing
Eric, because they settle *should the homepage move at all* — a real question with a real answer.

**What they cannot settle is which reel ships, because neither can.** Playing them full-bleed
turned up something the inventory could not: both reels carry **burned-in marketing typography
across the lower third** — "BUDGETING & ESTIMATING FOR / ARCHITECTS, DESIGNERS, AND / REAL
ESTATE PROFESSIONALS" — plus a **STREAMLINE logo bug**, for most of their length, not just an
end card. A hero carrying its own headline and logo fights a layout built around a wordmark in a
200px sidebar over silent photography. Tinting a title card gives you a dimmer title card.

Full write-up and the exact ask in `content/findings/homepage-video-finding.md`. Your job here:

- Watch both variants at 390 and 1440 and say whether motion helps the design at all, tinted or
  not. You are the lane that can watch it.
- Check the tint value. 45% was chosen by eye against the wordmark; if 35% or 55% reads better
  over this footage, say so with a screenshot — it is one number in `HomeVideo.tsx`.
- Confirm the poster frame is a sensible still (it is grabbed at t=4s by ffmpeg, and it is what
  shows under `prefers-reduced-motion`).
- Do **not** attempt to salvage the footage. No upscaling from 1024×576, no cropping to hide the
  titles, no re-encode. Those are all invented content in a different costume.

### 3.2 Look at what the photography actually did to the design

You are the only lane that can. The build now renders real images, so several DESIGN §8
questions have visible answers for the first time:

- **The four all-square projects** — Lantern House, The Pierre, 652 Hudson, 40 E 66th. Direction
  A pillarboxes them (`HeroSlot`); B and C crop with `object-cover`. Look at all three and say
  which treatment survives contact with the actual photographs. DESIGN §8 lists four options and
  nobody has seen any of them rendered.
- **The six unusable-at-full-bleed projects** — 12th St Townhouse (640×295), E63rd St Penthouse,
  Lexington Ave, West 23rd, Horatio St, plus the Free People and Spring Studios featured images.
  They now render. How bad is it, honestly, at 1440?
- **The hero picks.** `heroFor()` in `lib/photos.ts` scores hero-capable, then landscape, then
  featured, then width. Spot-check a dozen: is the chosen frame the one a human would choose?
  Where it isn't, that is a finding, and possibly a `heroOverride` column in the manifest.
- **The ragged wall.** Tiles use each hero's measured aspect. At 1440 the rows should be ragged
  per DESIGN §4 B, not gridded.

Write it up as a finding, with screenshots if they help. Do not restyle anything — that is a
design decision, and Eric has not picked a direction yet.

### 3.3 Re-run your own gates against the new tree

Cheap, and worth it because the tree moved under your artifacts:

- `content/images/image-manifest.tsv` is now a **build input**. Confirm the site's 887 frames
  match it (`node scripts/qa-render.mjs` proves wiring, not correctness).
- The 4 `median_w` disagreements with `content/image-audit.tsv` are still unreconciled
  (`kat-theo`, `free-people-retail-store`, `hudson-street-penthouse`, `madison-ave-duplex-2`).
  Note `lib/projects.ts` still reads `image-audit.tsv` for `featuredWidth/Height` and
  `heroCapable`, so those four rows feed the build. Worth closing now.
- `heroCapable` in the build still comes from `image-audit.tsv`'s 34, not your measured **35**.
  `lib/projects.ts:67`. Proposed as a PLAN row and not applied — flag if you want it adopted.

### 3.4 Still deferred, still yours, still correct to defer

The 876 unreferenced library images, the ten client PNGs in `Images_Streamline/`, and the
Builder kill-list re-check. Bar B put them out of scope and nothing since changes that.

## 4. What is blocked on Alexey, not you

Do not work around these; note them and move on.

| Blocked | Detail |
|---|---|
| **Repo is public** | Everything reviewed and fixed is already on a public remote. Flip it private. Grok flagged this and declined to push for exactly this reason; the push happened anyway |
| **Eric's email** | `content/eric-email.md`, drafted, unsent. 21 conflict rows, the taxonomy, pipeline content, WP 564/558, publishable phones |
| **Sanity project + token** | Phase F cannot start. No `projectId`, no `.env`, no ingest scripts — correctly |
| **Video masters** | Worse than the inventory suggested: burned-in titles and a logo bug run through most of both reels, at 1024×576. The variants now *play*, so Eric can judge motion — but nothing ships on this footage. The specific ask (no titles, no logo bug, no end card, ≥1920, loops, audio not needed) is in `content/findings/homepage-video-finding.md` |
| **Partner artwork** | Names render; marks cannot come from the decks at all (`content/findings/deck-raster-finding.md`) |
| **WP 564 / WP 558** | `content/redirect-decisions.tsv` preserves today's production behaviour. When Eric confirms, flip one row and re-run `npm run redirects:build` — note production currently sends `washington-sq-dermatology` **to** `upper-east-side-townhouse`, the opposite of the planned fix |

## 5. How the redirect layer works now

Read this before touching anything in it. Three sources of 301, 111 rules total:

1. **37** unambiguous rows from `inputs/derived/legacy-slugs.tsv` (`verdict=301`).
2. **58** cross-category rules, one per live slug: `/residential/<commercial-slug>/` 301s to the
   canonical path. WordPress matched old slugs ignoring the category segment, so these URLs work
   today and would have 404'd. This is what fixes 7 of the 11 SKIP rows.
3. **16** resolved REVIEW paths from `content/redirect-decisions.tsv`. Each old slug had two
   claimants, so the target is a recorded decision measured from production on 2026-08-20 — not
   a guess, and validated at build time to be a live path.

The invariant that matters, enforced in both the builder and the checker: **a path that serves a
project today is never redirected.** `lookupRedirect` checks live paths before the redirect map.

To change a target: edit `content/redirect-decisions.tsv`, run `npm run redirects:build`, run
`npm run check:redirects -- --offline`. Never hand-edit `content/copy/redirects.json`.

## 6a. The variant switcher, and why it looked broken

It genuinely was, in three separate ways — worth knowing so you do not re-report them:

1. **It did not look like a control.** The word "Review" sat in the sidebar footer among the nav
   links. It is now a bordered button reading "Review options" with the current selection under
   it ("Faithful · One photograph"), opening a 320px panel *over* the content rather than inside
   the 200px column.
2. **The Homepage group is genuinely inert under direction C.** Archive renders an index, not a
   hero, so clicking those options did nothing and looked dead. The group is now disabled with
   the legend "Homepage · not used by Archive".
3. **Picking a video variant produced a blank screen** because no reel was staged. Unavailable
   variants are now greyed with "no reel staged — run npm run videos:prepare", driven by
   server-resolved capabilities (`photos`, `video`) threaded through `ReviewProvider`.

Plus **Reset to defaults**, because the choice persists in `localStorage` — a reviewer who
landed on an empty variant previously had no way back, which is most of why it read as broken.
Esc closes the panel. If you change variants, `HOME_LABEL` and `HOME_HINT` in `lib/review.ts`
are what a reviewer actually reads; keep them plain-language.

## 6. How photography works now

```
inputs/derived/project-images.tsv   gallery order, featured flag, WP's own alt
content/images/image-manifest.tsv   your measured originals: source_path, measured_w/h
content/images/alt-text.tsv         descriptive alt — does not exist yet, read the moment it does
        │
        └── lib/photos.ts  joins on attachment_id → ProjectPhoto[]
                 │
                 ├── LiveProject.hero        (one per project, scored)
                 └── photosFor(slug)         (full gallery, passed to ProjectView)
                          │
                 public/photos → wp-content/uploads   (symlink, git-ignored)
                          │
                 next/image → WebP, resized on demand, nothing committed
```

Details that will bite you if you don't know them:

- **WebP only, on purpose.** AVIF encoded fine but decoded to a blank frame in the review
  browser. `next.config.mjs` says why. Don't "improve" it back to AVIF without testing in the
  browser Eric will use.
- **`trailingSlash: true`** means the optimizer endpoint is `/_next/image/?url=` — with the
  slash. Any script matching the old shape silently finds zero images. Mine did.
- **Heroes are `priority`**, index tiles stay lazy. A full-bleed hero is the LCP element.
- **No dump, no error.** `photosAvailable()` false → every slot renders the empty dark field.
  Deliberate, so a fresh clone builds, and easy to mistake for a bug.

## 7. Before you stop

The protocol, unchanged: commit at every checkpoint; write
`workorders/sessions/2026-08-20-cursor-06.md` (or next free `NN`) from the template; update
`workorders/STATUS.md` — **Last updated**, **In flight**, **Next up**. Say what you skipped.

Your session log's **Next step** should be the single most useful thing the next session does.
If that turns out to be "Alexey decides X", say so plainly rather than inventing work.
