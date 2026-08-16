# API Conventions

## Client setup

All HTTP calls go through the Axios instance in `@petcare/api` (`./client`). Never call
`fetch` or `axios` directly from components, hooks, or app code.

## TanStack Query

- Query keys are factories in `@petcare/api` (`./query-keys`) — no inline key arrays.
- `useQuery` for reads; `useMutation` for writes.
- Invalidate related queries in `onSuccess` of mutations.
- Set `staleTime` at the query level — don't rely on the global default alone.

## Error handling

- API errors are typed via Zod — validate response shapes before using them.
- Surface errors through the query `error` state; never `console.error` in production paths.
- 401 responses trigger a redirect to `/login` via the Axios response interceptor.

## Schemas & types

- Every request/response has a Zod schema in `@petcare/api` (`./schemas`).
- Derive TS types with `z.infer<>` — never hand-write a type that duplicates a schema.

## Multi-tenancy

- pet-portal: tenant slug is resolved by `middleware.ts`, available via `lib/tenant.ts`.
- admin: cross-tenant — pass tenant scope explicitly in every call.
- All calls carry tenant context (via interceptor/caller) — never hardcode tenant IDs.

## Next.js route handlers

- Place under `apps/pet-portal/src/app/api/<resource>/route.ts`.
- Validate request bodies with Zod before processing.
- Return consistent `{ data, error }` envelopes.
