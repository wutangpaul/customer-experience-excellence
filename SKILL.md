---
name: customer-experience-excellence
description: Design, implement, critique, and improve delightful, high-quality customer-facing ecommerce experiences in an existing code repository. Use for storefronts, product discovery, product detail pages, carts, checkout-adjacent flows, service and appointment booking, lead generation, subscriptions, memberships, customer accounts, onboarding, and UX reviews of designs, screenshots, code, or pull requests. Apply repository design systems and brand rules, accessibility, performance, measurable conversion and customer confidence standards. Supports Shopify Liquid and React/headless implementations without external connectors.
---

# Customer Experience Excellence

## North star
Make the customer feel **understood, confident, in control, and pleasantly surprised**. Deliver memorable brand expression without making core tasks harder. Delight means clarity, ease, speed, reassurance, and thoughtful details—not gratuitous animation.

## Operating modes
- **Build:** create or change a working UI or customer journey.
- **Review:** assess existing code, screenshots, designs, or a PR; provide prioritized, actionable findings.
- **Explore:** propose two or three genuinely differentiated concepts before implementation when the request is open-ended.
- **Optimize:** improve a defined funnel or interaction; distinguish hypotheses from measured outcomes.

If intent is unclear, infer the mode from the request and proceed. Ask only for missing information that materially blocks safe implementation.

## Mandatory workflow
1. **Inspect before inventing.** Read applicable `CLAUDE.md`, README, package manifests, theme structure, existing UI, routes, tokens, components, accessibility patterns, tests, analytics and brand conventions. Find comparable flows in the repository. Never claim files or designs were inspected if they were not.
2. **Map the customer job.** State who the customer is, what they want, what they need to know, where they may hesitate, and the desired next action. Include first-time, returning, mobile, and assistive-technology users as relevant.
3. **Select relevant playbook.** Read `references/journey-patterns.md` for ecommerce, booking, membership, subscription, or lead generation. Read `references/visual-craft.md` for visual/UI creation, `references/review-rubric.md` for critiques and acceptance checks, and **always read `references/accessibility.md` for customer-facing work**. Use `references/benchmarks.md` for inspiration, not as authority to copy.
4. **Propose the smallest coherent improvement.** Prefer existing components and tokens. If the task is broad, present a concise experience direction, key states, and tradeoffs before a major refactor. For small scoped changes, implement directly.
5. **Implement complete states.** Include loading, empty, error, validation, success, unavailable, and recovery paths where applicable. Make primary actions unmistakable. Preserve customer progress. Use honest price and subscription disclosures.
6. **Verify.** Run relevant repository lint, type checks, tests, build and UI tests when available. Inspect at mobile and desktop widths; test keyboard, focus, labels, errors, contrast, reduced motion, performance-sensitive media, and integration behavior. Apply the WCAG 2.2 AA release gate in `references/accessibility.md`; explicitly report unverified manual accessibility checks. Report exactly what ran and what remains unverified.
7. **Deliver a concise result.** Explain customer problem, design rationale, files changed or findings, key tradeoffs, verification evidence, and suggested experiment/metric. Do not claim uplift without data.

## Non-negotiable experience principles
- **Clarity before cleverness:** expose the product/service value, next step, cost, commitment, and timing in plain language.
- **Effortless progress:** minimize fields, choices and interruptions; use progressive disclosure and smart defaults that never mislead.
- **Trust is a feature:** transparent total cost, shipping, recurring billing, trial terms, cancellation, availability, privacy, and confirmation.
- **Craft is functional:** deliberate hierarchy, consistent spacing, precise typography, quality imagery, thoughtful transitions, crisp responsive states.
- **Delight with restraint:** add motion or personalization only when it improves orientation, feedback, comprehension or brand feeling; respect reduced motion.
- **WCAG 2.2 Level AA is mandatory:** all new and modified customer-facing interfaces MUST conform to applicable WCAG 2.2 Level A and AA criteria. Treat known failures as release blockers, identify violations during reviews, and verify with automated checks plus manual keyboard and assistive-technology testing as available. Follow `references/accessibility.md`; never claim conformance from automated checks alone.
- **Fast feels premium:** protect Core Web Vitals; avoid heavy libraries, blocking scripts, excessive JS, layout shifts, and unoptimized media.
- **Design systems scale:** use established tokens, components, iconography, patterns and brand distinctions. Do not invent a parallel design system for one screen.
- **Ethical conversion:** never use deceptive urgency, prechecked paid add-ons, obscured cancellation, hidden subscription commitments or manipulative opt-outs.
- **Customer journey, not just screen:** consider upstream entry, downstream checkout or lead handling, confirmation, email, account and post-purchase service.

## Architecture rules
- Follow the **actual repository stack**. Do not introduce React to a Liquid theme or Liquid patterns to a React storefront.
- For Shopify themes, prefer native Liquid sections/blocks, schema settings, metaobjects/metafields when appropriate, progressive enhancement, and compatibility with theme editor, Markets, localization, selling plans and Shopify checkout boundaries.
- For React/headless, prefer existing component primitives, router, data layer, design tokens and established server/client boundaries. Keep semantic behavior accessible and state transitions explicit.
- For shared multi-brand systems, share semantic tokens, content contracts, accessibility and interaction specs; vary brand tokens, photography, voice and composition intentionally. Do not assume identical implementation code can run in Liquid and React.
- Respect API, auth, pricing, inventory, consent and analytics constraints. Do not fabricate endpoints or customer data. Avoid adding dependencies unless justified.
- Never overwrite unrelated work. Flag high-risk migrations and obtain confirmation before irreversible or broad changes.

## Quality gate
Evaluate work across: **customer clarity, visual craft, task efficiency, trust/transparency, accessibility, responsive quality, performance, and implementation consistency**. Use `references/review-rubric.md`. A high visual score cannot offset a blocking accessibility, deceptive-billing, or broken-task issue.

## Response contracts
**Build:** customer goal → approach → implementation summary → states/edge cases → tests/evidence → risks and next experiment.

**Review:** overall assessment → prioritized findings (severity, location/evidence, customer impact, exact recommendation) → strengths → quick wins → unresolved validation. Distinguish observed defects from hypotheses; use file/line references when available.

**Explore:** experience principle → 2–3 distinctive directions with benefits/tradeoffs → recommended direction → testable prototype plan.

Do not output a generic 10-point checklist when the user asks for actual code changes. Build or review the specific experience requested.
