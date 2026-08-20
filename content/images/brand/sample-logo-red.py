#!/Users/alexeyetcheverry/sl/.venv/bin/python
"""Sample Streamline wordmark red from inputs/raw/brand/streamline-logo.png.

Also writes interim rasters under content/images/brand/ (trimmed PNG, 2x retina,
light-on-dark sidebar variant). Stdlib-free except Pillow.
"""
from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

from PIL import Image

REPO = Path(__file__).resolve().parents[3]
LOGO = REPO / "inputs/raw/brand/streamline-logo.png"
OUT_DIR = REPO / "content/images/brand"

LOCKED = (0xDA, 0x21, 0x28)
RETIRED = (0xD4, 0x2E, 0x12)
REMEMBERED = (0xDE, 0x24, 0x26)
SIDEBAR_BG = (0x1A, 0x1A, 0x1A)


def rgb_hex(r: int, g: int, b: int) -> str:
    return f"#{r:02X}{g:02X}{b:02X}"


def is_wordmark_red(r: int, g: int, b: int, a: int) -> bool:
    if a < 128:
        return False
    return r > 150 and g < 120 and b < 120 and r > g + 30 and r > b + 30


def sample_wordmark_red(img: Image.Image) -> dict:
    w, h = img.size
    pixels: list[tuple[int, int, int]] = []
    for y in range(int(h * 0.08), int(h * 0.62)):
        for x in range(int(w * 0.02), int(w * 0.72)):
            r, g, b, a = img.getpixel((x, y))
            if is_wordmark_red(r, g, b, a):
                pixels.append((r, g, b))

    if not pixels:
        raise SystemExit("no wordmark red pixels found")

    ctr = Counter(pixels)
    modal, modal_count = ctr.most_common(1)[0]
    rs = [p[0] for p in pixels]
    gs = [p[1] for p in pixels]
    bs = [p[2] for p in pixels]
    top_hexes = [
        {"hex": rgb_hex(r, g, b), "count": c}
        for (r, g, b), c in ctr.most_common(8)
    ]

    return {
        "modal_hex": rgb_hex(*modal),
        "modal_count": modal_count,
        "pixel_count": len(pixels),
        "r_range": [min(rs), max(rs)],
        "g_range": [min(gs), max(gs)],
        "b_range": [min(bs), max(bs)],
        "top_hexes": top_hexes,
    }


def black_to_alpha(img: Image.Image, threshold: int = 30) -> Image.Image:
    rgba = img.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r <= threshold and g <= threshold and b <= threshold:
                px[x, y] = (r, g, b, 0)
    return rgba


def trim(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    return img.crop(bbox)


def light_on_dark(img: Image.Image) -> Image.Image:
    """Keep sampled wordmark pixels; map near-black canvas to #1A1A1A."""
    rgba = img.convert("RGBA")
    out = Image.new("RGBA", rgba.size, SIDEBAR_BG + (255,))
    src = rgba.load()
    dst = out.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = src[x, y]
            if a == 0:
                continue
            if r <= 30 and g <= 30 and b <= 30:
                continue
            dst[x, y] = (r, g, b, a)
    return out


def main() -> int:
    if not LOGO.is_file():
        print(f"missing logo: {LOGO}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    img = Image.open(LOGO)
    stats = sample_wordmark_red(img)
    modal = tuple(int(stats["modal_hex"][i : i + 2], 16) for i in (1, 3, 5))
    stats["deltas"] = {
        "locked_DA2128": [modal[i] - LOCKED[i] for i in range(3)],
        "retired_D42E12": [modal[i] - RETIRED[i] for i in range(3)],
        "remembered_DE2426": [modal[i] - REMEMBERED[i] for i in range(3)],
    }

    transparent = trim(black_to_alpha(img))
    transparent.save(OUT_DIR / "streamline-logo-trimmed.png")

    w, h = transparent.size
    retina = transparent.resize((w * 2, h * 2), Image.Resampling.LANCZOS)
    retina.save(OUT_DIR / "streamline-logo-trimmed-2x.png")

    dark = trim(light_on_dark(img))
    dark.save(OUT_DIR / "streamline-logo-sidebar-1A1A1A.png")

    report_path = OUT_DIR / "sampling-report.json"
    report_path.write_text(json.dumps(stats, indent=2) + "\n", encoding="utf-8")

    print(stats["modal_hex"])
    print(json.dumps(stats, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
