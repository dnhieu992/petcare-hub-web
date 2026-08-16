# @petcare/api — API client & contracts

The single place all HTTP and data contracts live. Consumed by all three apps.

## Folders

```
src/
  client/      # Axios instance, interceptors (401 → redirect, tenant header)
  schemas/     # Zod schemas — the source of truth for request/response shapes
  query-keys/  # TanStack Query key factories (constants, no magic strings)
  types/       # types derived from Zod via z.infer<>
  index.ts     # public entry (also ./client, ./schemas, ./query-keys, ./types)
```

## Rules

- **Zod owns validation.** Define the schema, then `type X = z.infer<typeof xSchema>`.
  Validate responses before using them — never trust the wire.
- **No React here.** No components, no hooks that call React. This package is
  framework-agnostic data logic. (`@tanstack/react-query` is a peer dep for key types only.)
- **Tenant context** is passed in by the caller / injected via interceptor — never
  hardcode tenant IDs.
- Query keys are defined here as factories and imported by apps; don't inline key arrays
  in app code.
- No `any`. Errors are typed (Zod-validated error envelopes).

See the root `CLAUDE.md` and `.claude/rules/api-conventions.md`.
