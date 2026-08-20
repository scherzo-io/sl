/**
 * Single source for DESIGN.md §2–3 / PLAN §1 rows 11–12.
 * CSS variables in app/globals.css must match these values exactly.
 * Do not add colour tokens. The retired set is grepped by scripts/check-retired-hex.mjs.
 */
export const tokens = {
  ink: "#000000",
  inkSoft: "#2D2D2D",
  paper: "#FFFFFF",
  sidebar: "#1A1A1A",
  rule: "#FAFAFA",
  /** Wordmark, hairlines, red text on white. 4.97:1 on paper. Large type / hairlines on sidebar only. */
  red: "#DA2128",
  /** Normal-size red text on sidebar. 4.62:1. */
  redOnDark: "#E25257",
  motion: "all 0.8s",
  motionMs: 800,
  sidebarWidthPx: 200,
  tileWidthPx: 332,
  gutterPx: 4,
  navRhythmPx: 52,
  contentColumnPx: 400,
  type: {
    /** Wordmark tagline slot only — letterspaced tiny caps. Not body. */
    xs: 14.56,
    sm: 16,
    md: 19.2,
    lg: 20.8,
  },
} as const;
