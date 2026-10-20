# Tailwind CSS and component systems

Read this before styling anything or choosing a component library. Apply it with the **Code standards** in `SKILL.md`: walk the minimal-code ladder first — the cheapest component is the one already in the repo, and the cheapest style is a token that already exists.

## Contents
Read only what the task needs.
- **Version discipline** — detect the installed generation first. Read this always.
- **Tailwind v4 essentials** — CSS-first configuration, what changed from v3 (catch these in review), utilities that remove JS, authoring discipline, Tailwind and accessibility.
- **Choosing a component system** — the decision, and which libraries are React-only.
- **shadcn/ui · Base UI · Radix Primitives · Wensity · daisyUI** — one section each. Read only the one the repo uses, or the ones you are choosing between.
- **Other systems you may meet**.
- **Tailwind per stack** — React, Rails and Liquid specifics.

## Version discipline
- **Detect before you write.** Check `package.json`, `Gemfile`, the theme's `package.json`, and the main CSS entry file. Tailwind v4 announces itself with `@import "tailwindcss"`; v3 with `@tailwind base; @tailwind components; @tailwind utilities;` and a `tailwind.config.js`.
- **Default to the latest major on greenfield work.** As of October 2026 that is the **Tailwind v4.3 line** — verify the actual current release rather than trusting this number.
- **Never mix generations.** Do not add `tailwind.config.js` theme keys to a v4 project, and do not write `@theme` into a v3 project. If a repo is on v3 and the task does not call for migration, write idiomatic v3 and mention `npx @tailwindcss/upgrade` as separate work — do not smuggle a migration into a feature diff.
- Same rule for every library below: read the installed version, match its API, and say so if the repo is far enough behind that the task is affected.

## Tailwind v4 essentials

### CSS-first configuration
There is no JS config. Theme, plugins, content sources and custom utilities live in CSS.

```css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.62 0.17 258);
  --font-display: "Söhne", ui-sans-serif, system-ui, sans-serif;
  --radius-card: 0.75rem;
  --breakpoint-3xl: 120rem;
}

@custom-variant dark (&:where(.dark, .dark *));
@source "../app/views/**/*.erb";
@utility text-balance-pretty { text-wrap: pretty; }
```

- Every `@theme` entry becomes both a utility and a real CSS variable (`var(--color-brand-500)`), so Liquid, ERB, canvas, charts and inline styles can read the same token. This is why theme tokens beat arbitrary values.
- Namespaces drive generation: `--color-*`, `--font-*`, `--text-*`, `--spacing`, `--radius-*`, `--shadow-*`, `--breakpoint-*`, `--container-*`, `--ease-*`, `--animate-*`. `--color-*: initial` clears the defaults when a brand needs a closed palette.
- `@theme inline` when a token's value references another variable that changes at runtime (the pattern shadcn/ui uses for light/dark).
- `@plugin "pkg"` for JS plugins, `@config "./tailwind.config.js"` only as a v3 bridge, `@reference "../app.css"` in scoped `<style>` blocks (Vue/Svelte SFCs) so `@apply` resolves without duplicating output.
- Source detection is automatic from the CSS file's location, honouring `.gitignore`. Add non-obvious template roots with `@source`, exclude with `@source not`, and keep dynamic class names alive with `@source inline("bg-brand-500 bg-brand-600")` — never with a regex-defeating string concat in the template.

### What changed from v3 — catch these in review
| v3 | v4 |
|---|---|
| `bg-gradient-to-r` | `bg-linear-to-r` (also `bg-radial`, `bg-conic`) |
| `shadow-sm` / `shadow` | `shadow-xs` / `shadow-sm` (same for `rounded-*`, `blur-*`, `drop-shadow-*`) |
| `outline-none` | `outline-hidden` (`outline-none` now really removes the outline) |
| `ring` (3px) | `ring` is 1px; use `ring-3` for the old look |
| `bg-opacity-50`, `text-opacity-*` | `bg-black/50`, `text-white/70` |
| `flex-shrink-0`, `flex-grow` | `shrink-0`, `grow` |
| `!font-bold` | `font-bold!` |
| `tw-` class prefix | `tw:flex` variant-style prefix |
| `@tailwindcss/container-queries` | built in: `@container`, `@sm:`, `@max-md:` |

Also: borders/dividers default to `currentColor`, space-between uses a different selector, `hover:` is gated behind `(hover: hover)`, and v4 targets Safari 16.4+/Chrome 111+/Firefox 128+. If the brief requires older browsers, say so before adopting v4.

### Utilities worth knowing (they remove JS)
- **Container queries** — `@container` + `@md:grid-cols-2` makes a card responsive to its slot, not the viewport. This is the right tool for PDP cards, cart line items and Liquid sections dropped into arbitrary columns.
- **`starting:`** with `transition-discrete` for enter animations on `[popover]` and `<dialog>` — no animation library.
- **`not-*`, `in-*`, `nth-*`, `has-*`, `group-has-*`, `peer-*`** — express state in CSS instead of recomputing class strings in JS or Liquid.
- **`field-sizing-content`**, **`scheme-light dark`**, **`inert`**, **`details-content`**, **`pointer-coarse` / `any-pointer-coarse`** for touch ergonomics, **`safe` alignment** for overflowing flex rows.
- `text-shadow-*`, `mask-*`, 3D transforms (`rotate-x-*`, `perspective-*`), `@starting-style`, and `--animate-*` theme entries for named keyframes.

### Authoring discipline
- **Tokens first, arbitrary values last.** `bg-brand-500` > `bg-[oklch(0.62_0.17_258)]`. One-off arbitrary values are a signal the design system is missing a token — add the token or flag the gap.
- **Avoid `@apply`.** It rebuilds the abstraction Tailwind removed and hides specificity. Extract a component (React/ViewComponent/Liquid snippet) instead. The narrow exception is third-party markup you cannot add classes to.
- **Compose, do not concatenate.** Merge classes with `cn()` (`clsx` + `tailwind-merge`) so caller overrides actually win; express variants with `cva` or `tailwind-variants` rather than nested ternaries.
- **Never build class names dynamically.** `text-${color}-500` is invisible to the scanner. Map to complete literal strings.
- **Order is irrelevant to the cascade but relevant to humans** — run the repo's Prettier Tailwind plugin if present.
- **Keep class lists honest.** If a single element carries thirty utilities, the component boundary is wrong.

```tsx
// Minimal, token-driven, override-friendly.
const button = cva("inline-flex items-center justify-center rounded-card font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    intent: { primary: "bg-brand-500 text-white hover:bg-brand-600", quiet: "text-brand-600 hover:bg-brand-50" },
    size: { sm: "h-9 px-3 text-sm", md: "h-11 px-5" },
  },
  defaultVariants: { intent: "primary", size: "md" },
});
```

### Tailwind and accessibility
- `outline-hidden` keeps a visible outline in forced-colors mode; `outline-none` does not. Never ship a focus style removal without a `focus-visible:` replacement.
- Use `sr-only` / `not-sr-only` for accessible names, never `hidden` or `opacity-0` for content screen readers must reach.
- Honour `motion-safe:` / `motion-reduce:` on every transform, parallax and auto-playing transition.
- Check contrast on the rendered oklch value, not the swatch name — `*-400` text on white usually fails AA.
- `dark:` must be a real theme with checked contrast, not an inverted palette.

## Choosing a component system

| Need | Reach for |
|---|---|
| React app, want owned source and a design system you control | **shadcn/ui** (Base UI or Radix underneath) |
| React app, need unstyled accessible behavior only | **Base UI** (new work) or **Radix Primitives** (existing) |
| React marketing/SaaS surfaces needing motion-rich blocks | **Wensity** (installs through the shadcn CLI) |
| Rails/ERB, Liquid, or any non-React template that needs components fast | **daisyUI** (also Flowbite, Preline — class-based, no React) |
| Already has a system in the repo | That one. Do not introduce a second. |

**The hard constraint:** shadcn/ui, Base UI, Radix and Wensity are **React libraries**. They cannot run in a Shopify Liquid theme or a Hotwire-only Rails app. Proposing them there is an architecture error, not a style preference. In those stacks use daisyUI/Flowbite/Preline classes, native elements, and Tailwind utilities.

## shadcn/ui
Not a dependency — a registry that copies typed source into your repo, which you then own and edit.

- `components.json` is the contract: style, `rsc`, `tsx`, `tailwind.css` path, `baseColor`, and the `aliases` map. Read it before adding anything.
- `npx shadcn@latest add button dialog` writes into `components/ui/`. **Re-adding overwrites local edits** — check `git status` before and after, and never run it blind over customized files.
- **New projects default to Base UI** (since July 2026); Radix remains fully supported and components ship for both. Confirm which one the repo is on before writing primitive code — `asChild` vs `render`, and the presence of `Positioner` parts, are the quick tells.
- Theming is CSS variables under `@theme inline` in oklch: `--background`, `--foreground`, `--primary`, `--muted`, `--destructive`, `--ring`, `--radius`. Restyle by changing those tokens, not by patching every component.
- Components expose `data-slot` attributes — target them for brand overrides instead of forking the file.
- Install from any registry, including namespaced ones (`@acme/button`), and publish your own with a `registry.json` + `shadcn build`. For a multi-brand org, a private registry is how you keep one real design system instead of five drifting copies.
- Treat the generated file as a first draft: delete variants the product does not use, and keep the `cn()` escape hatch intact.

## Base UI
`@base-ui-components/react` — unstyled, accessible primitives from the Radix/MUI/Floating UI lineage; v1 stable since December 2025.

- Parts-based anatomy, more explicit than Radix: `Menu.Root → Trigger → Portal → Positioner → Popup → Item`. The separate `Positioner` is where anchoring, side, align and collision props live.
- **`render` prop instead of `asChild`**: `<Menu.Trigger render={<Button />} />`, or a function for merged props. `useRender` builds the same behavior into your own components.
- State is exposed as `data-*` attributes (`data-open`, `data-disabled`, `data-highlighted`) and CSS variables (`--available-height`, `--anchor-width`, `--positioner-side`) — style entirely in Tailwind, no JS state mirroring.
- Animation without a library: `data-starting-style` / `data-ending-style` pair with `transition-discrete` and `starting:`; unmounting waits for the transition.
- Behavioral defaults differ from Radix and are easy to miss in a migration: manual tab activation, nullable `Select` values, menu dismissal semantics. When porting, test keyboard flows rather than assuming parity.

## Radix Primitives
Still the right call in repos already built on it; updates continue.

- `asChild` + `Slot` to merge behavior onto your own element — the child must forward refs and spread props, or the trigger silently breaks.
- Controlled/uncontrolled pairs (`open`/`defaultOpen`), `onOpenChange` for analytics, `forceMount` + `data-state="open|closed"` for exit animations.
- Portals escape overflow containers — but check stacking against sticky headers and Shopify's own overlays.
- Accessibility is the point: focus trap and restore, dismissal, typeahead, roving tabindex and `aria-*` come free. Do not reimplement them, and do not break them with stray `tabIndex`, `onKeyDown` interception or an extra wrapper element inside a trigger.
- Radix gives you behavior only; all visuals are your Tailwind tokens.

## Wensity
A public shadcn-compatible registry of animated React components, UI primitives and page blocks for Next.js and Tailwind v4 (MIT, installed through the shadcn CLI, source lands in your repo with no runtime dependency).

- Requires React 18+, Tailwind v4 and an initialized shadcn project. Install individual components by registry URL rather than vendoring the whole library.
- It is motion-first, which makes it useful for hero sections, feature storytelling and AI-style interfaces — and a liability on transactional screens. Keep animation off the path to add-to-cart, checkout, booking confirmation and form completion.
- Non-negotiables when using it: `motion-reduce:` or a `prefers-reduced-motion` guard on every effect, no layout shift on the LCP element, lazy-load heavy below-fold pieces, and confirm keyboard/focus behavior on anything interactive — a visually impressive block still has to pass the WCAG 2.2 AA gate.
- Edit the copied source down to what the page needs. These components ship with generous knobs; the minimal-code ladder says delete the ones with no caller.

## daisyUI
A Tailwind plugin of semantic component classes — no JavaScript, no React, works anywhere HTML is rendered. The practical choice for Rails/ERB and Shopify Liquid.

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}
@plugin "daisyui/theme" {
  name: "brand";
  --color-primary: oklch(0.62 0.17 258);
  --radius-box: 0.75rem;
}
```

- v5 is Tailwind v4-native via `@plugin` — no JS config, zero dependencies. Themes are CSS variables switched by `data-theme`, which makes multi-brand and dark mode genuinely cheap.
- Class names are semantic (`btn btn-primary`, `card`, `modal`, `join`, `drawer`) and compose with plain Tailwind utilities for overrides.
- **Accessibility is your job.** daisyUI styles whatever element you give it. Use `<button>`, `<dialog>` (with `showModal()`), real `<label for>`, and real ARIA — a `div.btn` is a defect. Audit any pattern that relies on hidden checkboxes or `tabindex` for open/close state, and provide keyboard dismissal and focus return yourself.
- Expect a recognizable look out of the box. For brand-led commerce work, define a custom theme and override component classes rather than shipping default daisyUI styling.

## Other systems you may meet
**Headless UI** (Tailwind Labs, React/Vue, pairs naturally with Tailwind), **Catalyst** (Tailwind's own paid React kit, source you own), **Ark UI / Park UI** (framework-agnostic state machines), **HeroUI**, **Mantine**, **Chakra** (opinionated, own styling engines — do not bolt onto a Tailwind design system without a reason), **Flowbite / Preline** (class-based, good for Rails and Liquid), and companions **Vaul**, **Sonner**, **cmdk**, **Embla**, **Recharts**. Identify what the repo already has before suggesting any of them.

## Tailwind per stack
- **React/headless:** keep the CSS entry single-sourced; prefer container queries over prop-driven breakpoints; let the design-system component own its classes rather than passing long `className` strings from pages.
- **Rails:** `tailwindcss-rails` (standalone binary, `bin/rails tailwindcss:watch`) or `cssbundling-rails`. Point `@source` at `app/views/**/*.erb`, `app/components/**/*.{rb,erb}` and `app/helpers`, and remember class names built in Ruby helpers are invisible to the scanner — map them to literals or use `@source inline(...)`. ViewComponent + `cva`-style Ruby variant hashes keep markup legible.
- **Shopify Liquid:** build with the Tailwind CLI into `assets/`, `@source "../**/*.liquid"` plus any JS that injects classes, and commit the built CSS the theme ships. Section schema settings that drive styling must map to a fixed set of literal classes, never interpolated ones. Watch the theme's existing `base.css`/vendor CSS for cascade conflicts, and keep the critical path small — a utility sheet is cheap only if it is actually purged.
