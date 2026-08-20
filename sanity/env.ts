/**
 * Sanity connection — empty until Alexey creates a project (README §5).
 * Phase C writes the schema against these names; do not call schema deploy.
 */
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "staging";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const apiVersion = "2026-08-20";

export function hasSanityProject(): boolean {
  return projectId.length > 0;
}
