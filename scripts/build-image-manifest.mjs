#!/usr/bin/env node
/**
 * Build content/images/image-manifest.tsv + checksums-887.tsv from
 * inputs/derived/project-images.tsv and a local wp-content/uploads tree.
 *
 * Usage:
 *   node scripts/build-image-manifest.mjs --uploads wp-content/uploads
 *   node scripts/build-image-manifest.mjs wp-content/uploads
 *
 * Node stdlib only. Measures pixels via macOS `sips`. No network, no npm.
 */
import { createHash } from "node:crypto";
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const PROJECT_IMAGES = join(REPO_ROOT, "inputs/derived/project-images.tsv");
const PROJECTS = join(REPO_ROOT, "inputs/derived/projects.tsv");
const OUT_DIR = join(REPO_ROOT, "content/images");
const MANIFEST_OUT = join(OUT_DIR, "image-manifest.tsv");
const CHECKSUMS_OUT = join(OUT_DIR, "checksums-887.tsv");

const FEATURED_OUTSIDE_GALLERY = [
  "free-people-retail-store",
  "hudson-street-penthouse",
  "madison-ave-duplex-2",
  "st-lukes-place-townhouse",
  "west-23rd-townhouse-2",
  "indeed-corporate-office-suite",
  "autrium-corporate-office",
  "700-park-ave",
];

function parseArgs(argv) {
  let uploads = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--uploads" && argv[i + 1]) {
      uploads = argv[++i];
    } else if (!a.startsWith("-") && !uploads) {
      uploads = a;
    }
  }
  if (!uploads) {
    console.error(
      "Usage: node scripts/build-image-manifest.mjs --uploads <path>\n" +
        "   or: node scripts/build-image-manifest.mjs <uploads-path>",
    );
    process.exit(2);
  }
  return { uploads: resolve(REPO_ROOT, uploads) };
}

function parseTsv(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  if (lines.length < 2) return { header: [], rows: [] };
  const header = lines[0].split("\t");
  const rows = lines.slice(1).map((line) => {
    const cols = line.split("\t");
    const obj = {};
    for (let i = 0; i < header.length; i++) obj[header[i]] = cols[i] ?? "";
    return obj;
  });
  return { header, rows };
}

function chooseSource(row) {
  // Prefer hidden full-size original when present. Never Imagify .webp.
  const served = row.file;
  let source = row.has_larger_original === "yes" ? row.original_file || row.file : row.file;
  if (source.toLowerCase().endsWith(".webp")) {
    // Hard rule: never migrate Imagify webp — fall back to served non-webp path.
    source = served;
  }
  return { served, source };
}

function measureWithSips(absPath) {
  const r = spawnSync(
    "sips",
    ["-g", "pixelWidth", "-g", "pixelHeight", absPath],
    { encoding: "utf8" },
  );
  if (r.status !== 0) {
    return { w: 0, h: 0, error: (r.stderr || r.stdout || "sips failed").trim() };
  }
  const out = r.stdout || "";
  const wm = out.match(/pixelWidth:\s*(\d+)/);
  const hm = out.match(/pixelHeight:\s*(\d+)/);
  if (!wm || !hm) return { w: 0, h: 0, error: "sips parse failed" };
  return { w: Number(wm[1]), h: Number(hm[1]), error: null };
}

function orientationOf(w, h) {
  if (w === h) return "square";
  return w > h ? "landscape" : "portrait";
}

function aspectOf(w, h) {
  if (!h) return "0.000";
  return (w / h).toFixed(3);
}

function sha256File(absPath) {
  return new Promise((resolveHash, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(absPath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolveHash(hash.digest("hex")));
  });
}

function buildNotes(row, missing) {
  const notes = [];
  if (missing) notes.push("missing");
  if (row.has_larger_original === "yes") notes.push("larger_original");
  if (row.featured_only === "yes") notes.push("featured_only");
  if (row.parent_is_zero === "yes") notes.push("parent_is_zero");
  return notes.join(",");
}

function tsvEscape(v) {
  // TSV cells must not contain tabs/newlines in this dataset.
  return String(v ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

async function main() {
  const { uploads } = parseArgs(process.argv.slice(2));
  if (!existsSync(uploads)) {
    console.error(`Uploads root not found: ${uploads}`);
    process.exit(1);
  }
  if (!existsSync(PROJECT_IMAGES)) {
    console.error(`Missing ${PROJECT_IMAGES}`);
    process.exit(1);
  }

  const { rows } = parseTsv(readFileSync(PROJECT_IMAGES, "utf8"));
  if (rows.length !== 887) {
    console.error(`Expected 887 project-images rows, got ${rows.length}`);
    process.exit(1);
  }

  const projects = existsSync(PROJECTS)
    ? parseTsv(readFileSync(PROJECTS, "utf8")).rows
    : [];
  const projectBySlug = new Map(projects.map((p) => [p.slug, p]));
  const rowByAttachment = new Map();
  for (const row of rows) {
    if (!rowByAttachment.has(row.attachment_id)) {
      rowByAttachment.set(row.attachment_id, row);
    }
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const manifestHeader = [
    "attachment_id",
    "project_slug",
    "served_path",
    "source_path",
    "measured_w",
    "measured_h",
    "wp_w",
    "wp_h",
    "has_larger_original",
    "aspect",
    "orientation",
    "hero_capable",
    "featured_only",
    "parent_is_zero",
    "notes",
  ];
  const checksumHeader = ["attachment_id", "source_path", "sha256", "bytes"];

  const manifestLines = [manifestHeader.join("\t")];
  const checksumLines = [checksumHeader.join("\t")];

  let missing = 0;
  let largerOriginal = 0;
  let parentIsZero = 0;
  let featuredOnly = 0;
  let heroImageCount = 0;
  let servedMissing = 0;
  let originalPathMissing = 0;
  const maxWByProject = new Map();
  const dimCache = new Map(); // abs source path → {w,h}
  const hashCache = new Map(); // abs source path → {sha256, bytes}

  let i = 0;
  for (const row of rows) {
    i++;
    const { served, source } = chooseSource(row);
    const servedAbs = join(uploads, served);
    const sourceAbs = join(uploads, source);
    const originalAbs = join(uploads, row.original_file || row.file);

    if (!existsSync(servedAbs)) servedMissing++;
    if (row.has_larger_original === "yes" && !existsSync(originalAbs)) {
      originalPathMissing++;
    }

    const sourceExists = existsSync(sourceAbs);
    let measured_w = 0;
    let measured_h = 0;
    let sha256 = "";
    let bytes = 0;

    if (!sourceExists) {
      missing++;
    } else {
      if (!dimCache.has(sourceAbs)) {
        const m = measureWithSips(sourceAbs);
        dimCache.set(sourceAbs, { w: m.w, h: m.h });
        if (m.error) {
          console.error(`sips error for ${source}: ${m.error}`);
        }
      }
      const dims = dimCache.get(sourceAbs);
      measured_w = dims.w;
      measured_h = dims.h;

      if (!hashCache.has(sourceAbs)) {
        const { size } = statSync(sourceAbs);
        const digest = await sha256File(sourceAbs);
        hashCache.set(sourceAbs, { sha256: digest, bytes: size });
      }
      const h = hashCache.get(sourceAbs);
      sha256 = h.sha256;
      bytes = h.bytes;
    }

    if (row.has_larger_original === "yes") largerOriginal++;
    if (row.parent_is_zero === "yes") parentIsZero++;
    if (row.featured_only === "yes") featuredOnly++;

    const hero = measured_w >= 1920;
    if (hero) heroImageCount++;

    const prev = maxWByProject.get(row.project_slug) ?? 0;
    if (measured_w > prev) maxWByProject.set(row.project_slug, measured_w);

    const notes = buildNotes(row, !sourceExists);

    manifestLines.push(
      [
        row.attachment_id,
        row.project_slug,
        served,
        source,
        measured_w,
        measured_h,
        row.width,
        row.height,
        row.has_larger_original,
        aspectOf(measured_w, measured_h),
        orientationOf(measured_w, measured_h),
        hero ? "yes" : "no",
        row.featured_only,
        row.parent_is_zero,
        notes,
      ]
        .map(tsvEscape)
        .join("\t"),
    );

    checksumLines.push(
      [row.attachment_id, source, sha256, bytes].map(tsvEscape).join("\t"),
    );

    if (i % 100 === 0 || i === rows.length) {
      process.stderr.write(`… measured ${i}/${rows.length}\n`);
    }
  }

  writeFileSync(MANIFEST_OUT, manifestLines.join("\n") + "\n");
  writeFileSync(CHECKSUMS_OUT, checksumLines.join("\n") + "\n");

  let heroProjectCount = 0;
  for (const w of maxWByProject.values()) {
    if (w >= 1920) heroProjectCount++;
  }

  // 8 featured-outside-gallery: resolve each project's featured source on disk.
  const featuredOutside = [];
  for (const slug of FEATURED_OUTSIDE_GALLERY) {
    const proj = projectBySlug.get(slug);
    const thumbId = proj?.thumbnail_id || "";
    let sourcePath = "";
    let exists = false;
    let via = "";

    // Prefer a featured_only row for this project; else any row for thumbnail_id.
    const foRow = rows.find(
      (r) => r.project_slug === slug && r.featured_only === "yes",
    );
    const thumbRow =
      foRow ||
      rows.find((r) => r.attachment_id === thumbId) ||
      rowByAttachment.get(thumbId);

    if (thumbRow) {
      const chosen = chooseSource(thumbRow);
      sourcePath = chosen.source;
      exists = existsSync(join(uploads, sourcePath));
      via = foRow
        ? "featured_only"
        : `attachment ${thumbId} (shared / cross-project)`;
    } else if (thumbId) {
      via = `thumbnail_id ${thumbId} not in project-images.tsv`;
    } else {
      via = "no thumbnail_id in projects.tsv";
    }

    featuredOutside.push({ slug, thumbId, sourcePath, exists, via });
  }

  const featuredOutsideOk = featuredOutside.filter((f) => f.exists).length;

  console.log(`rows: ${rows.length}`);
  console.log(`missing_source: ${missing}`);
  console.log(`served_missing: ${servedMissing}`);
  console.log(`original_path_missing_when_flagged: ${originalPathMissing}`);
  console.log(`larger_original: ${largerOriginal}`);
  console.log(`parent_is_zero: ${parentIsZero}`);
  console.log(`featured_only: ${featuredOnly}`);
  console.log(`hero_capable_images: ${heroImageCount}`);
  console.log(`hero_capable_projects: ${heroProjectCount}`);
  console.log(
    `featured_outside_gallery_sources_exist: ${featuredOutsideOk}/${FEATURED_OUTSIDE_GALLERY.length}`,
  );
  for (const f of featuredOutside) {
    console.log(
      `  ${f.slug}\t${f.exists ? "exists" : "MISSING"}\t${f.sourcePath || "-"}\t${f.via}`,
    );
  }
  console.log(`wrote: ${MANIFEST_OUT}`);
  console.log(`wrote: ${CHECKSUMS_OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
