# @petcare/admin — SaaS admin portal

Vite + React + React Router SPA for **SaaS staff** who manage **all tenants**.

## Entry & routing

- Entry: `src/app/` (shell, providers, router bootstrap) → `index.html`.
- Routes: `src/routes/` — one component per route (React Router).
- Data fetching: **TanStack Query** only.

## Folders

```
src/
  app/         # shell, providers, entry
  routes/      # route components
  features/    # feature-slice modules
  components/  # app-local shared components
  hooks/       # app-local hooks
  lib/         # app-local utils / config
  stores/      # Zustand stores
  types/       # app-local types
```

## Rules specific to this app

- This is a **cross-tenant** surface: unlike clinic/pet-portal, admin sees data across
  tenants. Be explicit about tenant scoping in every query — never assume a single tenant.
- UI from `@petcare/ui`, data from `@petcare/api`. No local `axios`/`fetch`.
- Must **not** import `@petcare/clinic` or `@petcare/pet-portal`.

See the root `CLAUDE.md` and `.claude/rules/` for shared conventions.
