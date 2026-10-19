---
description: Score work against the eight-dimension CX review rubric with severities
argument-hint: [scope, e.g. "PR 412" — defaults to current changes]
---

Invoke the `customer-experience-excellence` skill, read `references/review-rubric.md`, then score:

$ARGUMENTS

If no scope is given, score the uncommitted changes in the working tree; if the tree is clean, score the changes on the current branch against `main`.

Score each of the eight dimensions 0–4 (0 broken/harmful, 1 poor, 2 adequate, 3 strong, 4 exemplary), marking `N/A` only where the dimension is genuinely irrelevant:

| Dimension | Score | Evidence |
|---|---|---|
| Customer clarity | | |
| Visual craft | | |
| Task efficiency | | |
| Trust/transparency | | |
| Accessibility | | |
| Responsive quality | | |
| Performance | | |
| System consistency | | |

Every score needs evidence you have actually observed — `file:line`, a named state, a command you ran. Never invent measurements; if a dimension cannot be assessed in this environment, say so instead of guessing a number.

Then report:
- **Blockers** — core task broken, deceptive billing, severe accessibility barrier, data loss/security/privacy. A high visual score cannot offset one, and blockers are never averaged away.
- **Minimum acceptance checks** — walk the reference's checklist and mark each pass / fail / not verified.
- **Verdict** — ship, ship with follow-ups, or hold, with the one thing that most needs fixing first.
