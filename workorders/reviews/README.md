# workorders/reviews/

Cursor's reviews of Grok's handoffs: `grok-YYYY-MM-DD.md`, matching the handoff it answers.

The review is **adversarial by design** — the job is to try to refute each claim and report
only what survives. Cursor is the lane that can run the build on a real screen and keyboard,
hit the live site, and open the source PDFs, so it is the lane that can turn an assertion into
a fact.

## Shape

One row per claim:

| Claim | Verdict | Evidence | Severity |
|---|---|---|---|
| what the handoff asserted | confirmed · not reproduced · contradicted | the command and its output | blocker · defect · nit |

Then:

- **Not in the handoff** — gates that were silently skipped, or work the phase required that
  isn't mentioned. A silent gap reads as done, which is why this section exists.
- **Invented content** — anything rendered that doesn't trace to `content-inventory.tsv`,
  `inputs/derived/`, a deck or the live site. Held to a higher bar than the rest, because
  plausible-looking fabrication is the failure mode this project has already seen once
  (DESIGN §9).
- **Sensitivity** — the diff *and* the commit messages: no REFERENCES-block contacts, nothing
  from the July 10 transcript beyond decisions.
- **Proposed, not applied** — PLAN §1 rows, conflict rows, fixes for Alexey to assign.

## Rules

- **Report; don't patch.** Cursor crosses into Grok's files only if Alexey says so, and then in
  separate commits, because the ownership map exists to keep parallel work mergeable.
- **Reproduce before reporting.** A finding without the command that produces it is an opinion.
- **Confirmed is a real verdict.** Say what held up, not only what broke — the point is a
  trustworthy picture, not a body count.
