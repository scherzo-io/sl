import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The homepage reels.
 *
 * Staged into the git-ignored `public/videos` by `scripts/prepare-videos.mjs`, which reads
 * Cursor's `content/video-inventory.tsv` for the local paths. No binary is committed.
 *
 * What is actually available today, and it matters for what these variants can prove:
 * two WhatsApp-compressed reels at 1024×576, 179s and 300s, with audio, that do not loop
 * cleanly and end on a STREAMLINE USA card. They are enough to judge whether a moving
 * homepage is the right idea. They are not launch assets — that needs masters from Eric
 * (PLAN §12, review claude-2026-08-20 C-3).
 */

export type HomeVideo = {
  id: string;
  src: string;
  poster: string | null;
  width: number | null;
  height: number | null;
  durationS: number | null;
  hasAudio: boolean;
  endLogo: boolean;
  loopsCleanly: boolean;
  note: string;
};

let cache: HomeVideo[] | undefined;

export function homeVideos(): HomeVideo[] {
  if (cache) return cache;
  const file = join(process.cwd(), "public/videos/index.json");
  if (!existsSync(file)) {
    cache = [];
    return cache;
  }
  try {
    cache = JSON.parse(readFileSync(file, "utf8")) as HomeVideo[];
  } catch {
    cache = [];
  }
  return cache;
}

/** The reel a video variant plays. First staged file; null when nothing is staged. */
export function primaryVideo(): HomeVideo | null {
  return homeVideos()[0] ?? null;
}
