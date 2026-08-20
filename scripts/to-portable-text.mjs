#!/usr/bin/env node
/**
 * Plain-text ACF description → Sanity Portable Text blocks.
 * PLAN §8 / CLAUDE.md: no raw HTML; links in markDefs; empty blocks filtered.
 * Test on 5 projects before 58 (Phase D gate).
 */
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECTS_DIR = join(root, "inputs/derived/projects");

const SAMPLE_SLUGS = [
  "lantern-house",
  "bad-roman-columbus-circle-mall",
  "kith",
  "momofuku-ko",
  "boqueria-restaurant",
];

export function keyFor(seed) {
  return createHash("sha1").update(seed).digest("hex").slice(0, 12);
}

/** Split on blank lines; also treat a single newline as a paragraph break. */
export function paragraphs(text) {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|(https?:\/\/[^\s<]+)/g;

function spansAndMarks(text, blockKey) {
  const markDefs = [];
  const children = [];
  let last = 0;
  let spanI = 0;
  const re = new RegExp(LINK_RE.source, "g");
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      children.push({
        _type: "span",
        _key: `${blockKey}-s${spanI++}`,
        text: text.slice(last, m.index),
        marks: [],
      });
    }
    const label = m[1] ?? m[3];
    const href = m[2] ?? m[3];
    const markKey = `${blockKey}-l${markDefs.length}`;
    markDefs.push({ _type: "link", _key: markKey, href });
    children.push({
      _type: "span",
      _key: `${blockKey}-s${spanI++}`,
      text: label,
      marks: [markKey],
    });
    last = m.index + m[0].length;
  }
  if (last < text.length || children.length === 0) {
    const rest = text.slice(last);
    if (rest) {
      children.push({
        _type: "span",
        _key: `${blockKey}-s${spanI++}`,
        text: rest,
        marks: [],
      });
    }
  }
  return { children, markDefs };
}

export function toPortableText(text, idSeed) {
  const blocks = [];
  for (const [i, para] of paragraphs(text).entries()) {
    const blockKey = keyFor(`${idSeed}:${i}:${para}`);
    const { children, markDefs } = spansAndMarks(para, blockKey);
    if (!children.length) continue;
    blocks.push({
      _type: "block",
      _key: blockKey,
      style: "normal",
      markDefs,
      children,
    });
  }
  return blocks;
}

export function extractDescription(markdown) {
  const start = markdown.search(/^## description\s*$/m);
  if (start < 0) return "";
  const after = markdown.slice(start).replace(/^## description\s*/, "");
  const end = after.search(/\n## |\n---\s*\n/);
  return (end < 0 ? after : after.slice(0, end)).trim();
}

export function extractSlug(markdown) {
  const match = markdown.match(/^- slug: (.+)$/m);
  return match ? match[1].trim() : "";
}

export function extractWpId(markdown) {
  const match = markdown.match(/^- wp_id: (\d+)$/m);
  return match ? match[1].trim() : "";
}

function assertClean(blocks, slug) {
  const dumped = JSON.stringify(blocks);
  const failures = [];
  if (!Array.isArray(blocks)) failures.push("not an array");
  if (dumped.includes("<p")) failures.push("contains <p");
  if (dumped.includes("_cdata")) failures.push("contains _cdata");
  if (dumped.includes("[object Object]")) failures.push("contains [object Object]");
  if (dumped.includes("<p>") || dumped.includes("</p>")) failures.push("html p tags");
  for (const b of blocks) {
    if (!b.children || !b.children.length) failures.push("empty block");
    if (!Array.isArray(b.markDefs)) failures.push("missing markDefs");
  }
  if (failures.length) {
    throw new Error(`${slug}: ${failures.join("; ")}`);
  }
}

function convertFile(filename) {
  const markdown = readFileSync(join(PROJECTS_DIR, filename), "utf8");
  const slug = extractSlug(markdown);
  const wpId = extractWpId(markdown);
  const description = extractDescription(markdown);
  if (!slug || !description) {
    throw new Error(`${filename}: missing slug or description`);
  }
  const blocks = toPortableText(description, `project-${wpId}`);
  assertClean(blocks, slug);
  return { slug, wpId, description, blocks };
}

function main() {
  const mode = process.argv[2] ?? "sample";
  const files = readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".md"));
  const wanted =
    mode === "all"
      ? files
      : SAMPLE_SLUGS.map((s) => `${s}.md`);

  const out = [];
  for (const file of wanted) {
    out.push(convertFile(file));
  }

  const dir = join(root, "content/copy/portable-text");
  mkdirSync(dir, { recursive: true });
  const dest =
    mode === "all"
      ? join(dir, "projects.json")
      : join(dir, "sample-5.json");
  writeFileSync(
    dest,
    JSON.stringify(
      {
        generated: "scripts/to-portable-text.mjs",
        mode,
        count: out.length,
        projects: out.map(({ slug, wpId, blocks }) => ({
          _id: `project-${wpId}`,
          slug,
          description: blocks,
        })),
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`${mode}: ${out.length} projects → ${dest}`);
  for (const p of out) {
    console.log(`  ${p.slug}  blocks=${p.blocks.length}  chars=${p.description.length}`);
  }
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) main();
