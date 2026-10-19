# WCAG 2.2 Level AA release gate

All new and modified customer-facing interfaces **MUST conform to WCAG 2.2 Level AA**. Apply all relevant Level A and AA success criteria. Do not treat automated tooling as proof of full conformance; validate the complete user journey, including third-party widgets where the team has control, and disclose external limitations.

## Implementation requirements
- Use semantic HTML, correct accessible names/roles/states, and native controls before custom ARIA.
- Ensure all functionality is keyboard operable, with logical focus order, visible focus, no keyboard traps, and appropriate focus restoration after dialogs/navigation.
- Meet WCAG contrast requirements for text and non-text UI; do not use color alone to convey meaning.
- Ensure labels, instructions, validation messages and status updates are programmatically associated and announced where necessary.
- Support zoom/reflow, orientation, touch/pointer targets, and responsive layouts without loss of functionality.
- Honor reduced-motion preferences; provide alternatives for essential motion and avoid inaccessible auto-updating content.
- Check accessible authentication, forms, error prevention for financial/legal transactions, and consistent help and navigation where applicable.
- For booking, checkout, memberships, subscriptions and lead-gen, verify the entire path including errors, confirmation, cancellation and account management.

## Required verification
1. Run the repository's accessibility checks (e.g. axe-core, Playwright accessibility assertions, eslint accessibility rules) when available; report commands and results.
2. Manually test keyboard-only completion, tab order, focus visibility, dialogs, dropdowns, form errors, and recovery.
3. Check screen-reader behavior with an available screen reader when possible; otherwise mark it **not verified** and request human QA.
4. Check text/non-text contrast, 200% and 400% zoom/reflow as applicable, small mobile viewport, and reduced-motion settings.
5. Map each observed violation to a specific WCAG 2.2 success criterion, severity, location, fix, and retest outcome. Do not invent criterion IDs if unsure; verify them first.
6. Never claim WCAG conformance based solely on automated tests. State residual risks and manual checks still required.

## Release policy
- Treat any known applicable Level A/AA failure in changed scope as a **release blocker** until fixed or explicitly escalated to the accountable owner. Do not silently waive requirements or mark a failed check as passed.
- In reviews, distinguish confirmed failures, potential risks needing manual verification, and items outside the team's control.
- For third-party checkout or booking components, document boundaries and vendor remediation requirements; do not imply the entire journey conforms without evidence.
