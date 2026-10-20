# Customer Experience Excellence

A [Claude Code](https://claude.com/claude-code) skill that sets a reusable design, implementation and review standard for ecommerce, bookings, memberships, subscriptions, lead generation and customer account experiences.

It teaches Claude to inspect your repository first, work within your existing design system, implement complete UI states, hold WCAG 2.2 Level AA as a release gate, write minimal expert-level code in React, Rails or Shopify Liquid, and report honestly on what it verified. No connector, API key or external service is required.

## Install

Run this from the root of the repository you want the skill in:

```bash
npx customer-experience-excellence
```

That's it — the skill lands in `.claude/skills/customer-experience-excellence/` and the `/cex:` slash commands in `.claude/commands/cex/`. To make them available in **every** project on your machine instead:

```bash
npx customer-experience-excellence --global
```

| Flag | Effect |
|---|---|
| `-g`, `--global` | Install into `~/.claude` instead of the current project |
| `--dir <path>` | Install the skill into a specific skills directory (commands go to its sibling `../commands/cex`) |
| `--skill-only` | Install the skill without the `/cex:` commands |
| `-f`, `--force` | Overwrite an existing installation (how you upgrade) |
| `--uninstall` | Remove the skill and its commands |
| `-y`, `--yes` | Skip the confirmation prompt when local edits would be lost |
| `-v`, `--version` | Print the version |
| `-h`, `--help` | Show usage |

**Upgrades won't eat your edits.** The installer records a checksum of every file it writes. `--force` compares against that record first, lists anything you have changed or added, and asks before overwriting — so a tailored `references/review-rubric.md` survives. Pass `--yes` to skip the prompt in CI.

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

**Note on the `/cex:` commands.** Claude Code only discovers slash commands under `.claude/commands/`, so a clone or ZIP copy gives you the skill but not the commands. Link or copy them across afterwards:

```bash
mkdir -p .claude/commands
cp -R .claude/skills/customer-experience-excellence/commands/cex .claude/commands/cex
```

</details>

## Usage

Open Claude Code from that repository and run a `/cex:` command, or just describe a customer-experience task and let skill discovery pick it up. To upgrade later, re-run the installer with `--force`.

**Start with `/cex:help`** for a routed list of the commands, or go straight to `/cex:review` on work you already have. `/cex:review`, `/cex:a11y` and `/cex:rubric` take no argument — they default to your current changes.

```
/cex:help
/cex:build Improve our product detail page using existing components and tokens.
/cex:review Review the booking flow for mobile friction and accessibility.
/cex:explore How customers choose between our membership tiers.
/cex:optimize Checkout step 2 — we're losing people at the shipping form.
/cex:a11y The appointment calendar
/cex:rubric PR 412
/cex:journey Buying a subscription with a hardware device
/cex:modernize src/components
```

### Commands

| Command | What it does |
|---|---|
| `/cex:help` | List the commands and route a task to the right one. Costs nothing — it doesn't load the skill. |
| `/cex:build` | Create or change a customer-facing UI or journey, with complete states and verification. |
| `/cex:review` | Critique code, a PR, a screenshot or a design; prioritized findings with evidence. Defaults to your current changes. |
| `/cex:explore` | Propose 2–3 genuinely differentiated directions before any implementation. |
| `/cex:optimize` | Improve a defined funnel, separating hypotheses from measured outcomes. |
| `/cex:a11y` | Run the WCAG 2.2 Level AA release gate over the changed scope. |
| `/cex:rubric` | Score work across the ten review dimensions with severities and a ship verdict. |
| `/cex:journey` | Map a journey end-to-end — entry, hesitation, confirmation, post-purchase. |
| `/cex:modernize` | Audit styling systems for decline *and* duplication; propose the smallest consolidation that removes the pain. Reports only — never migrates without a yes. |

Each command (except `/cex:help`) loads the skill and pins it to one of its four operating modes — **Build**, **Review**, **Explore**, **Optimize** — so you skip the mode inference. `/customer-experience-excellence` still works if you'd rather let it infer. See `references/examples.md` for what good output looks like in each mode.

## What's in here

| Path | Purpose |
|---|---|
| `SKILL.md` | The skill itself: workflow, principles, architecture rules, response contracts. |
| `commands/cex/` | The nine `/cex:` slash commands, installed to `.claude/commands/cex/`. |
| `references/accessibility.md` | WCAG 2.2 AA release gate and required verification steps. Always loaded for customer-facing work. |
| `references/journey-patterns.md` | Playbooks for ecommerce, booking, membership/subscription and lead-gen journeys. |
| `references/visual-craft.md` | Visual direction, systematic execution and anti-patterns. |
| `references/stack-craft.md` | Expert implementation standards for React/headless, Ruby on Rails and Shopify Liquid. |
| `references/shopify-liquid.md` | The Shopify platform contract for non-headless themes: schema, the theme editor, Section Rendering, app extensions, theme features. |
| `references/tailwind-ui-systems.md` | Tailwind CSS (latest) and the shadcn/ui, Base UI, Radix, Wensity and daisyUI ecosystems. |
| `references/modernization.md` | Triaging declining styling, spotting duplicated systems, and staging a consolidation. Powers `/cex:modernize`. |
| `references/review-rubric.md` | Scoring dimensions, severity definitions and acceptance checks. |
| `references/benchmarks.md` | Inspiration references, with guidance on using them responsibly. |
| `references/examples.md` | Example prompts and the behavior they should produce. |
| `agents/openai.yaml` | Display metadata for agent surfaces that read this format. |
| `bin/install.mjs` | The `npx` installer. Zero dependencies — it copies files and records a checksum manifest so upgrades can spot your edits. |

## Accessibility release standard

All new and modified customer-facing UI must meet **WCAG 2.2 Level AA** (including applicable Level A criteria). The skill treats confirmed failures in changed scope as release blockers, requires automated checks plus manual keyboard testing, and records screen-reader, zoom and reduced-motion checks as verified or outstanding. Automated passes alone do not establish conformance. See `references/accessibility.md`.

## Code standard

The skill ships the **smallest code that does the job** and writes it for the agent who comes next.

- **Minimal by default** — it walks the [ponytail](https://github.com/DietrichGebert/ponytail) ladder before writing anything: does this need to exist, is it already in the codebase, does the platform or an installed dependency do it, can it be one line — and only then the minimum code that works. No speculative abstraction, no unjustified dependency, dead code deleted as it goes. Laziness stops at the customer: required states, WCAG 2.2 AA, honest pricing and error recovery are scope, not extras.
- **Legible to the next AI run** — intent recoverable from names and file placement alone, explicit contracts, comments only for the non-obvious *why*, local idiom followed exactly.
- **Expert in your stack** — React/headless, Rails (Hotwire, Turbo, ViewComponent), Shopify Liquid and the Shopify *platform* contract, Tailwind's current major and the shadcn/ui, Base UI, Radix, Wensity and daisyUI ecosystems. It detects what you have installed and matches it. See `references/stack-craft.md`, `references/shopify-liquid.md` and `references/tailwind-ui-systems.md`.
- **Offers to modernize, never ambushes** — it finishes your task in the existing idiom, then reports declining or duplicated styling systems and offers a staged refactor as separate work. Findings need a named customer cost, not an age. Run `/cex:modernize` for the full audit; see `references/modernization.md`.

Code economy and legibility are scored dimensions in `/cex:rubric`, not style notes.

## Customization

- Put repository-specific rules in your own `CLAUDE.md`; the skill reads it before acting.
- Your existing design tokens and components stay the source of truth — the skill is told not to invent a parallel design system.
- Edit the files in `references/` as your customer research and design standards change. Upgrading with `--force` lists your edits and asks before overwriting them, so tailoring the rubric is safe.
- The benchmark list is inspiration, not a substitute for user testing and not an award certification.

## Rollout recommendation

Pilot on one product detail page, one lead-generation form and one membership or booking flow. Compare the skill's findings with a human design review, then agree on priority thresholds and any project-specific standards before treating rubric scores as release criteria.

## Contributing

Issues and pull requests are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © Paul McClean
