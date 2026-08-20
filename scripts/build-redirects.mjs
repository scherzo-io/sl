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

// The 16 ambiguous REVIEW paths. Two claimants each, so the target cannot be derived —
// it is a recorded decision in content/redirect-decisions.tsv, measured from production.
const decisions = tsv("content/redirect-decisions.tsv");
for (const d of decisions) {
  if (!livePaths.has(norm(d.target_path))) {
    throw new Error(`redirect-decision target not live: ${d.old_path} -> ${d.target_path}`);
  }
  if (livePaths.has(norm(d.old_path))) {
    throw new Error(`redirect-decision would hijack a live path: ${d.old_path}`);
  }
}

const permanent = [];
const PERMANENT_FROM = new Set();
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
  PERMANENT_FROM.add(from);
  permanent.push({
    from,
    to,
    wpId: r.wp_id,
    title: r.title,
    via: "legacy-slugs 301",
  });
}

// Cross-category: every live slug also answers under the other category prefix, 301 to
// its canonical path. Covers the 7 SKIP rows whose old_path carries the other category.
const crossCategory = [];
for (const { slug, path, category } of live) {
  const other = category === "commercial" ? "residential" : "commercial";
  const from = `/${other}/${slug}`;
  if (livePaths.has(from)) continue; // same slug live in both — never invent a winner
  crossCategory.push({ from, to: path, slug, reason: "cross-category legacy path" });
}

const reviewResolved = decisions.map((d) => ({
  from: norm(d.old_path),
  to: norm(d.target_path),
  wpId: d.target_wp_id,
  title: d.target_title,
  basis: `${d.basis} ${d.measured}`,
  note: d.note,
}));

for (const r of [...crossCategory, ...reviewResolved]) {
  const from = r.from;
  if (livePaths.has(from)) throw new Error(`redirect from live path ${from}`);
  if (PERMANENT_FROM.has(from)) continue; // an explicit 301 row already owns it
  PERMANENT_FROM.add(from);
  permanent.push({ from, to: r.to, wpId: r.wpId ?? "", title: r.title ?? "", via: r.reason ?? "review-decision" });
}

const gone = ["/sample-page", "/1248-2"];

const reviewUnresolved = byVerdict.REVIEW.filter(
  (r) => !PERMANENT_FROM.has(norm(r.old_path)),
);

const review = byVerdict.REVIEW.map((r) => ({
  from: norm(r.old_path),
  slug: r.old_slug,
  wouldHaveGoneTo: norm(r.new_path),
  wpId: r.wp_id,
  title: r.title,
  claimants: r.claimants,
  note: r.note,
  resolved: PERMANENT_FROM.has(norm(r.old_path)),
}));

const out = {
  source:
    "inputs/derived/legacy-slugs.tsv + content/redirect-decisions.tsv + PLAN §9 410s. Three sources of 301: the 37 unambiguous legacy rows; cross-category paths for every live slug (WordPress matches old slugs ignoring the category segment); and the 16 ambiguous REVIEW paths, whose targets are recorded decisions measured from production 2026-08-20. A live path is never redirected away. WP 564 / WP 558 keep their live URLs until Eric confirms — flip the matching redirect-decisions row then.",
  generated: "scripts/build-redirects.mjs",
  counts: {
    legacyRows: 73,
    permanent: permanent.length,
    fromLegacy301: byVerdict["301"].length,
    fromCrossCategory: crossCategory.filter((r) => PERMANENT_FROM.has(r.from)).length,
    fromReviewDecisions: reviewResolved.length,
    skip: byVerdict.SKIP.length,
    review: byVerdict.REVIEW.length,
    reviewUnresolved: reviewUnresolved.length,
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
    "WP 564: /commercial/upper-east-side-townhouse stays live. Production currently 301s washington-sq-dermatology TO it, which is the opposite of the planned fix — content/redirect-decisions.tsv preserves that until Eric confirms, then flip the row.",
    "WP 558: live slug autrium-corporate-office stays; atrium-corporate-office 301s to it. Flip the decision row when Eric confirms the spelling.",
  ],
};

const dest = join(root, "content/copy/redirects.json");
writeFileSync(dest, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  `redirects.json  301=${permanent.length} (legacy=${byVerdict["301"].length} cross=${crossCategory.filter((r) => PERMANENT_FROM.has(r.from)).length} review=${reviewResolved.length})  skipSlugs=${skipSlugs.length}  reviewUnresolved=${reviewUnresolved.length}  gone=${gone.length}  live=${live.length}`,
);
