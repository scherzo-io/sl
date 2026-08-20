Dump has **zero** video files (`.mp4`, `.mov`, `.webm`, `.m4v`) under `wp-content/` as of **2026-08-20**.

Command: `find /Users/alexeyetcheverry/sl/wp-content -type f \( -iname '*.mp4' -o -iname '*.mov' -o -iname '*.webm' -o -iname '*.m4v' \) | wc -l` → **0**

No `content/video-inventory.tsv` created (nothing to inventory).

## Questions for Alexey

1. **Files + destination** — If/when video assets surface, where do the source files live and what is the publish path **outside the repo**?
2. **End logos stripped?** — Should reel end-cards / partner logos be removed before web embed?
3. **Hosting** — Self-hosted on Vercel/blob, YouTube, or Vimeo?
4. **Variant / project** — Which cut(s) map to which project or site section?
5. **Poster frames** — Static poster from which frame (or separate still)? Who supplies?
