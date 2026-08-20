#!/usr/bin/env node
/**
 * Invariants on content/copy/redirects.json, then optional HTTP checks
 * against a local origin. Never hits production.
 *
 *   node scripts/check-redirects.mjs
 *   node scripts/check-redirects.mjs --offline
 *   REDIRECT_BASE=http://127.0.0.1:8080 node scripts/check-redirects.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, "content/copy/redirects.json"), "utf8"));
const offline = process.argv.includes("--offline");
const base = (process.env.REDIRECT_BASE ?? "http://127.0.0.1:8080").replace(/\/$/, "");

function fail(msg) {
  console.error(`check-redirects: ${msg}`);
  process.exitCode = 1;
}

function norm(p) {
  let s = (p ?? "").trim();
  if (!s.startsWith("/")) s = `/${s}`;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

const livePaths = new Set(data.live.map((p) => p.path));
const liveBySlug = new Map(data.live.map((p) => [p.slug, p.path]));
const skipSlugs = new Set(data.skipSlugs);
const permanentFrom = new Set(data.permanent.map((r) => r.from));

if (data.counts.legacyRows !== 73) fail(`legacyRows ${data.counts.legacyRows} !== 73`);
if (data.permanent.length !== 37) fail(`permanent ${data.permanent.length} !== 37`);
if (data.skip.length !== 11) fail(`skip rows ${data.skip.length} !== 11`);
if (data.skipSlugs.length !== 10) fail(`skipSlugs ${data.skipSlugs.length} !== 10 (mexicue twice)`);
if (data.review.length !== 25) fail(`review ${data.review.length} !== 25`);
if (data.gone.length !== 2) fail(`gone ${data.gone.length} !== 2`);
if (data.live.length !== 58) fail(`live ${data.live.length} !== 58`);

const commercial = data.live.filter((p) => p.category === "commercial").length;
const residential = data.live.filter((p) => p.category === "residential").length;
if (commercial !== 27 || residential !== 31) {
  fail(`live split ${commercial}C/${residential}R !== 27/31`);
}

for (const r of data.permanent) {
  if (livePaths.has(r.from)) fail(`301 from live path ${r.from}`);
  const slug = r.from.split("/").filter(Boolean)[1];
  if (slug && skipSlugs.has(slug)) fail(`301 slug is SKIP ${slug}`);
  if (!livePaths.has(r.to)) fail(`301 target is not live ${r.to}`);
}

for (const slug of data.skipSlugs) {
  if (!liveBySlug.has(slug)) fail(`SKIP slug ${slug} has no live owner`);
}

for (const path of data.gone) {
  if (livePaths.has(path)) fail(`410 is a live path ${path}`);
  if (permanentFrom.has(path)) fail(`410 is also a 301 ${path}`);
}

const reviewSlugs = [...new Set(data.review.map((r) => r.slug))];
if (reviewSlugs.length !== 13) {
  fail(`unique REVIEW slugs ${reviewSlugs.length} !== 13`);
}

if (process.exitCode) {
  console.error("check-redirects: invariant failures");
  process.exit(process.exitCode);
}

console.log(
  `check-redirects: invariants  301=${data.permanent.length}  skipRows=${data.skip.length}  skipSlugs=${data.skipSlugs.length}  review=${data.review.length}  gone=${data.gone.length}  live=${data.live.length} (${commercial}C/${residential}R)`,
);

if (offline) process.exit(0);

async function probe(path) {
  const url = `${base}${path}`;
  const res = await fetch(url, { redirect: "manual" });
  const location = res.headers.get("location");
  let locPath = null;
  if (location) {
    try {
      locPath = norm(new URL(location, base).pathname);
    } catch {
      locPath = norm(location);
    }
  }
  return { status: res.status, locPath };
}

async function expectStatus(path, allowed, opts = {}) {
  const { status, locPath } = await probe(path);
  if (!allowed.includes(status)) {
    fail(`${path} → ${status}, expected ${allowed.join("|")}`);
    return;
  }
  if (opts.location && locPath !== opts.location) {
    fail(`${path} Location ${locPath} !== ${opts.location}`);
  }
}

try {
  for (const r of data.permanent) {
    await expectStatus(r.from, [301], { location: r.to });
    await expectStatus(`${r.from}/`, [301], { location: r.to });
  }

  for (const path of data.gone) {
    await expectStatus(path, [410]);
    await expectStatus(`${path}/`, [410]);
  }

  for (const slug of data.skipSlugs) {
    const live = liveBySlug.get(slug);
    await expectStatus(live, [200]);
  }

  for (const r of data.skip) {
    if (livePaths.has(r.from)) continue;
    await expectStatus(r.from, [404]);
  }

  const seenReview = new Set();
  for (const r of data.review) {
    if (seenReview.has(r.from)) continue;
    seenReview.add(r.from);
    if (livePaths.has(r.from)) {
      fail(`REVIEW from is live ${r.from}`);
      continue;
    }
    await expectStatus(r.from, [404]);
  }

  await expectStatus("/", [200]);
  await expectStatus("/commercial/upper-east-side-townhouse", [200]);
  await expectStatus("/commercial/autrium-corporate-office", [200]);
  await expectStatus("/commercial/washington-sq-dermatology", [404]);
  await expectStatus("/commercial/atrium-corporate-office", [404]);
  await expectStatus("/commercial/mackage-soho", [200]);
  await expectStatus("/residential/mackage-soho", [404]);
} catch (err) {
  fail(`HTTP ${err instanceof Error ? err.message : err}`);
}

if (process.exitCode) {
  console.error(`check-redirects: HTTP failures against ${base}`);
  process.exit(process.exitCode);
}

console.log(`check-redirects: HTTP clean against ${base}`);
