---
description: Build or change a customer-facing UI or journey to the CX Excellence standard
argument-hint: [what to build, e.g. "a size guide drawer on the PDP"]
---

Invoke the `customer-experience-excellence` skill, then operate in **Build** mode on this request:

$ARGUMENTS

Follow the skill's mandatory workflow in order. Do not skip step 1 — inspect the real repository stack, design tokens, components and comparable flows before writing anything, and never claim to have inspected files you did not open.

Load references as the skill's step 3 directs. They live in the skill's own directory alongside `SKILL.md`, not at the repository root.

Required for this mode:
- Detect the installed Tailwind and component-system versions first and match their APIs. Reuse the repository's tokens and existing component system; never introduce a second one.
- Propose the smallest coherent improvement; prefer existing components and tokens over new ones.
- Apply the skill's **Code standards**: smallest honest diff, reuse before writing, no speculative abstraction or unjustified dependency, delete what the change makes dead, and leave code a fresh agent can read and extend without this session's context.
- Implement complete states: loading, empty, error, validation, success, unavailable and recovery.
- Verify with the repository's own lint, type, test and build commands; check mobile and desktop widths, keyboard, focus, labels, contrast and reduced motion.

Respond using the skill's **Build** response contract: customer goal → approach → implementation summary → states/edge cases → tests/evidence → risks and next experiment. Report exactly what ran and what remains unverified.

If the request is open-ended enough that two or three genuinely different directions exist, say so in one sentence and suggest `/cex:explore` — then proceed with the most defensible direction rather than stopping.
