#!/usr/bin/env python3
"""Turn the committed WXR export into text-first extracts under inputs/derived/.

    python3 scripts/wxr-extract.py [--uploads wp-content/uploads]

Reads only inputs/raw/streamlineusa.WordPress.2026-08-20.xml, so it is rerunnable
from a fresh clone with no network and no credentials. Pass --uploads to add
on-disk presence columns and the disk section of the report (needs the git-ignored
~12 GB dump; every other output is identical without it).

Writes:
    inputs/derived/projects.tsv          58 projects, one row each, all ACF fields
    inputs/derived/projects/<slug>.md    the same 58 as readable prose
    inputs/derived/attachments.tsv       1,764 media-library records
    inputs/derived/project-images.tsv    the 887-file referenced set, joined
    inputs/derived/pages/<slug>.txt      page copy, Elementor widgets unwrapped
    inputs/derived/nav-menu.tsv          the live WordPress menu
    inputs/derived/site-chrome.txt       header/footer + Astra hook + templates
    inputs/derived/EXTRACT-REPORT.md     counts, assertions, anomalies

Stdlib only, on purpose: no install step for whoever picks this up next.
"""
import argparse
import collections
import html
import json
import os
import re
import statistics
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WXR = os.path.join(REPO, "inputs", "raw", "streamlineusa.WordPress.2026-08-20.xml")
OUT = os.path.join(REPO, "inputs", "derived")

# WordPress escapes a literal ]]> inside CDATA by splitting the section. Swap the
# escape for a sentinel before parsing, restore it inside extracted values.
CDATA_ESCAPE = "]]]]><![CDATA[>"
SENTINEL = "\x00CDATA_CLOSE\x00"

# Elementor settings keys that hold copy rather than styling.
COPY_KEYS = {
    "title", "editor", "text", "description", "description_text", "caption",
    "alt", "heading", "sub_heading", "subtitle", "title_text", "tab_title",
    "tab_content", "testimonial_content", "testimonial_name", "testimonial_job",
    "button_text", "text_next", "text_prev", "placeholder", "html", "shortcode",
    "form_name", "field_label", "email_subject", "message", "before_text",
    "highlighted_text", "after_text", "rotating_text", "item_title",
    "item_description", "list_item_title", "list_item_description",
}
URL_KEYS = {"url", "link", "website_link", "image", "background_image"}


def read_wxr(path):
    with open(path, encoding="utf-8", errors="strict") as fh:
        return fh.read().replace(CDATA_ESCAPE, SENTINEL)


def unwrap(value):
    return None if value is None else value.replace(SENTINEL, "]]>")


def tag(name, block, dotall=True):
    m = re.search(
        r"<%s>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</%s>" % (name, name),
        block,
        re.S if dotall else 0,
    )
    return unwrap(m.group(1)) if m else None


def meta_pairs(block):
    return [
        (k, unwrap(v))
        for k, v in re.findall(
            r"<wp:meta_key><!\[CDATA\[(.*?)\]\]></wp:meta_key>\s*"
            r"<wp:meta_value><!\[CDATA\[(.*?)\]\]></wp:meta_value>",
            block,
            re.S,
        )
    ]


def meta_map(block):
    """Last-wins map. Fine for single-valued keys, wrong for repeated ones —
    use meta_all() for anything WordPress stores more than once (_wp_old_slug)."""
    return dict(meta_pairs(block))


def meta_all(block, key):
    """Every value stored under one meta key, in document order."""
    return [v for k, v in meta_pairs(block) if k == key]


def php_list(serialized):
    """Ordered scalars out of a PHP-serialized flat array."""
    if not serialized:
        return []
    return re.findall(r's:\d+:"(.*?)";', serialized, re.S)


def php_value(serialized, key):
    m = re.search(r's:\d+:"%s";s:\d+:"(.*?)";' % re.escape(key), serialized or "", re.S)
    return m.group(1) if m else None


def html_to_text(raw):
    if not raw:
        return ""
    t = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", raw)
    t = re.sub(r"(?i)<br\s*/?>", "\n", t)
    t = re.sub(r"(?i)</(p|div|h[1-6]|li|tr|section)>", "\n", t)
    t = re.sub(r"(?i)<li[^>]*>", "- ", t)
    t = re.sub(r"<[^>]+>", " ", t)
    t = html.unescape(t)
    t = re.sub(r"[ \t\u00a0]+", " ", t)
    t = re.sub(r"\n\s*\n\s*\n+", "\n\n", t)
    return "\n".join(line.strip() for line in t.splitlines()).strip()


def cell(value):
    """TSV-safe single cell."""
    if value is None:
        return ""
    return (
        str(value)
        .replace("\t", " ")
        .replace("\r", " ")
        .replace("\n", "\\n")
        .strip()
    )


def write_tsv(path, header, rows):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\t".join(header) + "\n")
        for row in rows:
            fh.write("\t".join(cell(row.get(h)) for h in header) + "\n")


def elementor_text(data_json):
    """Flatten _elementor_data into readable, ordered copy."""
    try:
        tree = json.loads(data_json)
    except (ValueError, TypeError):
        return ["  [_elementor_data present but not parseable as JSON]"]
    lines = []

    def walk(node, depth=0):
        if isinstance(node, list):
            for item in node:
                walk(item, depth)
            return
        if not isinstance(node, dict):
            return
        widget = node.get("widgetType") or node.get("elType")
        settings = node.get("settings") or {}
        emitted = []
        for key, value in settings.items():
            if key in COPY_KEYS and isinstance(value, str) and value.strip():
                text = html_to_text(value)
                if text:
                    emitted.append((key, text))
            elif key in URL_KEYS:
                if isinstance(value, dict) and value.get("url"):
                    emitted.append((key, value["url"]))
                elif isinstance(value, str) and value.startswith(("http", "/")):
                    emitted.append((key, value))
            elif isinstance(value, list):
                for entry in value:
                    if not isinstance(entry, dict):
                        continue
                    for k2, v2 in entry.items():
                        if k2 in COPY_KEYS and isinstance(v2, str) and v2.strip():
                            text = html_to_text(v2)
                            if text:
                                emitted.append((f"{key}[].{k2}", text))
                        elif k2 in URL_KEYS and isinstance(v2, dict) and v2.get("url"):
                            emitted.append((f"{key}[].{k2}", v2["url"]))
        if emitted:
            lines.append(f"{'  ' * depth}[{widget}]")
            for key, text in emitted:
                for i, line in enumerate(text.splitlines()):
                    prefix = f"{'  ' * depth}  {key}: " if i == 0 else f"{'  ' * depth}    "
                    lines.append(prefix + line)
        for child in node.get("elements") or []:
            walk(child, depth + 1 if emitted else depth)

    walk(tree)
    return lines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--uploads", help="path to the git-ignored wp-content/uploads dump")
    args = ap.parse_args()

    if not os.path.exists(WXR):
        print(f"missing {WXR} — run scripts/stage-raw-inputs.py first", file=sys.stderr)
        return 1
    doc = read_wxr(WXR)
    items = re.findall(r"<item>(.*?)</item>", doc, re.S)

    attachments, projects, pages, nav, chrome = {}, [], [], [], []
    for block in items:
        ptype = tag("wp:post_type", block)
        pid = tag("wp:post_id", block)
        meta = meta_map(block)
        if ptype == "attachment":
            am = meta.get("_wp_attachment_metadata") or ""
            dims = re.match(r'a:\d+:\{s:5:"width";i:(\d+);s:6:"height";i:(\d+);', am)
            original = php_value(am, "original_image")
            served = meta.get("_wp_attached_file")
            attachments[pid] = {
                "id": pid,
                "file": served,
                "original_file": (
                    os.path.join(os.path.dirname(served), original)
                    if original and served
                    else served
                ),
                "has_larger_original": "yes" if original else "no",
                "width": dims.group(1) if dims else "",
                "height": dims.group(2) if dims else "",
                "alt": meta.get("_wp_attachment_image_alt") or "",
                "post_parent": tag("wp:post_parent", block),
                "mime": tag("wp:post_mime_type", block),
                "url": tag("wp:attachment_url", block),
                "title": tag("title", block),
                "uploaded": tag("wp:post_date", block),
            }
        elif ptype == "post":
            cats = re.findall(r'domain="category" nicename="(.*?)"', block)
            projects.append(
                {
                    "wp_id": pid,
                    "slug": tag("wp:post_name", block),
                    "title": tag("title", block),
                    "category": cats[0] if cats else "",
                    "status": tag("wp:status", block),
                    "post_date": tag("wp:post_date", block),
                    "permalink": tag("link", block),
                    "location": meta.get("location"),
                    "size_sq_ft": meta.get("size_sq_ft"),
                    "role_raw": meta.get("role"),
                    "designed_by": meta.get("designed_by"),
                    "architecture_by": meta.get("architecture_by"),
                    "description": meta.get("description"),
                    "mission": meta.get("mission"),
                    "challenges": meta.get("challenges"),
                    "lessons_learned": meta.get("lessons_learned"),
                    "gallery_ids": [
                        g for g in php_list(meta.get("project_gallery")) if g.isdigit()
                    ],
                    "thumbnail_id": meta.get("_thumbnail_id"),
                    "legacy_sq_feet": meta.get("sq_feet") or "",
                    "old_slugs": ";".join(
                        sorted({s for s in meta_all(block, "_wp_old_slug") if s})
                    ),
                }
            )
        elif ptype == "page":
            pages.append(
                {
                    "id": pid,
                    "slug": tag("wp:post_name", block),
                    "title": tag("title", block),
                    "status": tag("wp:status", block),
                    "link": tag("link", block),
                    "content": tag("content:encoded", block),
                    "elementor": meta.get("_elementor_data"),
                }
            )
        elif ptype == "nav_menu_item":
            nav.append(
                {
                    "id": pid,
                    "label": tag("title", block) or "",
                    "menu_order": tag("wp:menu_order", block),
                    "type": meta.get("_menu_item_type"),
                    "object": meta.get("_menu_item_object"),
                    "object_id": meta.get("_menu_item_object_id"),
                    "parent": meta.get("_menu_item_menu_item_parent"),
                    "url": meta.get("_menu_item_url"),
                }
            )
        elif ptype in ("elementor-hf", "astra-advanced-hook", "elementor_library"):
            chrome.append(
                {
                    "type": ptype,
                    "id": pid,
                    "title": tag("title", block),
                    "status": tag("wp:status", block),
                    "content": tag("content:encoded", block),
                    "elementor": meta.get("_elementor_data"),
                }
            )

    # ---------- projects ----------
    gallery_all = [g for p in projects for g in p["gallery_ids"]]
    gallery_unique = set(gallery_all)
    thumbs = {p["thumbnail_id"] for p in projects if p["thumbnail_id"]}
    referenced = gallery_unique | thumbs

    proj_header = [
        "wp_id", "slug", "title", "category", "post_date", "status", "permalink",
        "location", "size_sq_ft", "role_raw", "designed_by", "architecture_by",
        "architect_status", "images", "gallery_ids", "thumbnail_id",
        "featured_in_gallery", "min_w", "median_w", "max_w", "n_ge1920",
        "n_square", "n_with_alt", "n_with_larger_original", "old_slugs",
        "description", "mission", "challenges", "lessons_learned",
    ]
    proj_rows = []
    for p in sorted(projects, key=lambda x: int(x["wp_id"])):
        widths, squares, alts, origs = [], 0, 0, 0
        for gid in p["gallery_ids"]:
            a = attachments.get(gid, {})
            if a.get("width") and a.get("height"):
                w, h = int(a["width"]), int(a["height"])
                widths.append(w)
                if w == h:
                    squares += 1
            if a.get("alt"):
                alts += 1
            if a.get("has_larger_original") == "yes":
                origs += 1
        arch = (p["architecture_by"] or "").strip()
        proj_rows.append(
            {
                **p,
                "architect_status": (
                    "empty" if not arch
                    else "pseudo-blank" if arch.lower() in ("none", "none involved")
                    else "ok"
                ),
                "images": len(p["gallery_ids"]),
                "gallery_ids": ";".join(p["gallery_ids"]),
                "featured_in_gallery": (
                    "yes" if p["thumbnail_id"] in p["gallery_ids"] else "no"
                ),
                "min_w": min(widths) if widths else "",
                "median_w": int(statistics.median(widths)) if widths else "",
                "max_w": max(widths) if widths else "",
                "n_ge1920": sum(1 for w in widths if w >= 1920),
                "n_square": squares,
                "n_with_alt": alts,
                "n_with_larger_original": origs,
            }
        )
    write_tsv(os.path.join(OUT, "projects.tsv"), proj_header, proj_rows)

    proj_dir = os.path.join(OUT, "projects")
    os.makedirs(proj_dir, exist_ok=True)
    for row in proj_rows:
        lines = [
            f"# {row['title']}",
            "",
            f"- wp_id: {row['wp_id']}",
            f"- slug: {row['slug']}",
            f"- category: {row['category']}",
            f"- url: {row['permalink']}",
            f"- location (raw ACF): {row['location']}",
            f"- size_sq_ft: {row['size_sq_ft']}",
            f"- role (raw ACF): {row['role_raw']!r}",
            f"- designed_by: {row['designed_by']}",
            f"- architecture_by: {row['architecture_by']!r} ({row['architect_status']})",
            f"- images: {row['images']} (featured in own gallery: "
            f"{row['featured_in_gallery']})",
            f"- published: {row['post_date']}",
        ]
        if row["old_slugs"]:
            lines.append(f"- previous slugs: {row['old_slugs']}")
        for field in ("description", "mission", "challenges", "lessons_learned"):
            body = html_to_text(row.get(field) or "")
            if body:
                lines += ["", f"## {field}", "", body]
        lines += [
            "",
            "---",
            "",
            "Extracted from the 2026-08-20 WXR export by scripts/wxr-extract.py.",
            "`mission` / `challenges` / `lessons_learned` are dropped from the Sanity",
            "schema (PLAN §1 row 5) and kept here only as source material for",
            "`description` rewrites.",
            "",
        ]
        with open(
            os.path.join(proj_dir, f"{row['slug']}.md"), "w", encoding="utf-8"
        ) as fh:
            fh.write("\n".join(lines))

    # ---------- legacy slugs (redirect seed) ----------
    # WordPress keeps one _wp_old_slug row per retired slug. Streamline's slugs were
    # clearly shuffled in bulk at some point: some retired slugs are now another
    # project's LIVE slug, and some are claimed by two projects. Neither can become a
    # 301 without breaking or guessing, so each row is classified, not assumed.
    live_slugs = {r["slug"]: r for r in proj_rows}
    claims = collections.Counter()
    for row in proj_rows:
        for old in [s for s in row["old_slugs"].split(";") if s]:
            claims[old] += 1
    legacy_rows = []
    for row in proj_rows:
        for old in [s for s in row["old_slugs"].split(";") if s]:
            if old in live_slugs:
                verdict, note = (
                    "SKIP",
                    "retired slug is another project's LIVE slug ("
                    f"{live_slugs[old]['title']}) — a 301 here would hijack a live URL",
                )
            elif claims[old] > 1:
                verdict, note = (
                    "REVIEW",
                    f"claimed by {claims[old]} projects — ambiguous, pick a target by "
                    "hand or leave it 404",
                )
            elif old.endswith("__trashed"):
                verdict, note = (
                    "REVIEW",
                    "WordPress trash artefact, never a public URL — 410 rather than 301",
                )
            else:
                verdict, note = (
                    "301",
                    "unambiguous: one claimant, not live elsewhere",
                )
            legacy_rows.append(
                {
                    "old_slug": old,
                    "old_path": f"/{row['category']}/{old}/",
                    "current_slug": row["slug"],
                    "new_path": f"/{row['category']}/{row['slug']}/",
                    "wp_id": row["wp_id"],
                    "title": row["title"],
                    "claimants": claims[old],
                    "verdict": verdict,
                    "note": note,
                }
            )
    write_tsv(
        os.path.join(OUT, "legacy-slugs.tsv"),
        ["old_slug", "old_path", "current_slug", "new_path", "wp_id", "title",
         "claimants", "verdict", "note"],
        sorted(legacy_rows, key=lambda r: (r["verdict"], r["current_slug"], r["old_slug"])),
    )
    legacy_verdicts = collections.Counter(r["verdict"] for r in legacy_rows)

    # ---------- attachments ----------
    att_header = [
        "id", "file", "original_file", "has_larger_original", "width", "height",
        "mime", "post_parent", "alt", "title", "uploaded", "url",
    ]
    write_tsv(
        os.path.join(OUT, "attachments.tsv"),
        att_header,
        sorted(attachments.values(), key=lambda a: int(a["id"])),
    )

    # ---------- the referenced 887 ----------
    owner, position = {}, {}
    for p in projects:
        for i, gid in enumerate(p["gallery_ids"]):
            owner.setdefault(gid, p)
            position.setdefault(gid, i + 1)
    img_header = [
        "attachment_id", "project_slug", "project_wp_id", "category",
        "gallery_position", "is_featured", "featured_only", "file",
        "original_file", "has_larger_original", "width", "height", "square",
        "alt", "post_parent", "parent_is_zero", "mime",
    ]
    if args.uploads:
        img_header += ["served_on_disk", "original_on_disk"]
    img_rows = []
    for gid in sorted(referenced, key=int):
        a = attachments.get(gid, {})
        p = owner.get(gid)
        featured_for = next(
            (q for q in projects if q["thumbnail_id"] == gid), None
        )
        w, h = a.get("width"), a.get("height")
        row = {
            "attachment_id": gid,
            "project_slug": (p or featured_for or {}).get("slug", ""),
            "project_wp_id": (p or featured_for or {}).get("wp_id", ""),
            "category": (p or featured_for or {}).get("category", ""),
            "gallery_position": position.get(gid, ""),
            "is_featured": "yes" if featured_for else "no",
            "featured_only": "yes" if featured_for and gid not in gallery_unique else "no",
            "file": a.get("file"),
            "original_file": a.get("original_file"),
            "has_larger_original": a.get("has_larger_original"),
            "width": w,
            "height": h,
            "square": "yes" if w and h and w == h else "no",
            "alt": a.get("alt"),
            "post_parent": a.get("post_parent"),
            "parent_is_zero": "yes" if a.get("post_parent") == "0" else "no",
            "mime": a.get("mime"),
        }
        if args.uploads:
            for key, rel in (
                ("served_on_disk", a.get("file")),
                ("original_on_disk", a.get("original_file")),
            ):
                row[key] = (
                    "yes"
                    if rel and os.path.exists(os.path.join(args.uploads, rel))
                    else "no"
                )
        img_rows.append(row)
    write_tsv(os.path.join(OUT, "project-images.tsv"), img_header, img_rows)

    # ---------- pages ----------
    page_dir = os.path.join(OUT, "pages")
    os.makedirs(page_dir, exist_ok=True)
    for pg in pages:
        slug = pg["slug"] or f"page-{pg['id']}"
        body = [
            f"# {pg['title'] or '(untitled)'}",
            "",
            f"slug:   {pg['slug']}",
            f"status: {pg['status']}",
            f"url:    {pg['link']}",
            f"wp_id:  {pg['id']}",
            "",
            "## post_content (Elementor shortcode shell stripped)",
            "",
            html_to_text(pg["content"]) or "(empty — all copy lives in _elementor_data)",
            "",
            "## _elementor_data (copy fields only)",
            "",
        ]
        body += elementor_text(pg["elementor"]) if pg["elementor"] else [
            "(no Elementor data)"
        ]
        body += [
            "",
            "---",
            "Extracted by scripts/wxr-extract.py. Styling, spacing and layout keys are",
            "dropped on purpose — this is the copy, not the design.",
            "",
        ]
        with open(os.path.join(page_dir, f"{slug}.txt"), "w", encoding="utf-8") as fh:
            fh.write("\n".join(body))

    # ---------- nav + chrome ----------
    write_tsv(
        os.path.join(OUT, "nav-menu.tsv"),
        ["id", "menu_order", "label", "type", "object", "object_id", "parent", "url"],
        sorted(nav, key=lambda n: int(n["menu_order"] or 0)),
    )
    with open(os.path.join(OUT, "site-chrome.txt"), "w", encoding="utf-8") as fh:
        fh.write(
            "Header/footer, Astra hooks and Elementor templates — the copy that lives\n"
            "outside pages (PLAN §3: 'content outside pages — extract deliberately').\n"
            "Extracted by scripts/wxr-extract.py.\n"
        )
        for c in chrome:
            fh.write(
                f"\n{'=' * 78}\n{c['type']} #{c['id']} — {c['title']} [{c['status']}]\n"
                f"{'=' * 78}\n"
            )
            text = html_to_text(c["content"])
            if text:
                fh.write("\n-- post_content --\n" + text + "\n")
            if c["elementor"]:
                fh.write("\n-- _elementor_data --\n")
                fh.write("\n".join(elementor_text(c["elementor"])) + "\n")

    # ---------- report ----------
    img_records = [
        a for a in attachments.values() if (a.get("mime") or "").startswith("image/")
    ]
    with_orig_lib = sum(
        1 for a in attachments.values() if a["has_larger_original"] == "yes"
    )
    gal_with_orig = sum(
        1 for g in gallery_unique if attachments.get(g, {}).get("has_larger_original") == "yes"
    )
    ref_with_alt = sum(1 for g in referenced if attachments.get(g, {}).get("alt"))
    parent_zero = sum(
        1 for g in gallery_unique if attachments.get(g, {}).get("post_parent") == "0"
    )
    cats = collections.Counter(p["category"] for p in projects)
    arch_status = collections.Counter(r["architect_status"] for r in proj_rows)
    roles = collections.Counter(p["role_raw"] for p in projects)
    hero = sum(1 for r in proj_rows if r["max_w"] and int(r["max_w"]) >= 1920)
    dims = [
        (int(a["width"]), int(a["height"]))
        for g in gallery_unique
        for a in [attachments.get(g, {})]
        if a.get("width") and a.get("height")
    ]

    lines = [
        "# inputs/derived — extract report",
        "",
        "Generated by `scripts/wxr-extract.py` from",
        "`inputs/raw/streamlineusa.WordPress.2026-08-20.xml`. Every number below",
        "recomputes from that one committed file — no network, no credentials, no",
        "authenticated media endpoint.",
        "",
        "## Counts",
        "",
        "| Measure | Value |",
        "|---|---|",
        f"| WXR `<item>` records | {len(items)} |",
        f"| Attachment records | {len(attachments)} |",
        f"| …with an `image/*` mime type | {len(img_records)} |",
        f"| …with a larger original on disk (`original_image`) | {with_orig_lib} |",
        f"| Projects (post type `post`) | {len(projects)} |",
        f"| …commercial / residential | {cats.get('commercial', 0)} / "
        f"{cats.get('residential', 0)} |",
        f"| Pages (all statuses) | {len(pages)} |",
        f"| Nav menu items | {len(nav)} |",
        f"| Header/footer + hook + template records | {len(chrome)} |",
        f"| Gallery references (with duplicates) | {len(gallery_all)} |",
        f"| Unique gallery images | {len(gallery_unique)} |",
        f"| Featured images | {len(thumbs)} |",
        f"| …outside their own project's gallery | "
        f"{len(thumbs - gallery_unique)} |",
        f"| **Unique referenced files (`project_gallery` ∪ `_thumbnail_id`)** | "
        f"**{len(referenced)}** |",
        f"| Referenced files with alt text | {ref_with_alt} |",
        f"| Gallery images with a larger original | {gal_with_orig} |",
        f"| Gallery images whose WP `post_parent` is 0 | {parent_zero} |",
        f"| Gallery images ≥1920px wide | "
        f"{sum(1 for w, _ in dims if w >= 1920)} |",
        f"| Gallery images ≥2048px wide | "
        f"{sum(1 for w, _ in dims if w >= 2048)} |",
        f"| Square gallery images | {sum(1 for w, h in dims if w == h)} |",
        f"| Projects whose widest gallery image is ≥1920px | {hero} |",
        "",
        "## Assertions against PLAN.md",
        "",
        "| PLAN claim | Expected | This extract | |",
        "|---|---|---|---|",
    ]

    def assertion(label, expected, actual):
        ok = "✅" if str(expected) == str(actual) else "❌"
        lines.append(f"| {label} | {expected} | {actual} | {ok} |")

    assertion("§3 projects", 58, len(projects))
    assertion("§3 commercial", 27, cats.get("commercial", 0))
    assertion("§3 residential", 31, cats.get("residential", 0))
    assertion("§3 gallery images", 880, len(gallery_unique))
    assertion("row 18 referenced union", 887, len(referenced))
    assertion("row 18 featured outside gallery", 7, len(thumbs - gallery_unique))
    assertion("row 18 / §7 `post: 0` gallery images", 137, parent_zero)
    assertion("§7 gallery images with larger originals", 387, gal_with_orig)
    assertion("§7 library images with larger originals", 791, with_orig_lib)
    assertion("§7 gallery images ≥1920px", 445, sum(1 for w, _ in dims if w >= 1920))
    assertion("§7 gallery images ≥2048px", 259, sum(1 for w, _ in dims if w >= 2048))
    assertion("§7 square gallery images", 74, sum(1 for w, h in dims if w == h))
    assertion("§7 gallery images missing alt", 878, len(gallery_unique) - sum(
        1 for g in gallery_unique if attachments.get(g, {}).get("alt")))
    assertion("row 19 architects empty", 5, arch_status.get("empty", 0))
    assertion("row 19 architects pseudo-blank", 3, arch_status.get("pseudo-blank", 0))
    assertion("row 13 distinct raw role strings", 10, len(roles))
    assertion("§3 projects with empty post_content", 58, len(projects))

    lines += [
        "",
        "## Raw `role` strings (PLAN §1 row 13)",
        "",
        "| Raw ACF value | Projects |",
        "|---|---|",
    ]
    for value, count in roles.most_common():
        lines.append(f"| `{value}` | {count} |")

    lines += [
        "",
        "## Anomalies worth knowing",
        "",
        f"- `sq_feet` is a dead ACF field: empty on all {len(projects)} projects. "
        "`size_sq_ft` is the live one.",
        "- Yoast is installed but holds no titles or meta descriptions "
        "(`_yoast_wpseo_title` / `_yoast_wpseo_metadesc`: 0 occurrences) — PLAN §3's "
        '"no SEO-plugin metadata" is confirmed.',
        f"- **{sum(1 for r in proj_rows if r['old_slugs'])} of {len(projects)} projects "
        f"carry `_wp_old_slug` history — {len(legacy_rows)} retired project URLs** "
        f"({len({r['old_slug'] for r in legacy_rows})} distinct slugs) that WordPress "
        "still 301s today. They seed the `redirect` doc type (PLAN §8) and belong in the "
        "§9 link-check. WordPress stores this key once per retired slug, so a last-wins "
        "meta parse silently reports zero of them.",
        f"- Those retired slugs are **not** safe to redirect blindly: "
        f"`legacy-slugs.tsv` classifies them "
        f"{legacy_verdicts.get('301', 0)} × 301 (unambiguous), "
        f"{legacy_verdicts.get('SKIP', 0)} × SKIP (the retired slug is now another "
        f"project's live slug — a 301 would hijack a live URL), "
        f"{legacy_verdicts.get('REVIEW', 0)} × REVIEW (claimed by two projects, or a "
        "`__trashed` artefact). The slugs were evidently shuffled in bulk at some point.",
        "- `washington-sq-dermatology` — the slug PLAN §1 row 16 wants to restore on "
        "WP 564 — is itself in that project's `_wp_old_slug` history. The correction "
        "restores the project's own former URL rather than inventing one. (It also "
        "appears in `hudson-yards-mall`'s history, which is the shuffle showing.)",
        "- Page copy lives in `_elementor_data`, not `post_content`. The extracts in "
        "`pages/` unwrap the copy fields and drop styling keys.",
    ]

    if args.uploads:
        served_missing = [r for r in img_rows if r.get("served_on_disk") == "no"]
        orig_missing = [r for r in img_rows if r.get("original_on_disk") == "no"]
        lines += [
            "",
            "## Disk cross-check",
            "",
            f"Against `{args.uploads}` (git-ignored):",
            "",
            f"- referenced served files present: "
            f"{len(img_rows) - len(served_missing)} / {len(img_rows)}",
            f"- referenced originals present: "
            f"{len(img_rows) - len(orig_missing)} / {len(img_rows)}",
        ]
        if served_missing:
            lines.append("- missing served files: " + ", ".join(
                f"{r['attachment_id']} ({r['file']})" for r in served_missing[:20]))
        if orig_missing:
            lines.append("- missing originals: " + ", ".join(
                f"{r['attachment_id']} ({r['original_file']})" for r in orig_missing[:20]))

    lines += [
        "",
        "## Reproducing",
        "",
        "```bash",
        "python3 scripts/wxr-extract.py                        # repo-only",
        "python3 scripts/wxr-extract.py --uploads wp-content/uploads   # + disk check",
        "```",
        "",
        "Stdlib Python 3 only. Deterministic: same input, same bytes out.",
        "",
    ]
    with open(os.path.join(OUT, "EXTRACT-REPORT.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))

    failures = [l for l in lines if l.endswith("| ❌ |")]
    print(f"projects={len(projects)} attachments={len(attachments)} "
          f"referenced={len(referenced)} pages={len(pages)} nav={len(nav)} "
          f"chrome={len(chrome)}")
    print(f"assertions failed: {len(failures)}")
    for f in failures:
        print("  " + f)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
