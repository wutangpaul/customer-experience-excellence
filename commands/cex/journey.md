---
description: Map a customer journey end-to-end — entry, hesitation, confirmation, post-purchase
argument-hint: [the journey, e.g. "buying a subscription with a hardware device"]
---

Invoke the `customer-experience-excellence` skill, read the relevant section of `references/journey-patterns.md` — it sits in the skill's own directory alongside `SKILL.md`, not at the repository root — then map this journey:

$ARGUMENTS

Inspect the repository for the real journey as implemented — routes, templates, sections, components, forms, email triggers and account pages. Map what exists, not an idealized funnel. Say explicitly where a stage has no implementation you could find.

For each stage, from upstream entry through to post-purchase service, cover:
- **What the customer is trying to do** and what they must know to proceed.
- **Where they hesitate** — unclear cost, commitment, timing, availability, fit, trust or privacy.
- **The desired next action** and how obvious it currently is.
- **Where it lives in the repo** (`file:line` or route), or *not implemented*.

Include first-time, returning, mobile and assistive-technology customers where they diverge. Then cover the cross-journey edge cases from the reference that actually apply: localization, currency, taxes, consent, network failure, unavailability, auth expiry, small screens, payment or booking errors, and handoff to external systems.

Close with:
- **Weakest stage** and why, with evidence.
- **Measurement** — the outcome metric, diagnostics and guardrails for this journey, plus which events already exist in the code and which do not.
- **Recommended next step** — usually `/cex:build` or `/cex:optimize` scoped to the weakest stage.

This is a mapping command: no production code changes.
