# Design Tokens for Shadcn and Tailwind Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a global multi-layer design token system for `shadcn` and Tailwind using CSS variables, with light and dark theme support and a clean path to future tenant-specific themes.

**Architecture:** Define foundation and semantic CSS variables in `src/app/globals.css`, map semantic aliases into Tailwind theme extensions in `tailwind.config.ts`, and ensure the app shell consumes token-driven background and foreground styles. Keep the implementation server-friendly and static so no new runtime theme logic is required.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 3, TypeScript, `shadcn`-style semantic tokens

---

### Task 1: Establish the token contract in global CSS

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Write the failing test**

Manual check:

- Open `src/app/globals.css`
- Confirm it does not yet define `:root`, `.dark`, or semantic tokens like `--background`

**Step 2: Run test to verify it fails**

Run: `rg --line-number -- '--background|--primary|:root|\\.dark' src/app/globals.css`
Expected: no matches or incomplete token definitions

**Step 3: Write minimal implementation**

Add:

- Tailwind `@layer base`
- foundation color tokens such as `--color-brand-*` and `--color-neutral-*`
- semantic aliases such as `--background`, `--foreground`, `--primary`, `--border`, and `--ring`
- `.dark` overrides for semantic tokens
- base `body` styles using `@apply bg-background text-foreground`

**Step 4: Run test to verify it passes**

Run: `rg --line-number -- '--background|--primary|:root|\\.dark' src/app/globals.css`
Expected: matches for the new token declarations

**Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add global design tokens"
```

### Task 2: Map semantic tokens into Tailwind theme extensions

**Files:**
- Modify: `tailwind.config.ts`

**Step 1: Write the failing test**

Manual check:

- Open `tailwind.config.ts`
- Confirm `theme.extend` does not yet expose token-backed `colors`, `borderRadius`, or `boxShadow`

**Step 2: Run test to verify it fails**

Run: `rg --line-number 'colors:|borderRadius:|boxShadow:' tailwind.config.ts`
Expected: no matches inside `theme.extend`

**Step 3: Write minimal implementation**

Add Tailwind extensions for:

- semantic colors mapped to `hsl(var(--token))`
- radius tokens mapped to `var(--radius-*)`
- shadow tokens mapped to `var(--shadow-*)`

Include standard `shadcn` token keys:

- `background`
- `foreground`
- `card`
- `popover`
- `primary`
- `secondary`
- `muted`
- `accent`
- `destructive`
- `border`
- `input`
- `ring`

**Step 4: Run test to verify it passes**

Run: `rg --line-number 'colors:|borderRadius:|boxShadow:' tailwind.config.ts`
Expected: matches showing token-backed Tailwind extensions

**Step 5: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: map design tokens into tailwind"
```

### Task 3: Align the app shell with token-driven styling

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Write the failing test**

Manual check:

- Open `src/app/layout.tsx`
- Confirm `<body>` does not yet apply any theme-related utility classes

**Step 2: Run test to verify it fails**

Run: `rg --line-number '<body[^>]*className=' src/app/layout.tsx`
Expected: no matches

**Step 3: Write minimal implementation**

Add a `className` on `<body>` that uses token-based shell styling, such as:

- `bg-background`
- `text-foreground`
- `antialiased`

Keep the layout server component unchanged otherwise.

**Step 4: Run test to verify it passes**

Run: `rg --line-number '<body[^>]*className=' src/app/layout.tsx`
Expected: one match with token-based utility classes

**Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: apply theme tokens to app shell"
```

### Task 4: Add or align shadcn configuration metadata

**Files:**
- Create: `components.json`

**Step 1: Write the failing test**

Manual check:

- Confirm `components.json` is missing from the repo root

**Step 2: Run test to verify it fails**

Run: `test -f components.json && echo present || echo missing`
Expected: `missing`

**Step 3: Write minimal implementation**

Create `components.json` with paths that match the current codebase and token conventions, including:

- Tailwind config path
- global CSS path
- alias paths used in `src/*`
- a neutral base style such as `default`

**Step 4: Run test to verify it passes**

Run: `test -f components.json && echo present || echo missing`
Expected: `present`

**Step 5: Commit**

```bash
git add components.json
git commit -m "chore: add shadcn components config"
```

### Task 5: Verify token integration end to end

**Files:**
- Verify: `src/app/globals.css`
- Verify: `tailwind.config.ts`
- Verify: `src/app/layout.tsx`
- Verify: `components.json`

**Step 1: Write the failing test**

Manual check:

- Confirm the app has not yet been verified with lint or build after the token changes

**Step 2: Run test to verify it fails**

Run: `npm run lint`
Expected: may fail before fixes are complete or expose unrelated issues that must be reviewed

**Step 3: Write minimal implementation**

Resolve any token-related issues exposed by lint or static checks without broadening scope beyond the approved token rollout.

**Step 4: Run test to verify it passes**

Run: `npm run lint`
Expected: lint passes, or any unrelated pre-existing failures are documented clearly

**Step 5: Commit**

```bash
git add src/app/globals.css tailwind.config.ts src/app/layout.tsx components.json
git commit -m "feat: finish design token integration"
```
