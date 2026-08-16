# @petcare/pet-portal — Pet-owner app

Next.js 16 (App Router) app for **pet owners**.

## Entry & routing

- Routes: `src/app/` — App Router pages & layouts. Server Components by default;
  add `"use client"` only when you need browser APIs or React state.
- `middleware.ts` (app root) resolves tenant + enforces auth **before** any page renders.
- Data fetching: server components fetch directly; client components use TanStack Query.

## Folders

```
src/
  app/         # App Router pages & layouts
  features/    # feature-slice modules
  components/  # app-local shared components
  hooks/       # app-local hooks
  lib/         # app-local utils / config (tenant.ts, etc.)
  stores/      # Zustand stores
  types/       # app-local types
middleware.ts  # tenant resolution + auth guard
```

## Rules specific to this app

- Server Components are the default — keep `"use client"` to the leaf that needs it.
- Next.js pages/layouts/route handlers may use `export default` (framework requirement);
  everything else stays on named exports.
- UI from `@petcare/ui`, data/schemas from `@petcare/api`.
- Must **not** import `@petcare/clinic` or `@petcare/admin`.
- Tenant context is resolved in `middleware.ts` — never hardcode tenant IDs.

See the root `CLAUDE.md` and `.claude/rules/` for shared conventions.
