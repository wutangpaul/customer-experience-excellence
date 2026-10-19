# Contributing

Thanks for helping improve this skill. It is prose, not code — the bar is clarity and accuracy rather than passing tests.

## How to propose a change

1. Fork the repository and create a branch.
2. Make the edit.
3. Test it against a real task before opening a PR: install your branch into a project (`git clone -b <branch> ... .claude/skills/customer-experience-excellence`), run `/customer-experience-excellence` on a task the change should affect, and confirm Claude's behavior actually shifts the way you intended.
4. Open a PR describing the customer problem behind the change and what you observed in step 3.

## What makes a good change

- **Instructions, not essays.** Every line in `SKILL.md` competes for the model's attention. Prefer removing a sentence over adding one.
- **Keep `SKILL.md` the index.** Deep material belongs in `references/`, loaded only when the task calls for it.
- **No invented authority.** Don't add conversion claims, award claims or statistics without a citation. The skill explicitly forbids claiming uplift without data; the repo should hold itself to the same rule.
- **Stay stack-agnostic.** Guidance should hold for both Shopify Liquid and React/headless unless it is explicitly scoped to one.
- **Keep examples generic.** No internal product names, customer data, screenshots or anything a specific employer owns.
- **Accessibility guidance must map to real criteria.** If you cite a WCAG success criterion, verify the number and level first.

## Structure

- `SKILL.md` — frontmatter (`name`, `description`) plus the operating instructions. The `description` is what triggers skill discovery, so edits there change when the skill fires.
- `references/*.md` — loaded on demand by the workflow in `SKILL.md`. If you add a file, reference it from `SKILL.md` or it will never be read.

## Reporting problems

Open an issue describing the prompt you used, what Claude did, and what you expected instead. Behavioral reports are more useful than abstract suggestions.
