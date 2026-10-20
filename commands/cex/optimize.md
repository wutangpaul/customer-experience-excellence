---
description: Improve a defined funnel or interaction, separating hypotheses from measured outcomes
argument-hint: [the funnel or interaction, e.g. "booking step 2 drop-off"]
---

Invoke the `customer-experience-excellence` skill, then operate in **Optimize** mode on this funnel or interaction:

$ARGUMENTS

Load references as the skill's step 3 directs — the relevant `references/journey-patterns.md` section carries this journey's standard metrics. They live in the skill's own directory alongside `SKILL.md`, not at the repository root.

Required for this mode:
- Inspect the real implementation and, where it exists, the real instrumentation. Read the analytics/event code in the repository rather than assuming which events fire.
- Identify the friction with evidence: specific steps, states, fields, latency, error paths or unclear disclosures. Name where customers hesitate and why.
- Apply the metrics discipline in `references/review-rubric.md`: business outcome + diagnostic metrics + guardrails. State event instrumentation assumptions explicitly.
- Ethical conversion is non-negotiable — no deceptive urgency, prechecked paid add-ons, obscured cancellation or manipulative opt-outs, even if they would lift the number.

Respond with: current funnel and where it leaks (evidence) → ranked changes with expected mechanism → implementation summary for anything you changed → the experiment design (outcome metric, diagnostics, guardrails, how long) → risks.

Label every projected improvement as a hypothesis. Never claim uplift without data you have actually seen.
