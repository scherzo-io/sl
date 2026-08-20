# The reels carry their own titles, so no video variant can ship on them

Found 2026-08-20, by staging the two WhatsApp reels into the build and watching them play
full-bleed behind the sidebar. This settles what the video homepage variants can and cannot
decide.

## What's there

Two files, inventoried by Cursor in `content/video-inventory.tsv` and staged into the
git-ignored `public/videos` by `scripts/prepare-videos.mjs`:

| | reel-1 | reel-2 |
|---|---|---|
| Duration | 179 s | 300 s |
| Frame | 1024 × 576 | 1024 × 576 |
| Codec | h264 + aac | h264 + aac |
| Loops cleanly | no | no |
| Ends on a STREAMLINE card | yes | yes |

`content/video-inventory.tsv` already recorded all of that. What it did not record — because it
is only visible once the footage is playing at full-bleed — is the finding below.

## Measured evidence

Playing reel-1 as the homepage hero at 1440 × 900, the frame at ~t=8s carries **burned-in
marketing typography across the lower third**:

> BUDGETING & ESTIMATING FOR / ARCHITECTS, DESIGNERS, AND / REAL ESTATE PROFESSIONALS

plus a **STREAMLINE USA logo bug** in the lower right. These are not an end card. They are
composited into the footage for most of its length, at a size that dominates the frame.

The consequence is structural, not cosmetic: the homepage design puts the wordmark in a 200px
sidebar and nothing else over the photography. A hero that carries its own headline and its own
logo fights the layout — twice over, since the logo appears at two different sizes in two
different places on screen.

The black tint (`video-tint`, PLAN §1 row 40) mutes the footage nicely and helps the sidebar
read. It does not help this: tinting a title card produces a dimmer title card.

## The catch

- The variants are still worth having and still worth showing Eric. They answer the question
  *should the homepage move at all* — and 45% black vs full strength is a real, decidable
  choice about how loud that motion should be. That question can be settled on this footage.
- What they cannot answer is *which reel ships*, because neither can.
- 1024 × 576 is also below the 1920 bar the photography has to clear (DESIGN §8). Upscaling it
  is banned for the same reason it is banned for stills.
- Both reels carry an audio track. Playback is muted and always will be — every browser blocks
  autoplay with sound — so the audio is dead weight, not a feature.
- One interior frame in reel-1 shows a third-party watermark (Cursor's note). That is a separate
  rights question from the titles.

## Decision / rule

1. **Ship no video on this footage.** The two video variants are review instruments; the
   homepage cannot launch on either reel.
2. **What to ask Eric for** — this is the specific ask, and it is narrower than "send masters":
   - the same cuts **without** burned-in titles, logo bugs, or the end card
   - at **1920 wide or better**, not WhatsApp-compressed
   - a segment that **loops** — a clean in and out, ideally 10–20 s
   - no audio needed
   - and which reel, if either, is meant for the homepage rather than a project page
3. **Until then** the two stills variants (`still`, `stills`) are the only shippable homepage
   options, and the two video variants stay reviewable-but-not-launchable.
4. If Eric has no such footage, the honest answer is that the homepage is photographic and the
   video variants come off the list — which is a decision, not a failure.

## Reproducing

```bash
npm run videos:prepare        # stages both reels + poster frames into public/videos
npm run build && npm run start
open "http://localhost:8080/?home=video-loop&d=a"   # full strength
open "http://localhost:8080/?home=video-tint&d=a"   # 45% black over it
```

The titles are visible from roughly t=6s onward in reel-1. The reels themselves are not in this
repo and never will be; `content/video-inventory.tsv` holds their local paths and checksums.
