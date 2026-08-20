# workorders/handoffs/

Grok writes one file here at every phase gate: `grok-YYYY-MM-DD.md`.

A handoff is what Cursor reviews, so it is written to be *checked*, not admired:

- **Every gate result is a claim plus the command that reproduces it.** "Build clean" is not a
  claim; `npm run build` with its output is.
- **Verified and asserted are separate lists.** Anything Grok could not check itself — rendering
  at 390 / 768 / 1440, keyboard behaviour in the lightbox, contrast on real pixels — is handed
  over as unverified. Flagging it costs nothing; asserting it and being wrong costs a review
  cycle and some trust.
- **Every skip and every guess is listed**, including fields left empty because a conflict row
  or a blocked decision wasn't resolved. Those are the right call — hiding them isn't.
- **Files touched outside the obvious**, and anywhere the ownership boundary in
  `../README.md` §2 was close.

Cursor's response lands in `../reviews/grok-YYYY-MM-DD.md`, one row per claim: confirmed /
not reproduced / contradicted. Disagreeing with a review finding is fine — in writing, here.
