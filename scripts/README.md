# scripts/

Stdlib Python 3 only — no `npm install`, no `pip install`, no credentials, no network.
Everything here is deterministic: same input, same bytes out. Run from the repo root.

| Script | Does | Reads | Writes |
|---|---|---|---|
| `stage-raw-inputs.py` | stages the five external sources into `inputs/raw/`, redacting two author emails from the WXR, printing sha256 before and after | the 20 Aug source folder (outside the repo) | `inputs/raw/` |
| `wxr-extract.py` | parses the WXR export into text extracts; runs 17 assertions against PLAN.md; classifies the retired-slug history | `inputs/raw/streamlineusa.WordPress.2026-08-20.xml` (+ optional `--uploads`) | `inputs/derived/` |
| `xlsx-extract.py` | flattens both content workbooks to one TSV per sheet | `inputs/raw/*.xlsx` | `inputs/derived/workbook-v{1,2}/` |

```bash
python3 scripts/wxr-extract.py                                # repo-only
python3 scripts/wxr-extract.py --uploads wp-content/uploads   # + disk cross-check
python3 scripts/xlsx-extract.py
```

`wxr-extract.py` exits after printing how many assertions failed. **Zero is the only
acceptable answer** — a failure means either the export changed or a PLAN number moved, and
either way it needs a human before anything downstream runs.

The **committed** extracts are the no-flag output, so `inputs/derived/` stays a pure function
of `inputs/raw/` and regenerates identically on a machine with no dump. `--uploads` adds disk
columns for local verification and will leave the tree dirty; don't commit that variant.
`stage-raw-inputs.py` finds the author addresses it redacts by pattern rather than by name —
hardcoding them in a committed script would defeat the redaction.

## Still to be written

| Script | Owner | Per |
|---|---|---|
| `build-image-manifest.mjs` | image lane (`workorders/cursor-images.md`) | PLAN §11 step 4 — true original dimensions measured off disk, hero re-verification, the upload set |
| migration scripts (`import-*.ts`) | build lane (`workorders/grok-build.md`) | PLAN §11 step 10, CLAUDE.md gates |

## Conventions

- Reads only from `inputs/raw/` and (optionally, behind a flag) the git-ignored
  `wp-content/` dump. Never re-hits the live site to produce a committed file: a number in
  this repo must recompute from this repo.
- Writes only to `inputs/derived/`. Nothing under there is hand-edited — change the script.
- Anything that cannot be reproduced offline is labelled measured-from-live with a date, per
  COWORK.md §3.
