# Customer Experience Excellence

A [Claude Code](https://claude.com/claude-code) skill that sets a reusable design, implementation and review standard for ecommerce, bookings, memberships, subscriptions, lead generation and customer account experiences.

It teaches Claude to inspect your repository first, work within your existing design system, implement complete UI states, hold WCAG 2.2 Level AA as a release gate, and report honestly on what it verified. No connector, API key or external service is required.

## Install

Run this from the root of the repository you want the skill in:

```bash
npx customer-experience-excellence
```

That's it — the skill lands in `.claude/skills/customer-experience-excellence/`. To make it available in **every** project on your machine instead:

```bash
npx customer-experience-excellence --global
```

| Flag | Effect |
|---|---|
| `-g`, `--global` | Install into `~/.claude/skills` instead of the current project |
| `--dir <path>` | Install into a specific skills directory |
| `-f`, `--force` | Overwrite an existing installation (how you upgrade) |
| `-h`, `--help` | Show usage |

### Other ways to install

<details>
<summary>Clone with git, use a submodule, or download a ZIP</summary>

**Clone into one project** — run from the repository root:

```bash
git clone https://github.com/wutangpaul/customer-experience-excellence.git \
  .claude/skills/customer-experience-excellence
```

**Clone for every project on your machine:**

```bash
git clone https://github.com/wutangpaul/customer-experience-excellence.git \
  ~/.claude/skills/customer-experience-excellence
```

**For a team, version-pinned** — add it as a submodule so everyone gets the same revision and updates land through a PR:

```bash
git submodule add https://github.com/wutangpaul/customer-experience-excellence.git \
  .claude/skills/customer-experience-excellence
git commit -m "Add customer-experience-excellence skill"
```

**Without git or npm** — download the repository as a ZIP from GitHub, unzip it, and copy the folder to `.claude/skills/customer-experience-excellence/`. The directory must keep that name for the skill to resolve.

To update a cloned install: `git -C .claude/skills/customer-experience-excellence pull`.

</details>

## Usage

Open Claude Code from that repository and run `/customer-experience-excellence`, or just describe a customer-experience task and let skill discovery pick it up. To upgrade later, re-run the installer with `--force`.

```
/customer-experience-excellence Improve our product detail page using existing components and tokens.
/customer-experience-excellence Review the booking flow for mobile friction and accessibility.
/customer-experience-excellence Design and implement an account membership upgrade flow.
/customer-experience-excellence Audit this PR for customer experience regressions.
```

The skill runs in one of four modes — **Build**, **Review**, **Explore**, **Optimize** — inferred from your request. See `references/examples.md` for what good output looks like in each.

## What's in here

| Path | Purpose |
|---|---|
| `SKILL.md` | The skill itself: workflow, principles, architecture rules, response contracts. |
| `references/accessibility.md` | WCAG 2.2 AA release gate and required verification steps. Always loaded for customer-facing work. |
| `references/journey-patterns.md` | Playbooks for ecommerce, booking, membership/subscription and lead-gen journeys. |
| `references/visual-craft.md` | Visual direction, systematic execution and anti-patterns. |
| `references/review-rubric.md` | Scoring dimensions, severity definitions and acceptance checks. |
| `references/benchmarks.md` | Inspiration references, with guidance on using them responsibly. |
| `references/examples.md` | Example prompts and the behavior they should produce. |
| `agents/openai.yaml` | Display metadata for agent surfaces that read this format. |
| `bin/install.mjs` | The `npx` installer. Zero dependencies — it only copies files. |

## Accessibility release standard

All new and modified customer-facing UI must meet **WCAG 2.2 Level AA** (including applicable Level A criteria). The skill treats confirmed failures in changed scope as release blockers, requires automated checks plus manual keyboard testing, and records screen-reader, zoom and reduced-motion checks as verified or outstanding. Automated passes alone do not establish conformance. See `references/accessibility.md`.

## Customization

- Put repository-specific rules in your own `CLAUDE.md`; the skill reads it before acting.
- Your existing design tokens and components stay the source of truth — the skill is told not to invent a parallel design system.
- Edit the files in `references/` as your customer research and design standards change.
- The benchmark list is inspiration, not a substitute for user testing and not an award certification.

## Rollout recommendation

Pilot on one product detail page, one lead-generation form and one membership or booking flow. Compare the skill's findings with a human design review, then agree on priority thresholds and any project-specific standards before treating rubric scores as release criteria.

## Contributing

Issues and pull requests are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © Paul McClean
