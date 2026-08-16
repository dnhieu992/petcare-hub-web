# ADR-0001: Monorepo structure and AI-friendly guardrails

- **Status:** Accepted
- **Date:** 2026-08-16
- **Deciders:** Team

## Context

The product needs three separate frontends (clinic staff, SaaS admin, pet owners) that
share UI, API contracts, and tooling. The team develops heavily with AI assistance
("vibe coding"), which is fast but drifts: inconsistent patterns, cross-package
reach-ins, `any`, skipped conventions. We need a structure that keeps AI productive
**and** keeps the code maintainable long term.

## Options considered

1. **Separate repos per app** — strong isolation, but shared UI/API/tooling gets copy-pasted
   and diverges; painful cross-cutting changes.
2. **Monorepo, documented rules only** — one place, but nothing stops AI/devs from breaking
   boundaries; quality rests entirely on review.
3. **Monorepo + automated guardrails (chosen)** — shared packages, plus machine-enforced
   boundaries, strict types, formatting, and a pre-commit gate.

## Decision

Adopt a **Turborepo + pnpm monorepo** (`apps/*`, `packages/*`) with the **balanced
guardrail set**:

- Context: a `CLAUDE.md` at the root and in every app/package so AI loads the right rules.
- Enforcement: strict TypeScript, ESLint with import-boundary rules (no cross-app imports,
  no deep package imports), Prettier, and a husky + lint-staged pre-commit hook.
- Shared code lives in `@petcare/ui`, `@petcare/api`, `@petcare/config`.
- Conventions documented in `.claude/rules/`; the boundary rules there are mirrored by
  the ESLint config that enforces them.

We deliberately did **not** add CI gating, dependency-cruiser, or code generators yet —
that heavier setup can be layered on later without rework.

## Consequences

- Positive: AI drift is caught at the developer's machine; reviewers focus on logic;
  boundaries keep packages decoupled and maintainable.
- Negative / cost: slightly higher initial setup; commits run lint/format hooks; config
  needs occasional upkeep.
- Follow-ups: when the team grows, add CI (turbo lint/type-check/test), dependency-cruiser,
  and scaffolding generators (see the "strict" option) — an incremental upgrade.
