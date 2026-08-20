#!/usr/bin/env node
/**
 * Stage the homepage reels into public/videos (git-ignored) so the video variants play.
 *
 * Source of truth is `content/video-inventory.tsv` — Cursor's inventory, which carries the
 * local path, duration, dimensions and the end-logo flag for each file. The binaries live
 * outside the repo and never enter it (PLAN §7, CLAUDE.md).
 *
 * For each reel:
 *   - remux to `public/videos/<id>.mp4` with `-movflags +faststart` so playback begins
 *     immediately instead of after the whole 30 MB file arrives. Stream copy, no re-encode:
 *     not one pixel is altered.
 *   - extract a real poster frame to `public/videos/<id>.jpg` — a frame from Streamline's own
 *     footage, so nothing is invented and there is no black flash before play starts.
 *   - write `public/videos/index.json` for lib/videos.ts.
 *
 * Without ffmpeg it falls back to a plain copy and no poster. Without the sources it exits 1
 * and the variants keep rendering the empty field, which is the correct fresh-clone state.
 *
 *   node scripts/prepare-videos.mjs
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/videos");

function have(bin) {
  try {
    execFileSync("which", [bin], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const ffmpeg = have("ffmpeg");

const tsvPath = join(root, "content/video-inventory.tsv");
if (!existsSync(tsvPath)) {
  console.error("prepare-videos: content/video-inventory.tsv missing — nothing to stage.");
  process.exit(1);
}
const lines = readFileSync(tsvPath, "utf8").split("\n").filter((l) => l.trim());
const header = lines[0].split("\t");
const rows = lines.slice(1).map((l) => {
  const c = l.split("\t");
  return Object.fromEntries(header.map((h, i) => [h, c[i] ?? ""]));
});

mkdirSync(outDir, { recursive: true });

const manifest = [];
let staged = 0;

rows.forEach((r, i) => {
  const src = r.local_path;
  const id = `reel-${i + 1}`;
  if (!src || !existsSync(src)) {
    console.error(`prepare-videos: ${id} source missing — ${src || "(no local_path)"}`);
    return;
  }
  const mp4 = join(outDir, `${id}.mp4`);
  const jpg = join(outDir, `${id}.jpg`);

  if (ffmpeg) {
    // Stream copy + faststart. No transcode, so the footage is untouched.
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-c", "copy",
      "-movflags", "+faststart", mp4]);
    // A real frame, four seconds in — past any fade-up, well before the end card.
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", "4", "-i", src,
      "-frames:v", "1", "-q:v", "3", jpg]);
  } else {
    copyFileSync(src, mp4);
  }

  manifest.push({
    id,
    src: `/videos/${id}.mp4`,
    poster: ffmpeg && existsSync(jpg) ? `/videos/${id}.jpg` : null,
    width: Number(r.width) || null,
    height: Number(r.height) || null,
    durationS: Number(r.duration_s) || null,
    hasAudio: r.has_audio === "yes",
    endLogo: r.end_logo === "yes",
    loopsCleanly: r.loops_cleanly === "yes",
    note: r.notes ?? "",
  });
  staged += 1;
});

if (staged === 0) {
  console.error("prepare-videos: staged nothing.");
  process.exit(1);
}

writeFileSync(join(outDir, "index.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `prepare-videos: staged ${staged} reel(s) into public/videos` +
    (ffmpeg ? " with faststart + poster frames" : " (no ffmpeg: plain copy, no posters)"),
);
for (const m of manifest) {
  console.log(
    `  ${m.id}  ${m.width}x${m.height}  ${Math.round(m.durationS)}s` +
      `${m.endLogo ? "  END LOGO PRESENT" : ""}${m.loopsCleanly ? "" : "  does not loop cleanly"}`,
  );
}
