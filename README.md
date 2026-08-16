# PetCare Hub

Multi-tenant pet care platform, built as a **Turborepo + pnpm** monorepo.

## Applications

| App                | Path               | Audience                          | Stack                          |
|--------------------|--------------------|-----------------------------------|--------------------------------|
| Clinic             | `apps/clinic`      | Organization staff                | Vite + React + React Router    |
| Admin              | `apps/admin`       | SaaS staff (all tenants)          | Vite + React + React Router    |
| Pet Portal         | `apps/pet-portal`  | Pet owners                        | Next.js 16 (App Router)        |

## Shared packages

| Package           | Path               | Provides                                                      |
|-------------------|--------------------|--------------------------------------------------------------|
| `@petcare/ui`     | `packages/ui`      | shadcn/ui components, design tokens, base styles, `cn()`      |
| `@petcare/api`    | `packages/api`     | Axios client, Zod schemas, TanStack Query keys, shared types |
| `@petcare/config` | `packages/config`  | Shared ESLint, TypeScript, and Tailwind presets              |

Apps consume packages via the `@petcare/*` scope with `workspace:*` links.

## Layout

```
petcare-hub-web/
├── apps/
│   ├── clinic/          # staff app        (Vite SPA)
│   ├── admin/           # SaaS admin        (Vite SPA)
│   └── pet-portal/      # pet-owner app     (Next.js)
├── packages/
│   ├── ui/              # @petcare/ui
│   ├── api/             # @petcare/api
│   └── config/          # @petcare/config
├── pnpm-workspace.yaml  # workspace globs
├── turbo.json           # task pipeline
├── tsconfig.base.json   # base TS config
└── package.json         # root scripts
```

### App folder shape

**Vite apps** (`clinic`, `admin`):
```
src/
  app/          # shell, providers, router bootstrap
  routes/       # React Router route components
  features/     # feature-sliced modules
  components/   # app-local shared components
  hooks/        # app-local hooks
  lib/          # app-local utilities / config
  stores/       # Zustand stores
  types/        # app-local types
public/
```

**Next.js app** (`pet-portal`): same feature-slice shape with `src/app/`
(App Router) plus `middleware.ts` for tenant resolution + auth guard.

## Getting started

```bash
pnpm install          # install & link the workspace
pnpm dev              # run all apps (turbo)
pnpm build            # build everything
pnpm lint             # lint all workspaces
pnpm type-check       # type-check all workspaces
```

Run a single app with turbo filters, e.g. `pnpm dev --filter @petcare/clinic`.

## Status

Structure only — folders and manifests are scaffolded; no application code is
implemented yet.
