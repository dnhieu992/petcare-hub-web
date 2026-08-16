# Boundaries — what may import what

These rules are **enforced by ESLint** (`packages/config/eslint/base.js`). A violation
fails `pnpm lint` and blocks the pre-commit hook. Keep this doc and that config in sync.

## The dependency direction

```
apps/*  ──►  packages/*        (apps depend on packages)
packages/ui   ──►  packages/config
packages/api  ──►  packages/config
```

- **Apps depend on packages. Packages never depend on apps.**
- **`ui` and `api` do not depend on each other.** If they need to share something,
  it belongs in a lower-level package (or `config`).
- **No app imports another app.** clinic ⁄ admin ⁄ pet-portal are isolated.

## Public-entry rule

Import a package only through its declared entry / `exports` subpaths:

| ✅ Allowed                          | ❌ Blocked                                  |
| ----------------------------------- | ------------------------------------------- |
| `import { Button } from "@petcare/ui"` | `"@petcare/ui/src/components/button"`     |
| `import { apiClient } from "@petcare/api/client"` | `"@petcare/api/src/client/axios"` |

Reason: internals can be refactored freely as long as the public entry is stable. Deep
imports couple apps to a package's file layout and break that guarantee.

## When you need to cross a boundary

You don't — you **move the shared thing down**:

- Two apps need the same component → put it in `@petcare/ui`.
- Two apps need the same fetch/schema → put it in `@petcare/api`.
- Two configs need the same rule → put it in `@petcare/config`.

Never add an app-to-app or package-to-app import to "make it work."
