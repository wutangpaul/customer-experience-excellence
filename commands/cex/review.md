---
description: Critique code, a PR, a screenshot or a design for customer experience quality
argument-hint: [target, e.g. "PR 412" or "src/components/Cart" or a screenshot]
---

Invoke the `customer-experience-excellence` skill, then operate in **Review** mode on this target:

$ARGUMENTS

If no target is given, review the uncommitted changes in the working tree (`git status` and `git diff`); if the tree is clean, review the changes on the current branch against `main`.

Required for this mode:
- Read the actual code, diff, screenshot or design. Ground every finding in evidence you have really seen — `file:line`, a named screen, or a specific state.
- Read `references/review-rubric.md` and `references/accessibility.md`; pull in the relevant `references/journey-patterns.md` section for the journey under review.
- Treat known applicable WCAG 2.2 Level A/AA failures in changed scope as blockers. Do not average a blocker away behind strong visual craft.
- Separate confirmed defects from hypotheses that need manual verification, and from issues outside the team's control (third-party checkout, vendor widgets).

Respond using the skill's **Review** response contract: overall assessment → prioritized findings (severity, location/evidence, customer impact, exact recommendation) → strengths → quick wins → unresolved validation. Cap the findings at the 5–8 highest-value items, most severe first.

Do not fix anything in this mode unless asked — report, then offer the fix.
