#!/usr/bin/env python3
"""Stage the four external source files into inputs/raw/, redacting PII on the way in.

Run once from the repo root, with the 20 Aug source folder still present on this
machine (paths below). Re-running is idempotent. Prints the sha256 of every file
before and after staging so inputs/raw/README.md can record provenance.

The only transform applied is the removal of two WordPress author email
addresses from the WXR export (a third party's personal Gmail and Alexey's own).
Everything else is copied byte-for-byte.
"""
import hashlib
import os
import shutil
import sys

HOME = os.path.expanduser("~")
SRC_DIR = os.path.join(HOME, "Downloads", "Zipcodes")
SL_DIR = os.path.join(SRC_DIR, "Streamline USA")
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(REPO, "inputs", "raw")

REDACT = ("etcheverryalexey@gmail.com", "rosemary.guzman9@gmail.com")
REDACT_WITH = "[email redacted 2026-08-20]"

# (source path, destination path, mode) — mode "text" applies REDACT, "binary" copies as-is
JOBS = [
    (
        os.path.join(SRC_DIR, "streamlineusa.WordPress.2026-08-20.xml"),
        os.path.join(RAW, "streamlineusa.WordPress.2026-08-20.xml"),
        "text",
    ),
    (
        os.path.join(SL_DIR, "StreamlineUSA_WebContent_v2.xlsx"),
        os.path.join(RAW, "StreamlineUSA_WebContent_v2.xlsx"),
        "binary",
    ),
    (
        os.path.join(SL_DIR, "Streamline Content.xlsx"),
        os.path.join(RAW, "StreamlineUSA_WebContent_v1.xlsx"),
        "binary",
    ),
    (
        os.path.join(SL_DIR, "Images_Streamline", "streamline-logo.png"),
        os.path.join(RAW, "brand", "streamline-logo.png"),
        "binary",
    ),
    (
        os.path.join(
            REPO,
            "wp-content/uploads/wpallexport/exports",
            "2ae7bfd1db5137bc92aa571165f78d88",
            "Posts-Export-2022-March-18-2138.csv",
        ),
        os.path.join(RAW, "wpallexport-posts-2022-03-18.csv"),
        "binary",
    ),
]


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def main():
    os.makedirs(os.path.join(RAW, "brand"), exist_ok=True)
    missing = [s for s, _, _ in JOBS if not os.path.exists(s)]
    if missing:
        print("MISSING SOURCES (nothing staged):", file=sys.stderr)
        for m in missing:
            print("  " + m, file=sys.stderr)
        return 1

    print(f"{'file':52} {'source sha256':16} {'staged sha256':16} bytes  redactions")
    for src, dst, mode in JOBS:
        src_hash = sha256(src)
        redactions = 0
        if mode == "text":
            text = open(src, encoding="utf-8").read()
            for needle in REDACT:
                redactions += text.count(needle)
                text = text.replace(needle, REDACT_WITH)
            with open(dst, "w", encoding="utf-8", newline="") as fh:
                fh.write(text)
        else:
            shutil.copy2(src, dst)
        print(
            f"{os.path.relpath(dst, REPO):52} {src_hash[:16]} {sha256(dst)[:16]} "
            f"{os.path.getsize(dst):>9}  {redactions}"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
