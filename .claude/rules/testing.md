# Testing

## Principles

- Test behavior, not implementation details.
- One assertion concept per test — keep tests narrow and clearly named.
- Prefer integration-style tests; don't mock the router or internal modules unless necessary.

## Placement

- Co-locate unit tests next to the file under test: `foo.ts` → `foo.test.ts`.
- Cross-cutting integration tests live in each app's `src/__tests__/`.

## Naming

```ts
describe("ComponentName or functionName", () => {
  it("does X when Y", () => { ... });
});
```

## Avoid

- Snapshot tests for logic-heavy components — they become noise.
- Testing implementation details (internal state, private methods).
- Mocking `fetch`/Axios when you can use MSW or a real test server.

## Monorepo notes

- Shared logic in `@petcare/api` / `@petcare/ui` is tested **inside its own package**, so
  every app inherits confidence — don't re-test package internals from app tests.
- `pnpm test` runs the whole workspace via turbo; `pnpm test --filter @petcare/api` runs one.
