# Design Tokens for Shadcn and Tailwind Design

**Date:** 2026-03-30

## Goal

Introduce a reusable design token system that works with `shadcn` and Tailwind, starts with one shared global theme for the whole app, supports light and dark mode, and leaves a clean path for future tenant-specific themes.

## Current Context

The current frontend theme setup is intentionally minimal:

- [tailwind.config.ts](/Users/dnhieu92/Documents/personal/new-account/petcare-hub-web/tailwind.config.ts) only defines content paths and an empty `theme.extend`
- [src/app/globals.css](/Users/dnhieu92/Documents/personal/new-account/petcare-hub-web/src/app/globals.css) only imports Tailwind layers
- base components already re-export `shadcn`-style UI components through `src/components/base/*`

This is a good foundation for adding a semantic token layer without needing to unwind existing theme conventions.

## Decision

We will use a two-layer token system:

1. Foundation tokens
2. Semantic aliases

Foundation tokens define the reusable design language such as brand colors, neutrals, radii, and shadows. Semantic aliases map those values into `shadcn`-compatible names like `background`, `foreground`, `primary`, `muted`, and `border`.

## Why This Approach

This gives us the best of both systems:

- `shadcn` components can keep using familiar semantic utilities like `bg-background` and `text-foreground`
- the app gains a reusable brand token layer instead of hardcoded component colors
- future tenant theming can be added by swapping CSS variable scopes instead of rewriting Tailwind classes
- dark mode support becomes a token override problem instead of a component rewrite

## Alternatives Considered

### 1. Semantic tokens only

This would be faster in the short term, but it would skip the reusable brand layer. Later customization would be harder because the system would not distinguish between raw brand values and semantic usage.

### 2. Tailwind theme values only, without CSS variables

This would work for a static design, but it is a weak fit for `shadcn`, dynamic theme switching, and future tenant-specific theming.

## Token Architecture

### Foundation tokens

These will live as CSS custom properties in `:root` and `.dark`, for example:

- `--color-brand-50` through `--color-brand-900`
- `--color-neutral-50` through `--color-neutral-950`
- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`

We may also add a small number of optional status tokens if needed:

- `--color-success`
- `--color-warning`
- `--color-danger`

### Semantic aliases

These are the `shadcn`-compatible tokens that components and utilities will use:

- `--background`
- `--foreground`
- `--card`
- `--card-foreground`
- `--popover`
- `--popover-foreground`
- `--primary`
- `--primary-foreground`
- `--secondary`
- `--secondary-foreground`
- `--muted`
- `--muted-foreground`
- `--accent`
- `--accent-foreground`
- `--destructive`
- `--destructive-foreground`
- `--border`
- `--input`
- `--ring`

## Tailwind Integration

The Tailwind config will map semantic color names to CSS variables via HSL values so utilities remain ergonomic:

- `bg-background`
- `text-foreground`
- `bg-primary`
- `border-border`
- `ring-ring`

Tailwind will also expose token-backed radius and shadow values so components can use semantic utilities instead of hardcoded literals.

## Theming Model

The first rollout will be global for the entire app:

- `:root` contains the default light theme
- `.dark` overrides dark-mode values

To support future tenant branding, we will structure the CSS so variables can later be scoped to selectors like:

- `[data-theme="tenant-a"]`
- `[data-theme="tenant-b"]`

That future step should not require changing Tailwind utility names or component APIs.

## Implementation Scope

Included now:

- foundation tokens for colors, radii, and shadows
- semantic aliases for `shadcn`
- Tailwind theme extension for colors, radius, and box shadow
- base app styles so the document background and text use the new tokens
- optional `components.json` creation if needed to align with `shadcn` conventions

Not included now:

- tenant-specific token generation
- runtime theme switcher UI
- token build pipelines such as Style Dictionary

## Error Handling and Risk

Primary risks:

- using raw hex values in components would bypass the token system
- mismatches between CSS variable names and Tailwind theme keys would make utilities fail silently
- missing dark-mode values would lead to unreadable contrast

Mitigation:

- keep token names centralized in `globals.css`
- mirror the standard `shadcn` semantic naming scheme
- verify with at least one page using `bg-background`, `text-foreground`, and `bg-primary`

## Testing Strategy

Verification should include:

- `tailwind.config.ts` builds cleanly
- the app renders with token-driven background and foreground styles
- at least one UI component resolves semantic colors from the token map
- dark mode variables exist even if the UI toggle is not built yet

## Performance Notes

This design is performance-friendly:

- CSS variables avoid adding runtime theme logic for the initial rollout
- semantic Tailwind utilities keep styling static and tree-shakeable
- the approach does not introduce extra client components or theme providers

## Approved Direction

Approved approach: global foundation tokens plus semantic `shadcn` aliases with dark-mode support, designed to expand into tenant-specific themes later.
