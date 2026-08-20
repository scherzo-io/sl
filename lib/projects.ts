import { readFileSync } from "node:fs";
import { join } from "node:path";
import { heroFor } from "@/lib/photos";
import type { LiveProject, ProjectTile } from "@/lib/projectTypes";
import { atomsForRawRole } from "@/lib/roles";
import { SKIP_FIELDS, SQUARE_SLUGS, type SkipField } from "@/lib/skipFields";

export type { LiveProject, ProjectTile } from "@/lib/projectTypes";
export { formatSqFt, projectHref } from "@/lib/projectTypes";
export { photosAvailable, photosFor } from "@/lib/photos";
export type { ProjectPhoto } from "@/lib/photos";

function rootFile(rel: string) {
  return join(process.cwd(), rel);
}

function tsv(rel: string) {
  const raw = readFileSync(rootFile(rel), "utf8");
  const lines = raw.split("\n");
  const header = lines[0]?.split("\t");
  if (!header) throw new Error(`${rel}: missing header`);
  const col = Object.fromEntries(header.map((h, i) => [h, i]));
  const rows: Record<string, string>[] = [];
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const cells = line.split("\t");
    const rec: Record<string, string> = {};
    for (const [k, i] of Object.entries(col)) rec[k] = cells[i] ?? "";
    rows.push(rec);
  }
  return rows;
}

/** WordPress stores & as `&#038;` in titles. Decode entities; do not rewrite spelling. */
function unescapeEntities(s: string) {
  return s
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&/g, "&");
}

let tileCache: ProjectTile[] | undefined;
let liveCache: LiveProject[] | undefined;

export function loadProjectTiles(): ProjectTile[] {
  if (tileCache) return tileCache;
  const tiles: ProjectTile[] = [];
  for (const rec of tsv("content/image-audit.tsv")) {
    if (rec.wp_id === "TOTALS") continue;
    const category = rec.category;
    if (category !== "commercial" && category !== "residential") {
      throw new Error(`image-audit.tsv: unexpected category ${category}`);
    }
    const match = /^(\d+)x(\d+)$/.exec(rec.featured_dims ?? "");
    if (!match) {
      throw new Error(`image-audit.tsv: bad featured_dims on ${rec.wp_id}`);
    }
    const imageCount = Number(rec.images);
    if (!Number.isFinite(imageCount) || imageCount < 1) {
      throw new Error(`image-audit.tsv: bad images on ${rec.wp_id}`);
    }
    tiles.push({
      wpId: rec.wp_id!,
      category,
      slug: rec.slug!,
      featuredWidth: Number(match[1]),
      featuredHeight: Number(match[2]),
      heroCapable: (rec.hero_capable ?? "").startsWith("YES"),
      imageCount,
      hero: heroFor(rec.slug!),
    });
  }
  if (tiles.length !== 58) {
    throw new Error(`image-audit.tsv: expected 58 projects, got ${tiles.length}`);
  }
  tileCache = tiles;
  return tiles;
}

function blankArchitect(raw: string, status: string): boolean {
  const t = raw.trim();
  if (status === "missing" || status === "pseudo-blank") return true;
  if (!t || t === "None" || t === "None Involved") return true;
  return false;
}

function descriptionBySlug(): Map<string, string[]> {
  const raw = JSON.parse(
    readFileSync(rootFile("content/copy/portable-text/projects.json"), "utf8"),
  ) as {
    projects: {
      slug: string;
      description: { children?: { text?: string }[] }[];
    }[];
  };
  const map = new Map<string, string[]>();
  for (const p of raw.projects) {
    const paras = p.description
      .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
      .map((t) => unescapeEntities(t.trim()))
      .filter(Boolean);
    map.set(p.slug, paras);
  }
  return map;
}

export function loadLiveProjects(): LiveProject[] {
  if (liveCache) return liveCache;
  const tiles = new Map(loadProjectTiles().map((t) => [t.slug, t]));
  for (const slug of Object.keys(SKIP_FIELDS)) {
    if (!tiles.has(slug)) throw new Error(`SKIP_FIELDS unknown slug: ${slug}`);
  }
  for (const slug of SQUARE_SLUGS) {
    if (!tiles.has(slug)) throw new Error(`SQUARE_SLUGS unknown slug: ${slug}`);
  }
  const desc = descriptionBySlug();
  const live: LiveProject[] = [];
  for (const rec of tsv("content/content-inventory.tsv")) {
    if (rec.status !== "live") continue;
    const slug = rec.slug!;
    const tile = tiles.get(slug);
    if (!tile) throw new Error(`inventory slug missing from image-audit: ${slug}`);
    const skipped = SKIP_FIELDS[slug] ?? [];
    const skip = (f: SkipField) => skipped.includes(f);
    const rawRole = unescapeEntities((rec.role_raw_live ?? "").trim());
    const atoms = atomsForRawRole(rawRole);
    const sizeRaw = (rec.size_sqft_live ?? "").trim();
    const size = sizeRaw ? Number(sizeRaw) : Number.NaN;
    const designer = unescapeEntities((rec.designer_live ?? "").trim());
    const architectRaw = unescapeEntities((rec.architect_live ?? "").trim());
    live.push({
      ...tile,
      title: unescapeEntities(rec.title!),
      location: skip("location") ? null : unescapeEntities(rec.location_live ?? "").trim() || null,
      sizeSqFt: skip("size") || !Number.isFinite(size) ? null : size,
      roles: skip("role") ? null : atoms,
      roleDetail: skip("role") ? null : rawRole || null,
      designer: skip("designer") ? null : designer || null,
      architect:
        skip("architect") || blankArchitect(architectRaw, rec.architect_status ?? "")
          ? null
          : architectRaw,
      description: desc.get(slug) ?? [],
      subCategory: rec.sub_category?.trim() || null,
      square: (SQUARE_SLUGS as readonly string[]).includes(slug),
      skipped,
    });
  }
  if (live.length !== 58) {
    throw new Error(`inventory: expected 58 live projects, got ${live.length}`);
  }
  liveCache = live;
  return live;
}

export function projectBySlug(slug: string): LiveProject | undefined {
  return loadLiveProjects().find((p) => p.slug === slug);
}

export function siblings(
  p: LiveProject,
  scope: "category" | "all" = "category",
): LiveProject[] {
  const all = loadLiveProjects();
  return scope === "all" ? all : all.filter((x) => x.category === p.category);
}
