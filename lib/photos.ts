import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The photography layer.
 *
 * Three files are joined on `attachment_id`:
 *
 * - `inputs/derived/project-images.tsv` — gallery order, featured flag, and WordPress's
 *   own alt (2 of 887 rows, both useless: a project name and a screenshot filename).
 * - `content/images/image-manifest.tsv` — Cursor's measured originals. `source_path` is the
 *   chosen file (the hidden full-size original where one exists, never an Imagify `.webp`)
 *   and `measured_w/h` are real pixels off disk, not what WordPress recorded.
 * - `content/images/alt-text.tsv` — descriptive alt, when it exists. It does not yet
 *   (887 to write, Cursor's lane), so `alt` is null for every photo today. Nothing here
 *   invents a description; see `altPolicy` below.
 *
 * Files are served through `public/photos`, a symlink to the git-ignored `wp-content/uploads`.
 * `next/image` does the resizing, so no derivative is ever committed and production never
 * points at the legacy WordPress CDN. If the symlink is missing — a fresh clone with no dump —
 * `photosAvailable()` is false and every slot falls back to the empty dark field.
 */

export type ProjectPhoto = {
  id: string;
  /** Public URL through the symlink, e.g. `/photos/2019/12/OPRY1.jpg`. */
  src: string;
  width: number;
  height: number;
  position: number;
  isFeatured: boolean;
  heroCapable: boolean;
  square: boolean;
  /** Descriptive alt, or null while `alt-text.tsv` is unwritten. Never a guess. */
  alt: string | null;
};

function rootFile(rel: string) {
  return join(process.cwd(), rel);
}

function tsv(rel: string): Record<string, string>[] {
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

let availableCache: boolean | undefined;

/** True when the dump is symlinked at `public/photos`. */
export function photosAvailable(): boolean {
  if (availableCache === undefined) {
    availableCache = existsSync(rootFile("public/photos"));
  }
  return availableCache;
}

/**
 * WordPress's two existing alt values are worthless under the CLAUDE.md rule — one is the
 * project name, one is `Screen Shot 2016-03-02 at 1.48.15 PM`. Neither is a description, so
 * neither is carried forward. That is why the real count is 887 to write, not 885.
 */
function usableAlt(raw: string | undefined): string | null {
  const t = (raw ?? "").trim();
  if (!t) return null;
  if (/^screen\s*shot/i.test(t)) return null;
  if (!/\s/.test(t)) return null; // a bare single word is a label, not a description
  return t;
}

let byProject: Map<string, ProjectPhoto[]> | undefined;

function build(): Map<string, ProjectPhoto[]> {
  if (byProject) return byProject;

  const measured = new Map<string, Record<string, string>>();
  for (const r of tsv("content/images/image-manifest.tsv")) {
    measured.set(r.attachment_id!, r);
  }

  const alt = new Map<string, string>();
  if (existsSync(rootFile("content/images/alt-text.tsv"))) {
    for (const r of tsv("content/images/alt-text.tsv")) {
      const a = usableAlt(r.alt);
      if (a) alt.set(r.attachment_id!, a);
    }
  }

  const map = new Map<string, ProjectPhoto[]>();
  for (const r of tsv("inputs/derived/project-images.tsv")) {
    const id = r.attachment_id!;
    const slug = r.project_slug!;
    const m = measured.get(id);
    // Prefer the measured original; fall back to what WordPress serves.
    const path = m?.source_path || r.original_file || r.file;
    if (!path) throw new Error(`photo ${id}: no source path`);
    const width = Number(m?.measured_w || r.width);
    const height = Number(m?.measured_h || r.height);
    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
      throw new Error(`photo ${id}: bad dimensions`);
    }
    const photo: ProjectPhoto = {
      id,
      src: `/photos/${path}`,
      width,
      height,
      position: Number(r.gallery_position || 0),
      isFeatured: r.is_featured === "yes",
      heroCapable: (m?.hero_capable ?? "") === "yes" || width >= 1920,
      square: width === height,
      alt: alt.get(id) ?? usableAlt(r.alt),
    };
    const list = map.get(slug);
    if (list) list.push(photo);
    else map.set(slug, [photo]);
  }

  for (const list of map.values()) {
    // gallery_position 0 marks a featured image that is in no gallery — show it first.
    list.sort((a, b) => (a.position || -1) - (b.position || -1));
  }

  byProject = map;
  return map;
}

export function photosFor(slug: string): ProjectPhoto[] {
  if (!photosAvailable()) return [];
  return build().get(slug) ?? [];
}

/**
 * Hero pick: the widest hero-capable frame, preferring landscape, then the featured image,
 * then simply the widest. Never upscales and never invents — a project with nothing at
 * 1920px returns its best available frame and `heroCapable` stays false on the project.
 */
export function heroFor(slug: string): ProjectPhoto | null {
  const list = photosFor(slug);
  if (list.length === 0) return null;
  const score = (p: ProjectPhoto) =>
    (p.heroCapable ? 4_000_000 : 0) +
    (p.width > p.height ? 2_000_000 : 0) +
    (p.isFeatured ? 1_000_000 : 0) +
    p.width;
  return [...list].sort((a, b) => score(b) - score(a))[0] ?? null;
}

/** Coverage for the alt-text gate. Reported by `npm run check:alt`. */
export function altCoverage() {
  const all = [...build().values()].flat();
  const withAlt = all.filter((p) => p.alt !== null).length;
  return { total: all.length, withAlt, missing: all.length - withAlt };
}

/**
 * Until `alt-text.tsv` lands, a photograph carries `alt=""` and the figure around it is
 * labelled by the project title. That is a real accessibility pattern for an image whose
 * accessible name is supplied by adjacent text — and it is the honest option. Writing
 * "Mackage SoHo — interior" for 887 frames nobody has looked at would be invented content
 * (DESIGN §9), and filename-as-alt is banned outright (CLAUDE.md).
 */
export const altPolicy =
  "alt from content/images/alt-text.tsv; empty + figure labelled by project title until it exists";
