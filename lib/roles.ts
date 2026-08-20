/**
 * PLAN §1 row 13 / CLAUDE.md role mapping.
 * Schema stores the six full atom names, never the inventory's "GC" shorthand.
 * Trim the raw ACF string before looking it up — live data includes
 * `" General Contractor"`.
 */
export const ROLE_ATOMS = [
  "General Contractor",
  "Construction Management",
  "Design Build",
  "Millwork",
  "Carpentry & Finishes",
  "Consulting",
] as const;

export type RoleAtom = (typeof ROLE_ATOMS)[number];

const RAW_TO_ATOMS: Record<string, readonly RoleAtom[]> = {
  "General Contractor": ["General Contractor"],
  "General Contractor + Millwork": ["General Contractor", "Millwork"],
  "General Contractor/Design Build": ["General Contractor", "Design Build"],
  "Construction Manager": ["Construction Management"],
  "Construction Consultant": ["Consulting"],
  "Carpentry + Millwork": ["Carpentry & Finishes", "Millwork"],
  "Carpentry + Finishes": ["Carpentry & Finishes"],
  "Millwork + Finishes": ["Millwork", "Carpentry & Finishes"],
  "Carpentry Millwork + Finishes": ["Carpentry & Finishes", "Millwork"],
};

export function atomsForRawRole(raw: string): RoleAtom[] | null {
  const trimmed = raw.trim();
  const atoms = RAW_TO_ATOMS[trimmed];
  return atoms ? [...atoms] : null;
}
