#!/usr/bin/env node
/**
 * Alt-text coverage over the 887 migrated photographs.
 *
 * CLAUDE.md requires descriptive alt on every migrated image, pattern
 * "<Project name> — <room/space>, <notable feature>", and bans filename-as-alt.
 * WordPress supplies two values and both fail that rule — one is a bare project name
 * ("Boqueria"), one is a screenshot filename — so the real job is 887, not 885.
 *
 * This reports; it fails only with --strict, which is the migration gate. Until
 * content/images/alt-text.tsv exists, photographs render with alt="" inside a figure
 * labelled by the project title, which is honest. Inventing descriptions is not.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const strict = process.argv.includes("--strict");

function tsv(rel) {
  const raw = readFileSync(join(root, rel), "utf8");
  const lines = raw.split("\n");
  const header = lines[0].split("\t");
  return lines
    .slice(1)
    .filter((l) => l.trim())
    .map((l) => {
      const c = l.split("\t");
      return Object.fromEntries(header.map((h, i) => [h, c[i] ?? ""]));
    });
}

function usable(v) {
  const t = (v ?? "").trim();
  if (!t) return false;
  if (/^screen\s*shot/i.test(t)) return false;
  if (!/\s/.test(t)) return false;
  return true;
}

const referenced = tsv("inputs/derived/project-images.tsv");
const altFile = "content/images/alt-text.tsv";
const written = new Map();
if (existsSync(join(root, altFile))) {
  for (const r of tsv(altFile)) {
    if (usable(r.alt)) written.set(r.attachment_id, r.alt);
  }
}

let have = 0;
const perProject = new Map();
for (const r of referenced) {
  const ok = written.has(r.attachment_id) || usable(r.alt);
  if (ok) have += 1;
  const s = perProject.get(r.project_slug) ?? { total: 0, have: 0 };
  s.total += 1;
  if (ok) s.have += 1;
  perProject.set(r.project_slug, s);
}

const total = referenced.length;
const missing = total - have;
const done = [...perProject.values()].filter((s) => s.have === s.total).length;

console.log(
  `check-alt: ${have}/${total} photographs have descriptive alt (${missing} to write) — ` +
    `${done}/${perProject.size} projects complete` +
    (written.size === 0 ? `; ${altFile} not present yet (Cursor's lane)` : ""),
);

if (missing > 0 && strict) {
  console.error(
    `check-alt: FAIL — ${missing} photographs would migrate without alt text. ` +
      "CLAUDE.md requires descriptive alt on every one.",
  );
  process.exit(1);
}
