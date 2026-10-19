---
description: Build or change a customer-facing UI or journey to the CX Excellence standard
argument-hint: [what to build, e.g. "a size guide drawer on the PDP"]
---

Invoke the `customer-experience-excellence` skill, then operate in **Build** mode on this request:

$ARGUMENTS

Follow the skill's mandatory workflow in order. Do not skip step 1 — inspect the real repository stack, design tokens, components and comparable flows before writing anything, and never claim to have inspected files you did not open.

Required for this mode:
- Read `references/accessibility.md` (always, for customer-facing work) plus the relevant section of `references/journey-patterns.md` and `references/visual-craft.md`.
- Propose the smallest coherent improvement; prefer existing components and tokens over new ones.
- Implement complete states: loading, empty, error, validation, success, unavailable and recovery.
- Verify with the repository's own lint, type, test and build commands; check mobile and desktop widths, keyboard, focus, labels, contrast and reduced motion.

Respond using the skill's **Build** response contract: customer goal → approach → implementation summary → states/edge cases → tests/evidence → risks and next experiment. Report exactly what ran and what remains unverified.

If the request is open-ended enough that two or three genuinely different directions exist, say so in one sentence and suggest `/cex:explore` — then proceed with the most defensible direction rather than stopping.
