#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const needles = [
  "555-1234",
  "456-7890",
  "123 Construction",
  "Hello world",
  "© 2024",
  "example.com",
  "Lorem ipsum",
  "desiogn",
  "336 West 37th",
  "336 W 37th",
];

const paths = [
  "app",
  "components",
  "lib",
  "content/copy/about.json",
  "content/copy/contact.json",
  "content/copy/people.json",
  "content/copy/proof-points.json",
  "content/copy/property-management.json",
  "content/copy/rfp.json",
  "content/copy/services.json",
  "content/copy/site-settings.json",
  "content/copy/testimonials.json",
  "content/copy/navigation.json",
  "content/copy/partners.json",
  "content/copy/analytics.json",
];

let failed = 0;
for (const needle of needles) {
  let out = "";
  try {
    out = execFileSync("grep", ["-RIn", needle, ...paths], { encoding: "utf8" });
  } catch (err) {
    if (err.status === 1) continue;
    throw err;
  }
  if (out.trim()) {
    failed += 1;
    console.error(`kill-list hit: ${needle}\n${out}`);
  }
}
if (failed) process.exit(1);
console.log("check-kill-list: clean");
