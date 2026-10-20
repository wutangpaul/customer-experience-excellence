---
description: What the /cex: commands do and which one to reach for
argument-hint: [optional — a task you want routed, e.g. "our checkout drops people"]
---

Do **not** invoke the `customer-experience-excellence` skill for this command — it is a signpost, not a work mode. Answer from this file alone.

Print the reference below as-is, then stop. Keep it tight; do not expand it into prose.

---

**Customer Experience Excellence** — a design, build and review standard for ecommerce, booking, membership, subscription, lead-gen and customer-account experiences.

**Start here:** `/cex:review` on work you already have, or `/cex:build` on something you want changed. Every command takes plain English after it, and the three marked *(defaults to current changes)* work with no argument at all.

| Command | Reach for it when | Mode |
|---|---|---|
| `/cex:build` | You want a UI or journey created or changed, with complete states and verification | Build |
| `/cex:review` | You want code, a PR, a screenshot or a design critiqued *(defaults to current changes)* | Review |
| `/cex:explore` | The problem is open-ended and you want 2–3 real alternatives before anyone writes code | Explore |
| `/cex:optimize` | A funnel is leaking and you want ranked changes plus an experiment design | Optimize |
| `/cex:a11y` | You need the WCAG 2.2 Level AA release gate run *(defaults to current changes)* | Review |
| `/cex:rubric` | You want a scored verdict across the ten dimensions *(defaults to current changes)* | Review |
| `/cex:journey` | You want a journey mapped end-to-end against what the repo actually implements | Review |
| `/cex:modernize` | You suspect duplicated or declining styling systems. Reports only — never migrates without a yes | Review |

Plain `/customer-experience-excellence` works too, and infers the mode from your request.

**Good to know**
- It reads your repository before it writes — your tokens, components and `CLAUDE.md` stay the source of truth.
- WCAG 2.2 AA failures in changed scope are treated as release blockers, not suggestions.
- It reports what it actually ran and names what it could not verify. No claimed uplift without data.
- Customize it by editing the skill's `references/` files; upgrades (`npx customer-experience-excellence --force`) list your edits and ask before overwriting them.

---

After printing it: if `$ARGUMENTS` describes a task, add one final line naming the single command you would run for it and the argument you would pass. If `$ARGUMENTS` is empty, add nothing.

If you can locate the skill's `.cex-manifest.json` without searching the whole repository — check `.claude/skills/customer-experience-excellence/` and `~/.claude/skills/customer-experience-excellence/` — append the installed version as a final line. If it is not in either place, say nothing about the version rather than hunting for it.
