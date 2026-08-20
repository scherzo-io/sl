# content/findings/

One file per research finding. A finding is something measured or discovered that changes what gets built — not a decision (decisions go in the plan) and not raw data (that goes in a companion file like `image-audit.tsv`).

> Provenance note: the project docs reference a finding template in `COWORK.md` §3, but no `COWORK.md` was ever delivered to this repo (see the 2026-08-20 review). This template is reconstructed from the two findings that already follow the format (`content/originals-finding.md`, `content/image-audit.tsv` + its narrative). Replace it if/when the real COWORK.md lands.

## Template

```markdown
# <Finding title — what was discovered, in one line>

Found <date>, via <method — endpoint, measurement, document, tool>.
<One sentence on why this changes what gets built.>

## What's there
<The core facts. Use a table for counts. Every number reproducible.>

## Measured evidence
<Probes, samples, or extracts that back the claim. Actual values, not estimates.>

## The catch
<What the finding does NOT solve; limits, traps, stale assumptions it exposes.>

## Decision / rule
<The operational rule that follows, stated so a script or a person can apply it
 without judgment calls. If it needs a human decision, name the owner.>

## Reproducing
<Exact command, script path, or query to regenerate the evidence. If it needs
 credentials or an authenticated session, say so.>
```

## Conventions

- Filename: `<topic>-finding.md`, lowercase, hyphenated.
- One finding per file; link related findings rather than merging them.
- Numbers that appear in a finding must reconcile with the companion data files
  in `content/` — if they can't be recomputed from data in this repo, mark them
  explicitly as measured-from-live and date them.
- When a finding invalidates something in the plan, add a row to the plan's
  decision table — do not silently edit the plan.
