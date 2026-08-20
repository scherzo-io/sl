/**
 * Unresolved source-conflicts.md section A → skip the field (do not pick a winner).
 * Keys are live slugs.
 */
export type SkipField =
  | "size"
  | "role"
  | "location"
  | "designer"
  | "architect";

export const SKIP_FIELDS: Record<string, readonly SkipField[]> = {
  "bad-roman-columbus-circle-mall": [
    "size",
    "role",
    "location",
    "designer",
    "architect",
  ],
  "kat-theo": ["size"],
  "burger-lobster": ["designer", "architect"],
  "boqueria-restaurant": ["location"],
  "indeed-corporate-office-suite": ["location"],
  mexicue: ["location"],
  "momofuku-noodle-bar-171-1st-ave": ["size"],
  "262-mott-st": ["size"],
  "700-park-ave": ["size", "designer", "architect"],
  "40-e66th-st": ["size", "designer"],
  "vivvi-daycare-tribeca": ["designer", "architect"],
  "vivvi-daycare-hudson-yards": ["designer", "architect"],
};

export function skips(slug: string, field: SkipField): boolean {
  return SKIP_FIELDS[slug]?.includes(field) ?? false;
}

/** Entirely 2048×2048 — DESIGN §8. Direction A pillarboxes these. */
export const SQUARE_SLUGS = [
  "lantern-house",
  "795-5th-ave-the-pierre",
  "652-hudson-st",
  "40-e66th-st",
] as const;
