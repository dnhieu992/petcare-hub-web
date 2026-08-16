# @petcare/clinic — Staff app

Vite + React + React Router SPA for **organization staff** (clinic employees).

## Entry & routing

- Entry: `src/app/` (app shell, providers, router bootstrap) → `index.html` mounts it.
- Routes: `src/routes/` — one component per route, wired with React Router.
- Data fetching: **TanStack Query** only (never `useEffect` for fetching).

## Folders

```
src/
  app/         # shell, providers (QueryClient, router), entry
  routes/      # route components
  features/    # feature-slice modules (components + hooks + types together)
  components/  # app-local shared components
  hooks/       # app-local hooks
  lib/         # app-local utils / config
  stores/      # Zustand stores (camelCase + `Store` suffix)
  types/       # app-local types
```

## Rules specific to this app

- UI comes from `@petcare/ui`; don't re-create buttons/inputs locally.
- All API calls go through `@petcare/api`. No `axios`/`fetch` here.
- This app must **not** import `@petcare/admin` or `@petcare/pet-portal`.
- Tailwind: `tailwind.config.ts` uses `presets: [petcarePreset]` from `@petcare/config/tailwind`.

See the root `CLAUDE.md` and `.claude/rules/` for shared conventions.
