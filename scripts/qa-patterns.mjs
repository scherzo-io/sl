#!/usr/bin/env node
/**
 * Phase B visual gate: Pattern A/B/C at 390 / 768 / 1440.
 * Writes PNGs under /workspace/screenshots/ (never /tmp).
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] || "http://127.0.0.1:8080";
const outDir = "/workspace/screenshots";
mkdirSync(outDir, { recursive: true });

const views = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
];

const routes = [
  { name: "a", path: "/" },
  { name: "b", path: "/portfolio" },
  { name: "c", path: "/services" },
];

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const errors = [];

for (const view of views) {
  for (const route of routes) {
    const page = await browser.newPage({
      viewport: { width: view.width, height: view.height },
    });
    page.on("pageerror", (e) => errors.push(`${route.name}@${view.name} ${e.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`${route.name}@${view.name} console: ${msg.text()}`);
    });
    const url = `${base}${route.path}`;
    const res = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    if (!res || res.status() >= 400) errors.push(`${url} status ${res?.status()}`);
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth };
    });
    if (overflow.scrollWidth > overflow.clientWidth + 1) {
      errors.push(`${route.name}@${view.name} horizontal overflow ${overflow.scrollWidth}>${overflow.clientWidth}`);
    }
    const file = `${outDir}/pattern-${route.name}-${view.name}.png`;
    await page.screenshot({ path: file, fullPage: false });
    const body = (await page.locator("body").innerText()).slice(0, 80).replace(/\s+/g, " ");
    console.log(`${file}  ${res?.status()}  "${body}"`);
    await page.close();
  }
}

await browser.close();
if (errors.length) {
  console.error("QA ERRORS:");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
console.log("qa-patterns: ok");
