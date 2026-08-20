import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Index tiles from content/image-audit.tsv (Alexey's registry companion).
 * Aspect comes from featured_dims — native, never invented.
 * Titles stay off the grid (DESIGN §4 Pattern B).
 * Skips the TOTALS row.
 */
export type ProjectTile = {
  wpId: string;
  category: "commercial" | "residential";
  slug: string;
  featuredWidth: number;
  featuredHeight: number;
  heroCapable: boolean;
};

let cache: ProjectTile[] | undefined;

function auditPath(): string {
  return join(process.cwd(), "content/image-audit.tsv");
}

export function loadProjectTiles(): ProjectTile[] {
  if (cache) return cache;
  const raw = readFileSync(auditPath(), "utf8");
  const lines = raw.split("\n");
  const header = lines[0]?.split("\t");
  if (!header) throw new Error("image-audit.tsv: missing header");
  const col = Object.fromEntries(header.map((h, i) => [h, i]));
  const need = ["wp_id", "category", "slug", "featured_dims", "hero_capable"] as const;
  for (const key of need) {
    if (col[key] === undefined) throw new Error(`image-audit.tsv: missing column ${key}`);
  }
  const tiles: ProjectTile[] = [];
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const cells = line.split("\t");
    const wpId = cells[col.wp_id!] ?? "";
    if (wpId === "TOTALS") continue;
    const category = cells[col.category!]!;
    if (category !== "commercial" && category !== "residential") {
      throw new Error(`image-audit.tsv: unexpected category ${category}`);
    }
    const dims = cells[col.featured_dims!] ?? "";
    const match = /^(\d+)x(\d+)$/.exec(dims);
    if (!match) throw new Error(`image-audit.tsv: bad featured_dims '${dims}' on ${wpId}`);
    tiles.push({
      wpId,
      category,
      slug: cells[col.slug!]!,
      featuredWidth: Number(match[1]),
      featuredHeight: Number(match[2]),
      heroCapable: (cells[col.hero_capable!] ?? "").startsWith("YES"),
    });
  }
  if (tiles.length !== 58) {
    throw new Error(`image-audit.tsv: expected 58 projects, got ${tiles.length}`);
  }
  cache = tiles;
  return tiles;
}
