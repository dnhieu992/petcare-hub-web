# @petcare/ui — Shared UI library

shadcn/ui components, design tokens, base styles, and the `cn()` helper. Consumed by
all three apps.

## Folders

```
src/
  components/  # shadcn/ui + composed components (PascalCase, named exports)
  styles/      # base/global styles
  tokens/      # design-token TS objects (mirror the Tailwind preset)
  lib/         # cn() and small UI utilities
  index.ts     # PUBLIC ENTRY — the only thing apps import
```

## Rules

- **Public API discipline:** everything apps use must be re-exported from `src/index.ts`
  (or a declared `exports` subpath). Apps importing `@petcare/ui/src/...` is a lint error.
- **No app/business logic here** — no API calls, no tenant logic, no routing. Pure presentation.
- `react`/`react-dom` are **peer** dependencies (provided by the app), not bundled.
- Components are `PascalCase`, files `kebab-case`, exports **named**.
- Design tokens stay in sync with `@petcare/config/tailwind` — one visual source of truth.

See the root `CLAUDE.md` and `.claude/rules/` for shared conventions.
