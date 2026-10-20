# Stack craft: React, Rails, Shopify Liquid

Read the section for the repository's actual stack. Apply it with the **Code standards** in `SKILL.md`: smallest honest change, reuse first, no speculative abstraction, legible to the next agent. Verify the repo's version, conventions and existing patterns before applying anything here — this file describes good practice, not permission to ignore local idiom.

## Contents
- **Shared expectations** — applies to every stack. Read this always.
- **React / headless storefronts** · **Ruby on Rails** · **Shopify Liquid themes** — read only the repository's own stack.
- **Review lens for each stack** — the defects worth catching in review.

## Shared expectations
- Match the existing routing, data-loading, state, styling, testing and error-handling patterns already in the repository.
- Semantic HTML and native controls first in every stack; custom widgets only when a native element genuinely cannot do the job.
- Keep server/client, template/behavior and data/presentation boundaries where the framework puts them.
- Render real states: loading, empty, error, validation, unavailable, success. No state is "handled later".
- Instrument deliberately: one meaningful event per customer decision point, using the repo's existing analytics contract.

## React / headless storefronts
**Composition**
- Server Components or server loaders for data; client components only where interaction, browser APIs or state demand it. Keep `"use client"` at the leaf, not the page.
- Keep components small and single-purpose; lift state only as far as the nearest common ancestor that needs it. Prefer URL state (search params) for filters, sort, pagination and selected variants so views are shareable and restorable.
- Derive values during render instead of mirroring them into state. `useEffect` is for synchronizing with external systems — not for computing data, not for fetching that the framework can do on the server.
- Use the repo's existing primitives (design system components, `cva`/variant helpers, form library, query/mutation layer) before adding a new pattern.

**Data and performance**
- Fetch where the framework intends (server loader / route loader / server action). Avoid client waterfalls; co-locate queries with the component that needs them.
- Use suspense boundaries and skeletons that match final layout dimensions to protect CLS. Reserve space for images and media; set `width`/`height` or aspect ratio.
- Ship less JS: dynamic-import heavy, below-the-fold or rarely used widgets; avoid large date/i18n/animation libraries when a platform API or existing dependency suffices.
- Memoize only with evidence of a real cost. `useMemo`/`useCallback`/`memo` applied by reflex is noise.
- Keys are stable domain ids, never array indexes for reorderable lists.

**Forms, a11y and correctness**
- Progressive enhancement where the framework supports it (server actions / form posts that work before hydration). Disable submit only while pending, and keep an accessible pending state.
- Associate labels, describe errors with `aria-describedby`, move focus to the first invalid field, announce async status with a live region.
- Controlled vs uncontrolled chosen deliberately and consistently; never flip between them.
- Type props and data at the boundary (API response → parsed/typed shape). No `any` into customer-facing logic.
- Clean up subscriptions, listeners and timers; guard against setting state after unmount in long operations.

**Testing**
- Test customer behavior through accessible queries (role/name/label), not implementation details or snapshot blobs.

## Ruby on Rails
**Architecture**
- Fat models/POROs, thin controllers, logic-free views. A controller action is a few lines: load, authorize, respond.
- Keep view logic in helpers, presenters or ViewComponents — whichever the repo already uses. Do not introduce a second pattern alongside an existing one.
- Use concerns, service objects or form objects only where the repo already does; prefer a plain model method or a small PORO otherwise.
- Strong parameters always; authorize in the layer the app already uses (Pundit/CanCan/explicit scopes), never only in the view.

**Views and Hotwire**
- Prefer server-rendered HTML with Turbo Drive/Frames/Streams over hand-written JavaScript. Reach for Stimulus for small, documented behavior; reach for a JS framework only if the repo already includes one.
- Turbo Frames for scoped updates (filters, pagination, inline edit); Turbo Streams for out-of-band changes (cart badge, flash, list insert). Give frames and stream targets stable, meaningful DOM ids.
- Ensure every Turbo-driven interaction still works as a plain request: real links and forms, correct HTTP verbs, redirects after mutations. Never make a button the only path to a navigable resource.
- Stimulus controllers are small and declarative: targets, values and actions in the markup; no DOM spelunking, no global state, teardown in `disconnect()`.
- Partials for reuse with explicit locals (`render "cart/line_item", line_item:`); avoid implicit instance-variable dependencies inside partials.
- Use `form_with` and Rails form builders so names, ids, labels, CSRF and error markup stay consistent and accessible. Render `ActiveModel` errors next to their fields.

**Data and performance**
- Eliminate N+1 with `includes`/`preload`/`eager_load`; verify with logs or the repo's query-count tooling instead of guessing.
- Scope and paginate collection queries; push filtering into the database, not Ruby.
- Use fragment/Russian-doll caching with cache keys derived from `updated_at` and touch associations deliberately. Cache only after the query work is correct.
- Money as integer cents or `BigDecimal` — never floats. Use `Time.current`/`Time.zone` and store UTC; render in the customer's zone.
- Background jobs for email, webhooks, third-party calls and anything slow; make jobs idempotent and retry-safe.
- Validations in the model **and** constraints/indexes in the database for anything that must hold (uniqueness, foreign keys, not-null).
- Migrations are reversible and safe on a populated table (add column nullable → backfill in batches → add constraint). Flag any lock-heavy migration before running it.

**Testing**
- Model/unit tests for logic, request tests for routes, params, authorization and redirects, system tests for the customer path including Turbo behavior. Use the repo's existing fixtures/factories.

## Shopify Liquid themes
**Theme architecture**
- Build with sections, blocks and section schema so merchants can configure without code. Online Store 2.0: JSON templates, section groups, app blocks; use `{% content_for 'blocks' %}` style composition where the theme already does.
- Every customer-visible string and setting belongs in schema settings or locale files — never hardcoded copy. Use `{{ 'namespace.key' | t }}` and keep `locales/*.json` and `*.schema.json` in sync.
- Snippets for reuse with explicit `{% render %}` arguments (isolated scope). Do not use `{% include %}`.
- Respect theme editor behavior: unique block ids, `shopify_attributes` on blocks, and `section`/`block` select/deselect events for JS so editing does not break the preview.
- Use metafields and metaobjects for structured content instead of parsing strings out of descriptions or tags. Reference them with their real definitions; never invent a namespace.

**Liquid discipline**
- Liquid renders; it does not compute. Keep loops shallow, assign intermediate values, and avoid nested loops over large collections (`all_products` lookups, repeated `collection.products` scans).
- Paginate collections and search results; never render an unbounded loop.
- Always filter images through `image_url: width:` with `image_tag`/`srcset`, explicit `width`/`height`, `loading="lazy"` below the fold, and `fetchpriority="high"` for the LCP image only.
- Money through `money` / `money_with_currency` filters so Markets and currency formatting stay correct. Never format prices by hand or hardcode a currency symbol.
- Guard every optional object (`{% if product.selected_or_first_available_variant %}`) — unpublished products, sold-out variants, empty carts and missing metafields are normal states.
- Escape or deliberately pass through untrusted output; use filters rather than building HTML strings.

**Behavior and performance**
- Progressive enhancement: variant pickers, quantity, filters, cart and search must work as real forms (`/cart/add`, `/cart/change`, faceted filtering via `form` + query params) before JS. Enhance with the Cart AJAX API or Section Rendering API for in-place updates.
- Keep JavaScript small and native — web components / ES modules, defer scripts, no framework added to a Liquid theme, no jQuery revival.
- Minimize render-blocking CSS, avoid per-section stylesheet sprawl, and preload only genuine critical assets. Watch Lighthouse/Web Vitals in the theme's own tooling.
- Respect checkout boundaries: checkout is Shopify's. Customize via Checkout UI extensions / Shopify Functions where the plan allows — never claim theme code can alter checkout behavior.
- Selling plans (subscriptions), discounts, taxes, shipping and inventory come from the platform or an installed app. Verify what the store actually has before promising behavior; disclose billing terms from real selling-plan data.
- Keep compatibility with Markets, localization (`country`/`language` form), customer accounts, and the theme's existing settings schema. Test in the theme editor, not just the storefront.

## Review lens for each stack
When reviewing, cite the file and line and name the stack-specific defect: client-side waterfalls or needless `useEffect` fetching (React), N+1 queries or logic in views (Rails), unpaginated loops, hardcoded strings or JS-only cart actions (Liquid) — alongside the customer consequence.
