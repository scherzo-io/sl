"use client";

import { useEffect, useRef } from "react";
import type { HomeVideo as Reel } from "@/lib/videos";

/**
 * The homepage reel.
 *
 * Two variants exist because the footage is bright and busy and the sidebar is not: at full
 * strength the wordmark and nav have to compete with it, and under a transparent black they
 * don't. Eric picks. `tint` is the only difference between them — same file, same crop, same
 * playback.
 *
 * Muted and `playsInline` are not preferences: every browser blocks autoplay with sound, and
 * iOS Safari otherwise takes the video fullscreen. The reels carry an audio track that is
 * never played.
 *
 * `prefers-reduced-motion` holds the poster frame and never starts playback — DESIGN §10
 * covers the 800ms transitions, and a 3-minute autoplaying loop is the same promise at a
 * larger scale.
 */
export function HomeVideo({
  reel,
  tint = false,
  scroll = false,
}: {
  reel: Reel;
  /** Lay a transparent black over the footage. */
  tint?: boolean;
  /** Scrolling hero rather than a fixed full-viewport plane. */
  scroll?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) {
        el.pause();
        el.currentTime = 0;
      } else {
        // A rejected play() is normal — a background tab, or a browser that wants a gesture.
        void el.play().catch(() => {});
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className={`relative w-full overflow-hidden bg-sidebar ${scroll ? "min-h-[160vh]" : "h-full"}`}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src={reel.src}
        poster={reel.poster ?? undefined}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label="Streamline USA project reel"
      />
      {tint ? (
        // 45% black. Enough to quiet the footage under the wordmark without greying it out.
        <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
      ) : null}
    </div>
  );
}
