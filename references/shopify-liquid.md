# Shopify Liquid themes: platform model

Read this before building or reviewing a Shopify theme (non-headless Online Store). `references/stack-craft.md` covers Liquid *discipline* — how to write it well. This file covers the *platform contract*: what Shopify owns, what the theme owns, and where a feature silently disappears if the theme breaks its side of the deal. Apply both with the **Code standards** in `SKILL.md`.

Headless/Hydrogen storefronts do not use any of this. Verify which you are in before applying it.

## Contents
Read only what the task needs.
- **The contract** — what Shopify owns vs the theme. Read first, always.
- **Two planes: code and configuration** — `templates/*.json`, section groups, `settings_data.json`, merchant data.
- **`{% schema %}` is the theme editor API** — settings, presets, what a merchant can add.
- **Theme blocks** — reusable blocks, `@theme`, `@app`, nesting.
- **Theme editor runtime** — editor JavaScript events, the live-preview trap.
- **Section Rendering and Ajax** — Section Rendering API, bundled cart rendering.
- **The app boundary** — theme app extensions, app blocks, app embeds.
- **Theme features: the opt-in catalogue** — variants, discounts, subscriptions, installments, wallets, B2B, Markets, filtering, hCaptcha. Check before claiming a feature works.
- **Limits that shape architecture** — platform ceilings.
- **Performance, in priority order**.
- **Review lens** — defects worth catching in a theme review.

## The contract

A theme is a server-rendered view layer whose runtime Shopify owns. You do not control routing, data loading, or checkout. Shopify resolves the URL to a page type, loads the resource, selects your template, and streams HTML.

```
URL → request.page_type → templates/<type>[.suffix].{json|liquid}
         ↓ (JSON template may declare `layout`; default is theme.liquid)
layout/theme.liquid
  <head> … {{ content_for_header }}   ← Shopify injects hCaptcha, hreflang,
  <body> … {% sections 'header-group' %}  analytics, app scripts, Shop Pay
           {{ content_for_layout }}   ← the template's sections, in `order`
           {% sections 'footer-group' %}
```

- `content_for_header` and `content_for_layout` are **required** in `theme.liquid`; the file cannot be saved without them. Never parse, modify or cache `content_for_header` — its contents change and platform features ride on it.
- `content_for_header` is also the streaming boundary. Everything above it reaches the browser before your sections render, so first-paint CSS, fonts and critical scripts belong above it.
- Liquid is deliberately not a programming language: no parentheses in conditions, no ternary, `for` capped at 50 iterations (use `{% paginate %}`), `{% render %}` is an isolated scope. Treat computation as a smell, not a challenge.
- Checkout is Shopify's. Theme code cannot change it. `checkout.liquid` is Plus-only and legacy; customization goes through Checkout UI extensions and Functions.

## Two planes: code and configuration

The most important structural fact about themes. Get this wrong and you will fight the merchant for control of their own store.

| Plane | Files | Authored by | In git |
| - | - | - | - |
| **Code** | `layout/`, `sections/*.liquid`, `blocks/*.liquid`, `snippets/`, `assets/`, `locales/`, `config/settings_schema.json` | developer | yes |
| **Data** | `templates/*.json`, `sections/*-group.json`, `config/settings_data.json` | **merchant, via the theme editor** | yes — and Shopify writes to it |

- The theme editor is a JSON writer. Dragging a section rewrites `templates/index.json`; changing a colour rewrites `settings_data.json`.
- **With the GitHub integration connected, Shopify commits merchant edits back to your branch.** This cannot be disabled. Edits within ~10s batch into one commit attributed to the last saver. Plan branches, reviews and `.gitignore` around a repository that writes to itself.
- Data files (`templates/*.json`, section groups, `settings_data.json`, `locales/*.json`) do not preserve comments or trailing commas. Schema tags and `settings_schema.json` do.
- Never author or edit `custom_css` — it is a platform-controlled setting Shopify exposes at theme and section level, stored in `platform_customizations` or the section's data. Offer real settings instead.

## `{% schema %}` is the theme editor API

One schema tag per file, valid JSON, never nested inside another Liquid tag, never renders its contents. Setting IDs must be unique within their section or block.

**Section schema:** `name` (≤25 chars), `tag` (`article`/`aside`/`div`/`footer`/`header`/`section`), `class`, `limit` (1–2), `settings`, `blocks`, `max_blocks` (≤50), `presets`, `default`, `locales`, and `enabled_on`/`disabled_on` — mutually exclusive, keyed on `templates` (page types or `["*"]`) and `groups` (`header`, `footer`, `aside`, `custom.<name>`). These replaced the old `templates` attribute; do not write `templates` at the top level.

**The preset rule is load-bearing.** A section or block with no `presets` cannot be added by a merchant in the editor — it can only be hand-placed in JSON, and then it cannot be removed. That is the mechanism for pinning `main-product` while leaving everything else movable. Use `default` (not `presets`) for statically rendered sections.

**Settings.** Seven basic types (`checkbox`, `number`, `radio`, `range`, `select`, `text`, `textarea`) and roughly twenty-seven specialized ones. The specialized types are where Shopify's data model surfaces in the editor: `product`, `collection`, `blog`, `article`, `page`, `metaobject`, the `*_list` variants, `color` / `color_background` / `color_palette` / `color_scheme` / `color_scheme_group`, `font_picker`, `image_picker`, `video`, `video_url`, `link_list`, `richtext` / `inline_richtext`, `html`, `liquid`, `url`, `text_alignment`.

- Modern resource settings return **the object**, not a handle. `settings.product.title` works; `all_products[settings.product]` is the legacy form — do not write it in new code.
- Guard every resource setting with `!= blank`. Unselected, deleted and hidden resources are normal states.
- `visible_if: "{{ block.settings.layout == 'flex' }}"` conditionally shows a setting. It can test whether a dynamic source is *set*, never what it *resolves to*.
- `color_palette` is one-per-theme, `settings_schema.json` only, 2–20 colours, and supports only `id` + `default`. `color_scheme_group` is also `settings_schema.json` only; its `role` map drives the preview swatches merchants see everywhere a scheme is picked.
- `liquid` settings are capped at 50 KB and cannot access `settings`, `section`, `schema`, `javascript`, `stylesheet`, `layout` or the `content_for_*` objects. Their values are not translatable in Translate & Adapt — which makes them the right place for language-neutral values and the wrong place for copy.
- Editor block titles auto-derive from a setting with id `heading`, then `title`, then `text`, falling back to the block `name`. Name the setting accordingly rather than fighting it.

**Dynamic sources** bind a setting to a resource attribute, metafield or metaobject field, chosen by the merchant. Availability is contextual: the template's resource, the nearest typed setting in scope, and globally visible metaobjects. Limits are 100 per JSON template / section group / theme settings, and 50 per single setting. This is how a theme supports merchant-defined structured content without the theme knowing the namespace — build blocks *for* metafields rather than hardcoding one store's definitions.

## Theme blocks

Files in `/blocks/` that nest, as distinct from section-local blocks declared inline in a section's schema. Prefer theme blocks in new work.

- `{% content_for 'blocks' %}` renders children in merchant order. `{% content_for 'block', type: 'slide', id: 'slide-1' %}` renders one statically, and may take arbitrary extra arguments the block reads by name.
- `"blocks": [{"type": "@theme"}, {"type": "@app"}]` accepts all theme blocks and all app blocks. Naming a file `_slide.liquid` makes it **private**: excluded from `@theme`, referenced only by explicit type.
- A theme block appears in the picker only if it defines `presets`, and a block with presets is available everywhere unless made private or explicitly targeted.
- Listing `{"type": "@theme"}` alongside specific types promotes those types to the top of the picker without hiding the rest.
- Nesting depth is 8 levels, excluding the section.

| Static block | Dynamic block |
| - | - |
| cannot be reordered, removed or duplicated | can be reordered, removed, duplicated |
| can be rendered conditionally or in a loop | cannot |
| does not count toward `max_blocks` | counts |
| persisted with `"static": true`, absent from `block_order` | listed in `block_order` |

`"tag": null` renders a block with no wrapper. When you use it, the block must have a single top-level element and **you** must put `{{ block.shopify_attributes }}` on it, or the editor cannot move the block without orphaning markup. Shopify adds that attribute for you only when it renders the wrapper.

Never branch on a literal `block.id`. IDs are generated and change.

## Theme editor runtime

Editor edits re-render HTML into the live DOM. Page-load JavaScript does not run again. A theme that ignores this breaks the moment a merchant opens the editor.

- Handle `shopify:section:load` / `unload` / `select` / `deselect` / `reorder` and `shopify:block:select` / `deselect`. On `load`, re-initialise as if the page had just loaded; on `unload`, tear down listeners and timers. On `select`, keep the section or block in view and visible for as long as it is selected.
- `shopify:inspector:activate` / `deactivate` fire for the preview inspector.
- Detect the editor with `request.design_mode` (Liquid) or `Shopify.designMode` (JS); the preset thumbnail renderer with `request.visual_preview_mode` / `Shopify.visualPreviewMode`; the inspector with `Shopify.inspectMode`. Use these to adjust behaviour — suppressing tracking, expanding an accordion for a preset thumbnail — **never** to change what the customer sees. Editor preview must match the live storefront.
- **Live preview trap.** Colour and text settings update without a refresh only when referenced raw inside `{% style %}`. The editor substitutes a CSS variable, so any inline filter (`| replace`, `| default`) operates on the variable string and silently breaks both the preview and parity with the storefront. Assign to a variable *outside* the `{% style %}` block, then reference the variable. Colours referenced from `assets/*.css` never live-preview — declare custom properties in `theme.liquid` and consume them in CSS.
- Liquid is not evaluated inside `{% stylesheet %}` or `{% javascript %}`. Pass values in via CSS custom properties on the element, or a class for multi-property changes.

## Section Rendering and Ajax

Progressive enhancement first: variant pickers, quantity, filters, cart and search must work as real forms before JavaScript. Then enhance.

- **Section Rendering API** — `?sections=a,b,c` (max 5, JSON response; sections that fail return `null` inside a 200, so handle it) or `?section_id=x` (raw HTML, 404 on miss). The section renders in the Liquid context of the requested URL, so `/products/<handle>?sections=…` gets that product. Setting values cannot be passed. IDs are `template--1234__name` / `sections--1234__header`, or the filename for a static section.
- **Bundled section rendering** — `/cart/add`, `/change`, `/update` and `/clear` accept a `sections` parameter and return re-rendered markup in the same round trip. Use it for cart drawers instead of a second request.
- **Ajax API** is unauthenticated, has no customer or order access, and caps product JSON at 250 variants. Anything beyond that belongs in an app.
- **Never hardcode a path.** Use `routes.*` in Liquid and `window.Shopify.routes.root` in JavaScript. A hardcoded `/cart` drops Markets visitors back to domain defaults with the wrong language and currency.

## The app boundary

Apps no longer edit theme code. They ship theme app extensions — versioned, CDN-served, removed cleanly on uninstall.

- `"target": "section"` is an **app block**: merchant-placed inside any section or theme block that declares `{"type": "@app"}` and renders `{% content_for 'blocks' %}` (or `{% render block %}` inside a legacy `section.blocks` loop). Requires JSON templates.
- `"target": "head" | "body" | "compliance_head"` is an **app embed block**: works on vintage themes, off until the merchant enables it in Theme settings → App embeds.
- Support `@app` in sections with a real case for third-party content — product information, cart — and refuse it where an unexpected block would break the layout. Say which, and why, in review.
- Top-level app blocks get wrapped by your `sections/apps.liquid`, else your `sections/_blocks.liquid`, else a platform-generated fallback. If you supply `apps.liquid` it must accept `@app` and define a preset, and must not use `templates` or `enabled_on.templates`.
- Extensions cannot see `content_for_header` / `content_for_layout`, cannot render on checkout pages, and get only `section.id` from the parent section.

## Theme features: the opt-in catalogue

Treat Shopify's **Theme features** docs as the list of platform capabilities that exist in the merchant's admin but **do not appear on the storefront unless the theme renders them**. None of this is automatic. Theme Store submissions are required to implement a defined subset. When a merchant reports "the app/feature isn't working", check this contract before debugging anything else.

| Capability | The theme's obligation | Contract |
| - | - | - |
| Variants | option selectors; media and price follow selection | `product.options_with_values`, `selected_or_first_available_variant`, `?variant=` and `?option_values=` deep links, `<input name="id">` |
| Media | images, video, external video, 3D | branch on `media_type` → `image_tag` / `video_tag` / `external_video_tag` / `model_viewer_tag` |
| Recommendations | related and complementary | `recommendations` object, async fetch of `routes.product_recommendations_url` with `section_id` + `intent`; keep the API's URL format or conversion attribution breaks |
| Gift cards | recipient form | line-item properties incl. `__shopify_send_gift_card_to_recipient`; Add to cart only, not accelerated checkout |
| Discounts | strikethrough plus itemised discounts | `line_item.original_price` vs `final_price`, `line_level_discount_allocations`, `cart.cart_level_discount_applications` (codes apply at checkout, not in cart) |
| Unit pricing | price per measure | `unit_price_with_measurement` |
| Subscriptions, pre-order, TBYB | selling-plan picker and honest terms | `selling_plan_group` / `selling_plan`, `selling_plan` on cart add |
| Shop Pay Installments | banner placement | `{{ form \| payment_terms }}` inside a product or cart form; `data-cart-subtotal` for live totals |
| Accelerated checkout | wallet buttons | `{{ form \| payment_button }}` on PDP; `additional_checkout_buttons` + `content_for_additional_checkout_buttons` on cart. Closed shadow DOM: style only via `--shopify-accelerated-checkout-*`, track only the outer custom elements |
| B2B | company location picker, gated pricing | `customer.b2b?`, `current_company`, `current_location`, `company_available_locations` |
| Local pickup | availability on PDP | pickup-availability section fetched per variant |
| Email consent | newsletter signup | `{% form 'customer' %}` with `name="contact[email]"` |
| Markets | country and language selectors, contextual content | `localization` object, `{% form 'localization' %}`; market overrides live in `*.context.<market>.json` |
| Navigation and search | menus, predictive search, filtering | `linklists`, `/search/suggest`, `collection.filters` with `filter.p.*` / `filter.v.*` params (AND across filters, OR within one) |
| SEO | title, description, canonical | `page_title`, `page_description`, `canonical_url`. hreflang is injected automatically via `content_for_header` — do not add your own unless the automatic tags are turned off |
| Trust | hCaptcha | arrives through `content_for_header` and binds by matching `form action` + a `form_type` input. Hand-rolled forms must reproduce those attributes, or use `data-shopify-captcha="true"` / `Shopify.captcha.protect()` |
| Customer accounts | sign-in entry point | legacy `templates/customers/*` are deprecated; ship `<shopify-account>` and `routes.account_url` / `account_login_url` / `storefront_login_url` |

The pattern throughout: Shopify supplies behaviour through `content_for_header` or a specific object/filter/form type, and the theme supplies placement and a markup contract. Strip `content_for_header`, hand-roll a form without `form_type`, hardcode `/cart`, or format money by hand, and the platform feature fails silently with no error.

## Limits that shape architecture

1,000 JSON templates per theme · 25 sections per template or section group · 20 section groups · 50 blocks per section · 1,250 blocks per template · 300 block files · 8 levels of block nesting · 256 KB per Liquid file · 512 KB per JSON template and `settings_schema.json` · 1.5 MB `settings_data.json` and locale files · 50 KB per `liquid` setting · 5 theme presets · 50 MB theme package. Theme app extensions are separate: 10 MB total, 30 blocks, 100 KB of Liquid.

Hitting one of these is a design signal, not a problem to route around.

## Performance, in priority order

Never lazy-load the LCP image · set `fetchpriority="high"` on it · do not hide it behind a reveal animation · render essential content in Liquid rather than client JavaScript · avoid deeply nested Liquid loops (the dominant cause of high TTFB, and it scales with catalogue size) · put first-paint resources above `content_for_header` · use `preload` sparingly.

## Review lens

Name the defect, the platform mechanism it breaks, and the customer consequence:

- Hardcoded `/cart`, `/search` or domain paths → Markets visitors see the wrong currency and language.
- Section or block with no `presets` that the merchant is expected to add → it cannot be added.
- Missing `{{ block.shopify_attributes }}`, or `"tag": null` without a single wrapping element → drag-and-drop corrupts the DOM.
- No `shopify:section:load` handler → the section dies as soon as it is edited.
- Colour setting filtered inline inside `{% style %}` → live preview breaks and editor diverges from storefront.
- Statically rendered section used where a JSON template would do → one shared settings instance across every render site, no `@app` blocks, no reordering, `section.index` is `nil`.
- Unguarded resource settings or variants → blank regions on perfectly normal store states.
- Hardcoded customer-facing copy → untranslatable; every string belongs in `locales/*.json` via `| t`.
- Prices formatted by hand → wrong under Markets and multi-currency.
- Unpaginated loops over `collection.products` or `all_products` → TTFB that degrades as the merchant's catalogue grows.
