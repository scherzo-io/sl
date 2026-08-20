#!/usr/bin/env node
/**
 * Phase B gate: built CSS must not contain retired brand hexes
 * (DESIGN.md §2, PLAN §1 rows 11–12).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const retired = [
  "#D42E12",
  "#E8492B",
  "#E85A3C",
  "#FF0000",
  "#990000",
  "#808285",
];

function walk(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith(".css")) acc.push(p);
  }
  return acc;
}

const cssFiles = walk(join(process.cwd(), ".next"));
if (cssFiles.length === 0) {
  console.error("check-retired-hex: no CSS under .next — run npm run build first");
  process.exit(1);
}

let hits = 0;
for (const file of cssFiles) {
  const text = readFileSync(file, "utf8");
  for (const hex of retired) {
    const re = new RegExp(hex, "i");
    if (re.test(text)) {
      console.error(`retired ${hex} in ${file}`);
      hits += 1;
    }
  }
}

if (hits > 0) {
  console.error(`check-retired-hex: ${hits} hit(s)`);
  process.exit(1);
}

console.log(`check-retired-hex: ok (${cssFiles.length} css files, 0 retired hexes)`);
