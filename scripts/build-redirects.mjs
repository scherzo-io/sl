#!/usr/bin/env node
/**
 * Assemble content/copy/redirects.json from legacy-slugs.tsv + PLAN §9 410s.
 * Change this script and re-run; do not hand-edit the JSON.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function tsv(rel) {
  const raw = readFileSync(join(root, rel), "utf8");
  const lines = raw.split("\n");
  const header = lines[0]?.split("\t");
  if (!header) throw new Error(`${rel}: missing header`);
  const col = Object.fromEntries(header.map((h, i) => [h, i]));
  const rows = [];
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const cells = line.split("\t");
    const rec = {};
    for (const [k, i] of Object.entries(col)) rec[k] = cells[i] ?? "";
    rows.push(rec);
  }
  return rows;
}

function norm(p) {
  let s = (p ?? "").trim();
  if (!s) return "";
  if (!s.startsWith("/")) s = `/${s}`;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

const inventory = tsv("content/content-inventory.tsv").filter((r) => r.status === "live");
if (inventory.length !== 58) {
  throw new Error(`expected 58 live projects, got ${inventory.length}`);
}

const live = inventory.map((r) => ({
  category: r.category,
  slug: r.slug,
  path: `/${r.category}/${r.slug}`,
}));
const livePaths = new Set(live.map((p) => p.path));

const rows = tsv("inputs/derived/legacy-slugs.tsv");
if (rows.length !== 73) throw new Error(`expected 73 legacy rows, got ${rows.length}`);

const byVerdict = { 301: [], SKIP: [], REVIEW: [] };
for (const r of rows) {
  const v = r.verdict;
  if (!byVerdict[v]) throw new Error(`unexpected verdict ${v} on ${r.old_slug}`);
  byVerdict[v].push(r);
}
if (byVerdict["301"].length !== 37) throw new Error(`expected 37 301, got ${byVerdict["301"].length}`);
if (byVerdict.SKIP.length !== 11) throw new Error(`expected 11 SKIP, got ${byVerdict.SKIP.length}`);
if (byVerdict.REVIEW.length !== 25) throw new Error(`expected 25 REVIEW, got ${byVerdict.REVIEW.length}`);

const skipSlugs = [...new Set(byVerdict.SKIP.map((r) => r.old_slug))];

const permanent = [];
for (const r of byVerdict["301"]) {
  const from = norm(r.old_path);
  const to = norm(r.new_path);
  if (!from || !to) throw new Error(`empty path on 301 ${r.old_slug}`);
  if (livePaths.has(from)) {
    throw new Error(`301 from live path ${from} — would hijack`);
  }
  if (skipSlugs.includes(r.old_slug)) {
    throw new Error(`301 slug is SKIP ${r.old_slug}`);
  }
  permanent.push({
    from,
    to,
    wpId: r.wp_id,
    title: r.title,
  });
}

const gone = ["/sample-page", "/1248-2"];

const review = byVerdict.REVIEW.map((r) => ({
  from: norm(r.old_path),
  slug: r.old_slug,
  wouldHaveGoneTo: norm(r.new_path),
  wpId: r.wp_id,
  title: r.title,
  claimants: r.claimants,
  note: r.note,
}));

const out = {
  source:
    "inputs/derived/legacy-slugs.tsv (verdict=301 only) + PLAN §9 410s. SKIP never redirected. REVIEW is 404 until Alexey/Eric pick a target. WP 564 and WP 558 slug corrections pending Eric — live URLs preserved.",
  generated: "scripts/build-redirects.mjs",
  counts: {
    legacyRows: 73,
    permanent: permanent.length,
    skip: byVerdict.SKIP.length,
    review: byVerdict.REVIEW.length,
    gone: gone.length,
    live: live.length,
  },
  gone,
  permanent,
  skipSlugs,
  skip: byVerdict.SKIP.map((r) => ({
    from: norm(r.old_path),
    slug: r.old_slug,
    liveOwnerNote: r.note,
  })),
  review,
  live,
  pendingEric: [
    "WP 564: do not 301 /commercial/upper-east-side-townhouse to /commercial/washington-sq-dermatology until Eric confirms. washington-sq-dermatology is REVIEW (two claimants).",
    "WP 558: live slug autrium-corporate-office stays. atrium-corporate-office is REVIEW (two claimants).",
  ],
};

const dest = join(root, "content/copy/redirects.json");
writeFileSync(dest, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  `redirects.json  301=${permanent.length}  skip=${skipSlugs.length} slugs  review=${review.length}  gone=${gone.length}  live=${live.length}`,
);
