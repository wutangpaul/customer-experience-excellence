---
description: Audit styling systems for decline and duplication, then propose a staged consolidation
argument-hint: [optional scope, e.g. "src/components" — defaults to the whole repository]
---

Invoke the `customer-experience-excellence` skill, read `references/modernization.md` and the relevant sections of `references/tailwind-ui-systems.md` — they sit in the skill's own directory alongside `SKILL.md`, not at the repository root — then audit this scope:

$ARGUMENTS

If no scope is given, audit the whole repository.

**This command does not change code.** It reports and offers. Do not start a migration in this mode, even a small one — wait for an explicit yes.

Audit for two things, and keep them separate in the report:

**1. Decline** — systems that are dying, incompatible or measurably costly.
- Run the detection commands in `references/modernization.md` and report **counts with file paths**, never impressions.
- Triage into **Tier 1** (worth offering to refactor), **Tier 2** (maintained; a cost/benefit call) or **Tier 3** (leave alone: vendor CSS, checkout, third-party widgets). Do not report a maintained system as a defect — CSS Modules, vanilla-extract, Panda, StyleX, current component-library majors and modern plain CSS are not legacy.
- Justify every Tier 1 item with evidence: maintenance status, bundle bytes, blocked RSC/SSR, a measured Core Web Vital, or a specific accessibility defect. If you cannot name a customer cost, it is not Tier 1.
- Separate the cheap case (Tailwind v3 → v4 upgrade) from the expensive one (CSS-in-JS rewrite).

**2. Duplication** — usually the bigger finding. How many styling and component systems exist, what each owns, and where they overlap.
- Inventory every system with its surfaces and call-site counts. Name duplicate component kinds explicitly — two Buttons, two Modals, two form-field patterns — and whether they are reachable in the same customer journey.
- Quantify the standing cost: shipped-twice bytes, divergent token values, `!important` density, inconsistent focus/dialog/keyboard behavior, and the ambiguity tax on everyone deciding which system a new file belongs to.
- Distinguish a **split** (systems overlapping on the same pages) from a **clean boundary** (one microsite or embedded widget with no per-page overlap). A boundary gets documented, not migrated.
- Say plainly where consolidation is *not* worth it: frozen surfaces, no verification budget, platforms that genuinely cannot share components (Liquid vs React — consolidate tokens, not components), or any migration that realistically would not be finished.

Report in this order:
1. **What's installed** — every styling and component system, version, file count, import count, surfaces owned.
2. **Duplication** — the overlap map, duplicate component kinds, and the maintenance cost with numbers.
3. **Tier 1 decline** — most costly first: what, where, customer cost with evidence, rough scope, what cannot be migrated.
4. **Tier 2 observations** — one line each, with the condition that would change the answer.
5. **Recommended rung** — the smallest step on the consolidation ladder that removes the actual pain (document the boundary → freeze the old system to new imports → converge tokens → converge one component kind → one vertical slice → full migration). Recommend the lowest rung that works, not the most ambitious. If you recommend choosing a survivor system, name it and the reasoning: call-site count, platform fit, maintenance trajectory, behavior and accessibility already earned, team fluency, exit cost.
6. **Verification plan** — visual regression, keyboard and contrast re-test, bundle/CSS byte delta, Core Web Vitals before and after.
7. **The offer** — ask whether to proceed, on its own branch and PR, with the sequence you would follow and the risks you would watch. State what "done" means: the old dependency gone from the manifest.

If the repository is already on the current Tailwind major with one coherent component system, say exactly that in a sentence and stop. A clean result is a valid result — do not manufacture findings.
