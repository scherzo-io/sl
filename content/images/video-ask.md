Dump under `wp-content/` still has **zero** video files as of **2026-08-20**.

Alexey dropped two WhatsApp MP4s on the repo root the same day. They were **moved out of the repo** (PLAN §1 row 32 — binaries never enter git) to:

`/Users/alexeyetcheverry/Downloads/Zipcodes/Streamline USA/videos/`

Inventory: `content/video-inventory.tsv`. Reproduce hashes with `shasum -a 256` on that folder.

## What the two files are

| | 10.46.02 AM | 11.11.32 AM |
|---|---|---|
| Duration | 2:59 | 4:59 |
| Picture | 1024×576 h264 @ ~24fps | same |
| Audio | AAC stereo | AAC stereo |
| Loops cleanly | no | no |
| End logo | **yes** — STREAMLINE USA card + CTA | **yes** — same card |

Neither is usable as a homepage loop or scrolling hero **as-is**. PLAN §12 asked Eric for cuts without end logos; these still have them. Resolution is WhatsApp-grade, not a camera original.

Homepage video variants stay **declared, not buildable** until there is a no-logo cut (or a trim decision) and a hosting choice.

## Still open (Alexey / Eric)

1. **Hosting** — self / YouTube / Vimeo. `video` doc type is modelled on a YouTube ID (PLAN §8). Self-host is a schema question for Grok.
2. **Which cut goes where** — homepage loop vs hero vs a project page. Not marked on the files.
3. **Poster frames** — none supplied. A frame can be pulled locally; none committed (end cards carry a personal email; interiors include identifiable people).
4. **End logos** — confirm these two should be trimmed, or that new cuts are coming.
5. **Better masters** — these are WhatsApp transfers. If ProRes / full-res exists, that is the upload source.

Do not invent a YouTube ID, a project mapping, or a poster.
