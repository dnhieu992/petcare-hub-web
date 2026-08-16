# @petcare/config — Shared tooling presets

Single source of truth for ESLint, TypeScript, and Tailwind configuration. Every app
and package extends these — change a rule here and it applies everywhere.

## Contents

```
eslint/
  base.js      # TS + import-boundary rules (no cross-app, no deep imports)
  react.js     # base + React + hooks (Vite apps, @petcare/ui)
  next.js      # base + Node/Browser globals (pet-portal)
typescript/
  base.json    # extends root tsconfig.base.json
  react-app.json
  next-app.json
tailwind/
  index.ts     # petcarePreset — design tokens
```

## Rules

- Keep configs **minimal and shared**. If only one workspace needs a rule, put it in that
  workspace's own config, not here.
- The import-boundary rules in `eslint/base.js` are the machine enforcement of
  `.claude/rules/boundaries.md` — keep the two in sync.
- No runtime/app code here — tooling only.

See the root `CLAUDE.md` for how these are consumed.
