# Example team prompts and expected behavior

These illustrate how the skill should behave. Replace the example products and flows with your own when sharing with your team.

Each example uses a `/cex:` command, which pins the operating mode. Plain `/customer-experience-excellence` works too and infers the mode from the request.

## Example 1: Build a product page
Prompt: `/cex:build Improve the flagship product detail page. Preserve our components and tokens.`
Expected: inspect the actual PDP, product data and design system; identify compatibility, demonstration, proof, cost and CTA clarity; implement focused improvements with responsive/accessible states; run available checks; summarize outcomes and unverified assumptions.

## Example 2: Booking flow review
Prompt: `/cex:review The consultation booking flow — prioritize mobile friction.`
Expected: inspect screens/code and booking states; report severity-ranked issues including timezone, slot availability, error recovery, confirmation and consent; reference files/lines; propose tests. Report, then offer the fix — do not fix unasked.

## Example 3: Membership account
Prompt: `/cex:build A self-service upgrade/downgrade experience for our membership product.`
Expected: inspect current billing/account stack; clarify entitlement rules only if unavailable; distinguish immediate vs renewal-date changes, prorations and cancellation; create accessible states; never invent billing API capabilities.

## Example 4: Lead-gen design exploration
Prompt: `/cex:explore Lead-gen journeys for our installed-service offering that qualify customers without a long form.`
Expected: 2–3 genuinely differentiated concepts, transparent customer effort and tradeoffs, conversion hypotheses, and an experiment plan; no production code; do not pretend to have implemented a prototype.

## Example 5: Pull request critique
Prompt: `/cex:review PR 412`
Expected: review diff and relevant existing patterns; identify only grounded defects and important risks with severity, evidence, fixes and validation; do not invent screenshots or test results.

## Example 6: Accessibility gate before release
Prompt: `/cex:a11y` (no argument — audits the current changes)
Expected: run the repository's own accessibility checks and report their real output; test keyboard completion; mark screen-reader checks **not verified** if no screen reader is available; map each violation to a verified WCAG 2.2 criterion; close with residual risks. Never claim conformance from automated checks alone.

## Example 7: Styling audit
Prompt: `/cex:modernize src/components`
Expected: counts with file paths, never impressions; duplication reported separately from decline; every Tier 1 finding justified by a named customer cost; the smallest useful rung on the consolidation ladder recommended; an explicit offer and no code changed. A clean repository gets a one-sentence all-clear, not manufactured findings.
