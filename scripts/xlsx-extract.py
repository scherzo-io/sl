#!/usr/bin/env python3
"""Flatten the two content workbooks into TSV, one file per sheet.

    python3 scripts/xlsx-extract.py

Reads inputs/raw/StreamlineUSA_WebContent_v2.xlsx and _v1.xlsx, writes
inputs/derived/workbook-v2/<sheet>.tsv and workbook-v1/<sheet>.tsv.

An .xlsx is a zip of XML, so this needs no third-party library — which matters
because an agent reading this repo over GitHub cannot open the binary workbook at
all. The TSVs are the readable copy; the .xlsx stays in inputs/raw/ as the source
of record. Values only: formulas, formatting and merged-cell geometry are dropped.
"""
import os
import re
import zipfile
from xml.etree import ElementTree as ET

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "p": "http://schemas.openxmlformats.org/package/2006/relationships",
}
JOBS = [
    ("inputs/raw/StreamlineUSA_WebContent_v2.xlsx", "inputs/derived/workbook-v2"),
    ("inputs/raw/StreamlineUSA_WebContent_v1.xlsx", "inputs/derived/workbook-v1"),
]


def shared_strings(zf):
    try:
        root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    out = []
    for si in root.findall("m:si", NS):
        out.append("".join(t.text or "" for t in si.iter(f"{{{NS['m']}}}t")))
    return out


def sheet_targets(zf):
    """[(sheet name, zip path)] in workbook order."""
    wb = ET.fromstring(zf.read("xl/workbook.xml"))
    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    by_id = {
        rel.get("Id"): rel.get("Target")
        for rel in rels.findall("p:Relationship", NS)
    }
    out = []
    for sheet in wb.find("m:sheets", NS):
        target = by_id.get(sheet.get(f"{{{NS['r']}}}id"), "")
        if target.startswith("/"):
            path = target.lstrip("/")
        else:
            path = "xl/" + target.lstrip("./")
        out.append((sheet.get("name"), path))
    return out


def col_index(ref):
    letters = re.match(r"([A-Z]+)", ref or "A").group(1)
    n = 0
    for ch in letters:
        n = n * 26 + (ord(ch) - 64)
    return n - 1


def cell_text(c, strings):
    ctype = c.get("t")
    if ctype == "inlineStr":
        node = c.find("m:is", NS)
        return "".join(t.text or "" for t in node.iter(f"{{{NS['m']}}}t")) if node is not None else ""
    v = c.find("m:v", NS)
    raw = v.text if v is not None and v.text is not None else ""
    if ctype == "s":
        try:
            return strings[int(raw)]
        except (ValueError, IndexError):
            return ""
    if ctype == "str":
        return raw
    # numeric: drop the trailing .0 Excel stores for integers
    if re.fullmatch(r"-?\d+\.0+", raw):
        return raw.split(".")[0]
    return raw


def clean(value):
    return (
        (value or "")
        .replace("\t", " ")
        .replace("\r", " ")
        .replace("\n", "\\n")
        .strip()
    )


def main():
    total = 0
    for rel_src, rel_out in JOBS:
        src = os.path.join(REPO, rel_src)
        if not os.path.exists(src):
            print(f"skip (missing): {rel_src}")
            continue
        out_dir = os.path.join(REPO, rel_out)
        os.makedirs(out_dir, exist_ok=True)
        with zipfile.ZipFile(src) as zf:
            strings = shared_strings(zf)
            for name, path in sheet_targets(zf):
                try:
                    root = ET.fromstring(zf.read(path))
                except KeyError:
                    print(f"  {name}: sheet part {path} missing")
                    continue
                rows = []
                for row in root.iter(f"{{{NS['m']}}}row"):
                    cells = {}
                    for c in row.findall("m:c", NS):
                        cells[col_index(c.get("r"))] = clean(cell_text(c, strings))
                    width = max(cells) + 1 if cells else 0
                    values = [cells.get(i, "") for i in range(width)]
                    while values and values[-1] == "":
                        values.pop()
                    rows.append(values)
                while rows and not any(rows[-1]):
                    rows.pop()
                width = max((len(r) for r in rows), default=0)
                safe = re.sub(r"[^A-Za-z0-9]+", "-", name).strip("-").lower() or "sheet"
                dst = os.path.join(out_dir, f"{safe}.tsv")
                with open(dst, "w", encoding="utf-8", newline="\n") as fh:
                    for r in rows:
                        fh.write("\t".join(r + [""] * (width - len(r))) + "\n")
                total += 1
                print(f"  {os.path.relpath(dst, REPO):48} {len(rows):>4} rows × "
                      f"{width} cols   (sheet: {name})")
    print(f"{total} sheets written")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
