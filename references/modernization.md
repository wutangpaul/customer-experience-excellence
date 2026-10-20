# Modernization: legacy styling and system consolidation

Two related jobs, both driven by maintenance cost rather than taste:
1. **Decline** — a system that is dying, incompatible or measurably expensive. Triage below.
2. **Duplication** — several systems doing the same job in one codebase. See **System consolidation**, which is usually the larger and more neglected problem.

Use for `/cex:modernize`. Pair with `tailwind-ui-systems.md` for the target state.

**The rule: offer, never ambush.** A styling migration is never a side effect of a feature. Finish the task you were given, then report what you found and ask. If the user declines, write idiomatic code in whatever system is already there — a half-migrated file is worse than a consistent legacy one.

## Contents
A full `/cex:modernize` audit uses all of this. A passing mention during a build or review needs only **Triage**.
- **Triage** — Tier 1 (worth offering), Tier 2 (assess, do not assume), Tier 3 (leave alone).
- **Detection** — the commands that produce counts with file paths. Never report impressions.
- **System consolidation** — counting the systems and the cost, when it is worth proposing, when to leave it alone, the consolidation ladder, choosing the survivor, running it.
- **The offer** — how to ask, and what "done" means.
- **Migration playbook** — CSS-in-JS → Tailwind v4, replacing a component library, Tailwind v3 → v4, Bootstrap/jQuery in Liquid or ERB.

## Triage

### Tier 1 — worth offering to refactor
Real decline, real incompatibility or real customer cost.

| Found | Why it matters |
|---|---|
| **styled-components** | In maintenance mode since 2025 — critical fixes only. Leans on Context, so it fights React Server Components and streaming SSR, and it carries runtime style-injection cost. |
| **Emotion as a runtime styling layer** in an RSC/App Router app | Same class of problem: client boundaries, style registries and hydration overhead to do what static CSS does free. |
| **Material-UI v4, `makeStyles`, JSS** | Dead API on an unsupported major. |
| **Bootstrap 3/4 with jQuery plugins, Semantic UI, Foundation, Bulma** | Unmaintained or minimally maintained; jQuery-era widgets are usually the accessibility defects in a theme. |
| **Tailwind v3** | One major behind. This is an *upgrade* (`npx @tailwindcss/upgrade`), not a rewrite — much cheaper than the rows above. |
| **Unstructured global CSS/SCSS sprawl** | No tokens, deep nesting, `!important` chains, `@extend` cascades, hardcoded px and hex, duplicated media queries. Every new screen costs more than the last. |
| **Inline style objects for themable values** | Invisible to the design system, unreachable by dark mode, unauditable for contrast. |
| **Dead or barely-used vendored CSS** | A framework loaded for six classes. Usually the cheapest Core Web Vitals win in the repo. |

### Tier 2 — assess, do not assume
Actively maintained; migrating is a cost/benefit call, not a defect to report.
- **Current majors of the mainstream React component libraries** (MUI, Chakra, Mantine, Ant Design) — maintained and supported. Some carry an Emotion runtime and a heavy footprint, but that is a tradeoff their teams chose, not a defect. Raise them only with a measured performance problem, an RSC blocker, or a consolidation case — and then as *duplication*, not obsolescence.
- **CSS Modules** — fine, and coexists with Tailwind indefinitely.
- **vanilla-extract, Panda CSS, StyleX, Linaria** — zero-runtime and current. These are not legacy; do not offer to replace them with Tailwind on preference alone.
- **Modern plain CSS** using custom properties, `@layer`, nesting and container queries — that is good CSS. Leave it.

### Tier 3 — leave alone
Shopify checkout and vendor theme CSS you do not own, third-party widget styles, and anything outside the change's blast radius with no customer cost. Note it; do not touch it.

## Detection
Run these from the repo root and report counts with file paths, not impressions.

```bash
# Dependencies
grep -nE '"(styled-components|@emotion/[a-z]+|@chakra-ui/[a-z]+|@mui/[a-z]+|@material-ui/[a-z]+|bootstrap|bulma|foundation-sites|semantic-ui-react|antd|jss|react-jss)"' package.json

# Usage and blast radius
grep -rln "from 'styled-components'\|@emotion/styled\|@chakra-ui/react\|makeStyles\|createUseStyles" --include=*.{ts,tsx,js,jsx} .
grep -rl "styled\." --include=*.{ts,tsx} . | wc -l

# Tailwind generation
grep -rn "@tailwind base\|@import \"tailwindcss\"" --include=*.css .
grep -n '"tailwindcss"' package.json

# CSS health
grep -rc "!important" --include=*.{css,scss} . | grep -v ':0$'
grep -rln "class=\"[^\"]*\b\(col-md-\|btn-default\|navbar-toggle\|panel-body\)" --include=*.{liquid,erb,html} .
```

Also check: the CSS entry file, `components.json`, and whether a theme object (`ThemeProvider`, `theme.ts`, SCSS variables) already holds the tokens a migration would need.

For duplication, the numbers that matter are **how many systems exist, which surfaces each owns, and where they overlap**:

```bash
# Duplicate component kinds — the clearest consolidation signal
find . -path ./node_modules -prune -o -iname "*button*" -print
grep -rn "define\|export" --include=*.{css,scss} . | grep -iE "\.btn\b|--color-primary|--brand"

# Two systems reaching the same page
grep -rln "ThemeProvider\|data-theme\|@chakra-ui/react\|styled-components" --include=*.{ts,tsx,jsx} app src pages 2>/dev/null

# Specificity war — proxy for how long the split has gone unmanaged
grep -rc "!important" --include=*.{css,scss} . | grep -v ':0$' | sort -t: -k2 -rn | head
```

## System consolidation

Most repositories do not have *old* styling. They have **too many styling systems**, each individually defensible, accumulated through incremental adoption, an abandoned migration, a redesign, an acquisition or a pasted-in block. Nobody decided to have four; everyone inherited them. Finding and naming that is the highest-value thing this audit does.

### Count the systems, then count the cost
Two Buttons is not an aesthetic problem. It is a standing tax:

- **Shipped twice.** Two CSS runtimes, two resets, two theme payloads on pages that need one. Usually the largest removable byte cost in the repo.
- **Token drift.** The brand blue lives in three places and they have already diverged. A rebrand becomes archaeology, and nobody can say which value is correct.
- **Specificity war.** Systems fight in the cascade; the fix is `!important`, which compounds. Grep the `!important` count — it is a reliable proxy for how long the split has been unmanaged.
- **Inconsistent accessibility.** Each system has its own focus ring, dialog semantics, keyboard model and error pattern. The customer experiences one product with three behaviors, and the weakest one sets the real conformance level.
- **Ambiguity cost — the one seniors underrate.** Every developer and every future AI run has to decide *which system this file belongs to*. Wrong guesses add to the wrong system, which deepens the split. Ambiguity is self-reinforcing.
- **Multiplied upgrade treadmill.** Every system has its own majors, its own breaking changes, its own CVEs.
- **Half-migrations are the worst state of all.** You pay both costs and bank neither benefit. A codebase stalled mid-migration for a year is evidence against starting another one casually.

### When consolidation is worth proposing
- Two systems render the **same component kind** — two Buttons, two Modals, two form-field patterns — reachable in the same customer journey.
- Budgeted work is already touching it: a rebrand, a design-system refresh, a framework upgrade (RSC, a Rails major, OS 2.0), a replatform.
- Measured cost: CSS/JS bytes, a Core Web Vital regression, a page loading two theme runtimes.
- One of the systems is **Tier 1** — then consolidation and decline are the same project, which is the cheapest moment to do it.
- Accessibility defects trace to the inconsistency rather than to one component.
- The team repeatedly asks "which Button do I use?" — that question is the symptom; the ambiguity is the cost.

### When to leave it alone — and say so
Restraint is the senior judgment here. Do not propose consolidation when:
- **Nobody is changing that area.** A frozen admin surface or deprecated flow costs nothing to leave alone. Churn there is pure risk.
- **The boundary is already clean.** One marketing microsite, one embedded widget, one checkout extension with its own system and no per-page overlap is a *boundary*, not a split. Document it and move on.
- **There is no budget for verification.** Without visual regression, a11y re-testing and a measurement baseline, a migration trades a known cost for an unknown one.
- **It cannot be finished.** Only propose what can be sequenced to completion. If the honest answer is "we would get 60% through", recommend freezing instead.
- **The platforms genuinely differ.** A Liquid theme and a React app cannot share components. Consolidate their **tokens and interaction contracts**; accept separate implementations. Pretending otherwise produces a shared abstraction nobody can use.

### The consolidation ladder
Same ethos as the code ladder in `SKILL.md`: stop at the first rung that removes the actual pain. Most repos should stop at 2 or 3.

1. **Document the boundary.** Write down which system owns what and why. Costs nothing, kills the ambiguity, and is sometimes the entire fix.
2. **Freeze the loser.** A lint or CI rule banning new imports from the older system. Stops the bleeding immediately, is reversible, and needs no migration budget. **Propose this on day one even when the full migration never happens** — it is the highest ratio of benefit to risk available.
3. **Converge the tokens.** One source of truth for color, type, spacing, radius and motion, exposed as CSS variables both systems read. Delivers most of the brand-consistency and rebrand-cost win for a fraction of the effort, and is independently shippable.
4. **Converge one component kind.** Pick the duplicate that appears most often — usually Button or Input. One kind, all call sites, done. Proves the pattern and the verification process on something small.
5. **Converge a vertical slice.** One route or one journey end to end, so a customer-visible surface is internally consistent.
6. **Full migration and dependency deletion.** Only with a committed sequence.

### Choosing the survivor
Not the newest or the one you would pick greenfield. Weigh, and write down the reasoning:
- **Call-site count** — migrating 200 components into 30 is backwards.
- **Platform fit** — it has to work across the stacks that must share it, now and after the next framework upgrade.
- **Maintenance trajectory** — who maintains it, how active, what the next major looks like.
- **Behavior and accessibility already earned** — a system with tested focus management and keyboard semantics is worth more than its visual output.
- **Team fluency** — what the people maintaining it actually know.
- **Exit cost** — how hard it is to leave if this choice turns out wrong.

### Running the consolidation
1. **Inventory to a table** — system, routes/surfaces, component kinds, call-site count, owner.
2. **Name the survivor and the reasoning**, in a doc the next agent will find.
3. **Freeze the loser the same day.**
4. **Converge tokens before components**, every time.
5. **Define one seam.** The two systems meet at a boundary, never interleaved inside a single component. Interleaving is how migrations stall.
6. **Migrate by call-site frequency**, keeping each component's public prop API identical so call sites do not churn. Highest-risk customer journeys go last, after the pattern is proven.
7. **Deletion is the definition of done.** The saving is banked at the moment the dependency leaves the manifest and the dead CSS leaves the bundle — not when the last component is rewritten. If deletion is not in the plan, the plan is to pay for both systems forever.
8. **Report real numbers** — bytes before and after, components and tokens removed, duplicate count closed, Core Web Vitals, or an explicit note that they were not measured.

**Done means:** one Button, one dialog behavior, one token source per brand, the old dependency gone from the manifest, and a written record of which system owns what.

## The offer
Report, then ask. Never start without a yes.

1. **What and where** — the system, the file count, the import count, and the customer-facing surfaces it touches.
2. **Why it costs the customer** — evidence only: maintenance status, bundle bytes, blocked RSC/SSR, a measured Core Web Vital, duplicated systems on one page, or a specific accessibility defect. Never "it's old". If you cannot name a cost, it is Tier 2 or 3.
3. **Scope** — rough file count and a realistic sequence, including what *cannot* be migrated (vendor markup, checkout, third-party widgets).
4. **Incremental path** — the first slice, provable on its own.
5. **Risk and verification** — visual regression, a11y re-test, what you would measure before and after.
6. **Separate work** — its own branch and PR, never mixed into the feature diff.

For duplication, **offer the smallest rung of the consolidation ladder that removes the pain**, not the full migration. "Document the boundary and ban new imports from the old system" is a complete, valuable answer and costs an afternoon. Lead with that; present the full migration as the optional larger project behind it.

If the answer is no, record it in one line and move on. Do not re-offer every session.

## Migration playbook

### Runtime CSS-in-JS → Tailwind v4
1. **Inventory first.** Component count, shared theme object, how many components use dynamic style props, what lives in global styles.
2. **Port the theme, not the components.** Move the theme object's values into `@theme` tokens. Both systems can read the same CSS variables, so this step is safe on its own and unblocks everything after it.
3. **Coexist.** Tailwind and styled-components run side by side. There is no big-bang day.
4. **Convert leaves first.** Button, Badge, Input — prove the pattern, then move up to containers. **Keep each component's prop API identical** so call sites do not change; that keeps the diff minimal and the risk contained.
5. **Translate dynamic styles honestly.** `props => css` becomes `cva` variants for discrete states, or a CSS custom property for continuous values (`style={{ "--progress": pct }}` + `w-(--progress)`). Do not rebuild a runtime theming layer in Tailwind.
6. **Delete as you go.** The old file dies in the same commit as its replacement. Remove the dependency only when `grep` shows the last import is gone.
7. **Verify.** Screenshots before/after at mobile and desktop in both themes; re-check focus rings, contrast, reduced motion and keyboard paths; report bundle and CSS byte delta and LCP/INP/CLS with real numbers or say they were not measured.

### Replacing a component library
A component library swap is a **behavior** migration, not a styling one. Mainstream libraries ship focus management, portals, dismissal, typeahead, roving tabindex and ARIA that you must re-earn. Replace them with a primitive library (Base UI or Radix, via shadcn/ui), never with hand-rolled `div`s. Budget keyboard and screen-reader testing on every replaced component, and move one component family at a time.

### Tailwind v3 → v4
Run `npx @tailwindcss/upgrade` on a clean branch, then hand-review: the rename table in `tailwind-ui-systems.md`, `@apply` inside scoped style blocks (needs `@reference`), custom plugins and presets, the `ring`/`shadow`/`outline-none` changes, and browser-support requirements. Separate PR, visual diff, done.

### Bootstrap/jQuery in Liquid or ERB
Replace grid classes with Tailwind or native CSS grid; replace jQuery widgets with native `<dialog>`, `<details>`, `popover` and Turbo/Stimulus or small web components. This is usually an accessibility *improvement*, so test keyboard and screen-reader behavior on each replaced widget. Remove the vendored asset only after confirming no section, snippet or layout still references it.
