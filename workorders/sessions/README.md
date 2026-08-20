# workorders/sessions/

One file per working session, per lane. This is how the project keeps its state when the
agent that produced it is gone.

Filename: `YYYY-MM-DD-<lane>-NN.md` — e.g. `2026-08-21-cursor-01.md`,
`2026-08-22-grok-02.md`. Second session the same day gets `-02`.

Write it **before you stop**, not after you're asked. COWORK.md §1: anything that exists only
in a chat session is already lost. That is not a theoretical risk here — the 19 Aug document
merge was lost exactly that way, and COWORK.md exists because of it.

## Template

```markdown
# <lane> session NN — <date>

**Phase:** <which phase of your work order>
**Branch:** <cursor/images | grok/build>
**Commits:** <short shas, or "none — nothing landed">

## Did

- <what you actually did, in the order you did it>

## Landed

| Path | What |
|---|---|
| `...` | <one line> |

## Numbers

<Any figure you measured, with the command that reproduces it. If it can only come from the
live site or a local file that isn't committed, say so and date it.>

## Decisions I made on my own

<Judgment calls inside your lane that a reviewer should be able to see and disagree with.>

## Proposed, not applied

<PLAN §1 rows, source-conflicts rows, DESIGN changes. You propose; Alexey applies.>

## Blocked

<What stopped, who owns it, and what you did instead.>

## Skipped

<Anything in scope that you did not do, and why. Be explicit — a silent gap reads as done.>

## Next step

<The single most useful thing the next session should do. One sentence.>
```

## Conventions

- **Numbers reconcile or get labelled.** A figure that can't be recomputed from this repo is
  marked measured-from-live with a date and a command (COWORK.md §3).
- **Skipped is a required section.** Scaling the work down is Alexey's call, so an omission
  has to be visible.
- **Sensitivity applies here too.** No revenue, spend, staffing or ownership content; no
  architect direct contacts. These files are in a repo with a remote.
- After writing your session log, update `workorders/STATUS.md` — **Last updated**,
  **In flight**, **Next up**. The log says what happened; STATUS says where things stand.
