# Code Style

## TypeScript

- Prefer `type` over `interface` for object shapes; use `interface` only for extensible contracts.
- **No `any`.** Use `unknown` and narrow explicitly.
- Explicit return types on exported functions; infer elsewhere.
- Zod schemas own validation — derive TypeScript types via `z.infer<>`.
- `verbatimModuleSyntax` is on: use `import type { X }` for type-only imports.

## React

- Server Components by default (Next.js). Add `"use client"` only for browser APIs / React state.
- **Named exports only** — no `export default` (exception: Next.js pages/layouts/route handlers
  and framework config files that require a default export).
- Props types defined inline with the component file, not a separate `types.ts`.
- Avoid `useEffect` for data fetching — use TanStack Query.

## Naming

- Files and folders: `kebab-case`.
- React components: `PascalCase`.
- Hooks: `camelCase` prefixed with `use`.
- Zustand stores: `camelCase` suffixed with `Store` (e.g. `authStore`).

## className

Always compose classes with `cn()` from `@petcare/ui`:

```ts
import { cn } from "@petcare/ui";
className={cn("base-class", condition && "conditional-class")}
```

## Imports

- Use the `@/` alias within an app; use `@petcare/*` across workspaces.
- Group: external → `@petcare/*` packages → `@/` internal → relative.
- Never deep-import a package's internals (`@petcare/ui/src/...`) — use its public entry.
