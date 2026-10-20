---
description: Critique code, a PR, a screenshot or a design for customer experience quality
argument-hint: [target, e.g. "PR 412" or "src/components/Cart" or a screenshot]
---

Invoke the `customer-experience-excellence` skill, then operate in **Review** mode on this target:

$ARGUMENTS

If no target is given, review the uncommitted changes in the working tree (`git status` and `git diff`); if the tree is clean, review the changes on the current branch against `main`.

Load references as the skill's step 3 directs, plus `references/review-rubric.md` for the scoring dimensions and severities. They live in the skill's own directory alongside `SKILL.md`, not at the repository root.

Required for this mode:
- Read the actual code, diff, screenshot or design. Ground every finding in evidence you have really seen — `file:line`, a named screen, or a specific state.
- Judge code economy and legibility alongside the experience: duplicated components, single-caller abstractions, unjustified dependencies, dead code and names that hide intent are findings, not style notes.
- If the changed code sits in declining styling (styled-components, runtime CSS-in-JS, `makeStyles`, Bootstrap-era CSS, Tailwind behind the current major) or adds to a second parallel component system, note it once as an **offer** of separate work — not as a finding against this change, and never as something to fix in place. `/cex:modernize` runs the full audit.
- Treat known applicable WCAG 2.2 Level A/AA failures in changed scope as blockers. Do not average a blocker away behind strong visual craft.
- Separate confirmed defects from hypotheses that need manual verification, and from issues outside the team's control (third-party checkout, vendor widgets).

Respond using the skill's **Review** response contract: overall assessment → prioritized findings (severity, location/evidence, customer impact, exact recommendation) → strengths → quick wins → unresolved validation. Cap the findings at the 5–8 highest-value items, most severe first.

Do not fix anything in this mode unless asked — report, then offer the fix.
