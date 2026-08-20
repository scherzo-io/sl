#!/usr/bin/env node
/**
 * Point public/photos at the WordPress dump so next/image can serve the 887 photographs.
 *
 * A symlink, not a copy: the chosen sources are 3.12 GB and no derivative or binary ever
 * belongs in this repo. next/image resizes on demand from the original, which is exactly the
 * pipeline PLAN §7 describes — and production will point at Sanity, never at the legacy CDN.
 *
 *   node scripts/link-photos.mjs [--uploads <path>]
 *
 * Without the dump the link is absent, photosAvailable() is false, and every slot renders the
 * empty dark field. That is the correct behaviour on a fresh clone, not an error.
 */
import { existsSync, lstatSync, readlinkSync, symlinkSync, unlinkSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const i = process.argv.indexOf("--uploads");
const uploads = resolve(root, i > -1 ? process.argv[i + 1] : "wp-content/uploads");
const link = join(root, "public/photos");

if (!existsSync(uploads)) {
  console.error(`link-photos: no dump at ${uploads}`);
  console.error("link-photos: nothing linked; slots will render the empty field.");
  process.exit(1);
}

if (existsSync(link) || (lstatSync(link, { throwIfNoEntry: false }) && true)) {
  const st = lstatSync(link, { throwIfNoEntry: false });
  if (st?.isSymbolicLink()) {
    const current = readlinkSync(link);
    unlinkSync(link);
    console.log(`link-photos: replaced existing link -> ${current}`);
  } else if (st) {
    console.error(`link-photos: public/photos exists and is not a symlink — refusing to touch it`);
    process.exit(1);
  }
}

symlinkSync(relative(join(root, "public"), uploads), link);
const probe = join(link, "2019/12/OPRY1.jpg");
console.log(
  `link-photos: public/photos -> ${relative(root, uploads)}` +
    (existsSync(probe) ? " (probe OK)" : " (WARNING: probe file missing)"),
);
