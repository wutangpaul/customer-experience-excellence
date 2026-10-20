# Review rubric and acceptance criteria

Score each dimension 0–4: 0 broken/harmful, 1 poor, 2 adequate, 3 strong, 4 exemplary. Mark N/A where truly irrelevant. Explain evidence; never invent measurements.

| Dimension | Review question |
|---|---|
| Customer clarity | Can customers understand value, choices and next step immediately? |
| Visual craft | Is the design distinctive, polished, coherent and brand-appropriate? |
| Task efficiency | Can the main task be completed with minimal friction and easy recovery? |
| Trust/transparency | Are pricing, recurring terms, availability and privacy understandable? |
| Accessibility | Does the changed experience meet applicable WCAG 2.2 Level A and AA criteria, including keyboard, screen reader, low vision, zoom and error recovery? |
| Responsive quality | Does it work across small screens, touch, zoom and localization? |
| Performance | Are loading, responsiveness and visual stability protected? |
| System consistency | Does it follow existing components, tokens and architecture? |
| Code economy | Is this the smallest change that does the job — reusing what exists, adding no speculative abstraction, dependency or dead code? |
| Code legibility | Could a fresh agent with no session context open these files, infer the customer intent, and safely extend the work? |

## Severity
- **Blocker:** prevents core task; deceptive billing; severe accessibility barrier; data loss/security or privacy issue.
- **High:** significant friction, misleading choice, critical mobile problem, major trust gap.
- **Medium:** meaningful usability, clarity or visual consistency issue.
- **Low:** polish and optional delight improvement.

Known WCAG 2.2 Level A/AA failures in changed scope are release blockers. Consult `accessibility.md` for required evidence and checks. Do not average away blockers. Include at most 5–8 highest-value findings first. For each: severity, evidence (file:line/screen/state), customer consequence, proposed fix, verification.

## Minimum acceptance checks
- Primary customer task completes end-to-end or blockers are explicitly identified.
- All relevant UI states are designed and implemented.
- Automated accessibility checks and manual keyboard testing are performed where possible; screen-reader, zoom/reflow and reduced-motion checks are recorded, with unverified checks clearly disclosed.
- Pricing, recurring terms and consent are accurate and clear.
- Mobile and desktop layouts are checked.
- Existing design system and brand conventions are respected.
- The diff is minimal and intentional: no unrelated edits, duplicated components, single-caller abstractions, unjustified dependencies, dead code or stray TODOs/commented-out alternatives.
- Names, contracts and file placement make the customer intent recoverable from the code alone.
- Stack-specific standards in `stack-craft.md` are met for the repository's framework.
- Styling matches the installed Tailwind generation and the repository's existing component system, using theme tokens rather than one-off arbitrary values. See `tailwind-ui-systems.md`.
- Relevant tests/build checks run; unrun checks are disclosed.
- Proposed metric/experiment is linked to the actual customer outcome.

## Metrics discipline
Use business outcome + diagnostic metrics + guardrails. Example: appointment completion rate (outcome), step drop-off (diagnostic), invalid bookings and support tickets (guardrails). State event instrumentation assumptions; avoid asserting causal impact without experiment or credible evidence.
