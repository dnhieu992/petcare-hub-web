# PetCare Hub — Monorepo

Multi-tenant pet care platform. **Turborepo + pnpm** monorepo with three apps and
three shared packages.

> **Working here with AI?** Always read the **nearest `CLAUDE.md`** to the file you're
> editing (the app or package folder) — it has the local rules. This root file has the
> shared rules that apply everywhere.

## Apps & packages

| Workspace           | Path              | What it is                        | Stack                       |
| ------------------- | ----------------- | --------------------------------- | --------------------------- |
| `@petcare/clinic`   | `apps/clinic`     | Staff app for one organization    | Vite + React + React Router |
| `@petcare/admin`    | `apps/admin`      | SaaS admin (all tenants)          | Vite + React + React Router |
| `@petcare/pet-portal` | `apps/pet-portal` | Pet-owner app                   | Next.js 16 (App Router)     |
| `@petcare/ui`       | `packages/ui`     | shadcn/ui components, tokens, `cn()` | —                        |
| `@petcare/api`      | `packages/api`    | Axios client, Zod schemas, query keys | —                       |
| `@petcare/config`   | `packages/config` | eslint / tsconfig / tailwind presets | —                        |

## Golden rules (enforced by lint — see `.claude/rules/boundaries.md`)

1. **Import packages through their public entry**, never their internals.
   ✅ `import { Button } from "@petcare/ui"`  ❌ `"@petcare/ui/src/components/button"`
2. **Apps never import other apps.** Shared code goes into a `packages/*` package.
3. **No `any`.** Use `unknown` + narrow. Zod owns runtime validation; derive types with `z.infer`.
4. **All HTTP goes through `@petcare/api`** — never call `fetch`/`axios` from components.
5. **Named exports only** — no `export default` (except Next.js pages/config where required).
6. **`kebab-case`** for files/folders, **`PascalCase`** for components, **`useX`** for hooks.

## Guardrails (what catches mistakes)

- **TypeScript strict** — `tsconfig.base.json`. Run `pnpm type-check`.
- **ESLint** with import-boundary rules — run `pnpm lint`.
- **Prettier** — run `pnpm format`.
- **Pre-commit hook** (husky + lint-staged) auto-runs eslint + prettier on staged files.
  If a commit is blocked, fix what it reports — do **not** bypass with `--no-verify`.

## How to add things

> **Full step-by-step for building or fixing a feature:** see
> [`docs/feature-workflow.md`](docs/feature-workflow.md) — the canonical flow
> (where code goes, the build pipeline, understanding an existing feature, and when to
> write a change note).

- **A shared component** → `packages/ui`, export it from the package entry, then import in apps.
- **An API call / schema** → `packages/api` (client, Zod schema, query key), consumed via TanStack Query.
- **A feature** → `apps/<app>/src/features/<domain>/` (feature-slice: components, hooks, types together).
- **A design token** → `packages/config/tailwind` (single source, all apps inherit).

## Conventions (details)

Loaded per file path from `.claude/rules/`:

- `code-style.md` — TypeScript & React style
- `boundaries.md` — what may import what
- `api-conventions.md` — data fetching, TanStack Query, tenancy
- `testing.md` — how we test
- `documentation.md` — ADR vs change-note (in `docs/`)

## Docs hygiene (chống phình context)

Two kinds of docs, treated differently:

- **Always-loaded** (`CLAUDE.md`, `.claude/rules/`) — read by AI every turn. **Keep each
  `CLAUDE.md` under ~200 lines.** If it grows past that, move detail into `.claude/rules/`
  or `docs/` and leave a pointer. Prefer machine enforcement (ESLint) over long prose.
- **On-demand** (`docs/changes/`, `docs/adr/`) — only read when needed, so they can grow.
  Change notes are archived by year (`docs/changes/<year>/`); look them up with
  `find docs/changes -name '*<feature>*'`.

For understanding a large codebase without loading everything, use the `/understand`
knowledge-graph skill instead of pasting files into context.

## Commands

```bash
pnpm install       # link the workspace
pnpm dev           # run all apps
pnpm dev --filter @petcare/clinic   # run one app
pnpm lint          # lint everything
pnpm type-check    # type-check everything
pnpm format        # format with prettier
```
