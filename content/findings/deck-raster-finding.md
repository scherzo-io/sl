# The capability decks are flattened page rasters — the partner logos are not extractable

Found 2026-08-20b, measuring both deck PDFs with PyMuPDF after installing the PDF toolchain.
This changes one deliverable: the ~30-firm logo wall (PLAN §8 `partner`, DESIGN §6) cannot be
built from the decks, only *identified* from them.

## What's there

Both capability decks are image-only, which PLAN §1 row 20 already established. The new fact is
*how* image-only: **every page is a single flattened raster**, not a page with embedded logo
artwork on it.

| | Commercial | Residential |
|---|---|---|
| File | `Commercial Portfolio .pdf` | `Open Full residential 32824.pdf` |
| Pages | 43 | 44 |
| Size | 8.7 MB | 13.8 MB |
| Embedded images per page | exactly 1, on every page | exactly 1, on every page |
| Page raster | ~1020×1320 | ~1105×1430 |
| Extractable text characters | 0 on every page | 0 on every page |

The residential deck's filename is `Open Full residential 32824.pdf` — earlier notes recorded
it as extensionless, which was a truncated directory listing, not the real name.

## Measured evidence

The logo wall is commercial deck **p42**. It holds **one** image: a 1020×1320 JPEG, 97 KB, for
the entire page. So each of the ~30 marks is a region roughly 150–200px wide inside a
low-resolution page scan.

Two consequences follow, and the second one is the trap:

1. **No mark can be extracted as artwork.** `pdfimages` returns the page, not the logos.
   Cropping gives a ~170px-wide fragment of a JPEG — fine to recognise a firm by, useless on a
   wall of marks that is meant to signal credibility to architects.
2. **Re-OCR cannot rescue the text either.** Rendering at 300 or 600 dpi upsamples the same
   1020px of detail. The OCR ceiling is fixed by the source raster, which is why the existing
   transcripts mangle names into `RCD t. eee Vira`, `Tonseetina — ASSOCIATES nuns` and
   `CELANO ii cust Hosp`. Tuning the pipeline is wasted effort.

## The catch

This does not make the decks less valuable — they remain the source for ~45 case studies, both
partner bios, the services copy, the proof points and five named testimonials. It narrows
exactly one thing: anything needing *artwork* rather than *information* out of them.

It also does not resolve whether Streamline should publish those marks at all. PLAN §1 row 21
permits logos and testimonials in principle; sourcing thirty firms' trademarks from their own
sites is a decision about third-party marks, and it is Eric's or Alexey's, not an agent's.

## Decision / rule

1. **The deliverable from p42 is a verified firm-name list**, read off the page by a human (or
   an agent that can see it), not parsed from OCR. Every name stays unverified until it has been
   read.
2. **Reference crops are identification aids, labelled not-for-publication**, kept at native
   resolution and out of any rendered path.
3. **Publishable artwork is an ask, not a task.** Real marks come from each firm's press kit or
   from Eric. **Never upscale, redraw, trace or AI-generate a third-party logo** — that is
   invented content (DESIGN §9) and, unlike most invented content, it is someone else's
   trademark.
4. **Build the wall's type and layout against the name manifest**, and leave the artwork slot
   visibly empty until it is filled. An empty slot is a known gap; a traced logo is a defect
   that ships.
5. Don't re-OCR the decks hoping for better strings. Read the pages that matter
   (`workorders/cursor-images.md` §5.1).

Related: [`wxr-export-finding.md`](wxr-export-finding.md) — the other source that turned out to
hold more, and less, than expected.

## Reproducing

```bash
.venv/bin/python - <<'PY'
import pymupdf
base = "/Users/alexeyetcheverry/Downloads/Zipcodes/Streamline USA/Sample Portfolios_Streamline/"
for name in ["Commercial Portfolio .pdf", "Open Full residential 32824.pdf"]:
    d = pymupdf.open(base + name)
    counts = {i: len(p.get_images(full=True)) for i, p in enumerate(d, 1)}
    print(name, d.page_count, "pages; pages with != 1 image:",
          {k: v for k, v in counts.items() if v != 1} or "none")
    x = d[41].get_images(full=True)[0][0]
    info = d.extract_image(x)
    print("  p42 image:", info["width"], "x", info["height"], info["ext"],
          len(info["image"]) // 1024, "KB; text chars:", len(d[41].get_text().strip()))
PY
```

Needs the deck PDFs, which are **deliberately not in this repo** (they carry the REFERENCES
block — PLAN §1 row 21), and the local venv. Measured-from-local-files, 2026-08-20.
