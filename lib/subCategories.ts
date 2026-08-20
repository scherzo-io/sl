/**
 * PLAN §1 row 14 — pending Eric.
 * Workbook `filters.tsv` two-level 10-value list. Switching lists is a
 * one-line change of this export. Do not assign values to the 55 unassigned
 * projects.
 */
export const SUBCATEGORIES = [
  "Townhouses",
  "Penthouses",
  "Full-Floor & Duplexes",
  "Apartments & Lofts",
  "Historic Renovations",
  "Restaurants & Bars",
  "Nightlife & Events",
  "Retail & Showrooms",
  "Corporate Offices",
  "Institutional & Community",
] as const;

export type SubCategory = (typeof SUBCATEGORIES)[number];
