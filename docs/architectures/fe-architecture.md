# Frontend Architecture

**Project:** petcare-hub-web  
**Version:** 1.0  
**Type:** Technical Reference Document

---

## 1. Technology Stack

Each technology was selected for a specific purpose — avoid replacing any dependency without understanding the trade-offs.

| Technology | Purpose | Key Features Used |
|---|---|---|
| **Next.js 16** | Core framework | App Router, SSR, SSG, ISR, file-based routing, image optimization, API routes |
| **Tailwind CSS** | Utility-first styling | Responsive design, design tokens, JIT compilation |
| **shadcn/ui** | UI component library | Accessible primitives built on Radix UI — wrapped via `components/base/` (never import directly) |
| **TanStack Query v5** | Server state management | Caching, background refetch, optimistic updates, `useQuery` / `useMutation` |
| **Zustand** | Client state management | Lightweight global state for UI (sidebar, theme, modals) |
| **React Hook Form + Zod** | Form handling & validation | Schema-based validation, minimal re-renders, type-safe form values |
| **date-fns** | Date/time utilities | Tree-shakeable, functional API — only import functions you use |
| **Axios** | HTTP client | Interceptors for auth headers, error normalization, base URL config |

> **Note:** shadcn/ui generates components into `components/ui/` — never edit these files directly. Always use the wrapper layer in `components/base/` so the app remains decoupled from the underlying library.

### 1.1 Verified Technical Details

- **Next.js 16.2.1** — latest stable as of March 2026. Turbopack is now the default bundler. Minimum Node.js: 20.9.
- **TanStack Query** — formerly known as React Query, rebranded at v4 to support Vue, Solid, Svelte. Install: `@tanstack/react-query`.
- **date-fns v4** — released 2024 with full TypeScript built-in. Preferred over Day.js (less actively maintained since 2021).
- **Zustand** — manages only client/UI state. TanStack Query manages server state. Do not duplicate server data in Zustand.
- **React Hook Form + Zod** — infer TypeScript types directly from the schema using `z.infer<typeof schema>`.

---

## 2. Folder Structure

The folder structure follows a simplified **Feature-Sliced Design (FSD)** combined with **Colocation** and **Screaming Architecture** principles.

### 2.1 Architectural Patterns Applied

| Pattern | Contribution |
|---|---|
| **Feature-Sliced Design** | Organize by domain layer, not by file type. Each layer can only import from layers below it. |
| **Colocation** | Keep code close to where it is used. Only move to a shared location when used in 2+ features. |
| **Screaming Architecture** | Reading the folder structure should immediately reveal what the app does, not what framework it uses. |

### 2.2 FSD Layer Overview

```
app/          Providers, root layout, routing config
              ↓ Can import from all layers below
pages/        Assembles widgets into a complete page
              ↓
features/     Business logic units — each feature owns its components, hooks, api, and types
              ↓
entities/     Core business models: User, Product, Order
              ↓
shared/       UI primitives (base components), utils, lib configs — no business logic
```

> **Rule:** A lower layer must **never** import from a higher layer. `features/` must not import from `pages/`. `shared/` must not import from `features/`. Violations break the one-directional dependency rule.

### 2.3 Full Folder Structure

```
petcare-hub-web/
├── src/
│   ├── app/                          # Next.js App Router — routes, layouts, pages
│   │   ├── (auth)/                   # Route group — no URL segment created
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/              # Route group — has its own layout
│   │   │   ├── layout.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── api/                      # API routes — backend within Next.js
│   │   │   └── users/
│   │   │       └── route.ts
│   │   ├── layout.tsx                # Root layout — html, body, providers
│   │   └── page.tsx                  # Homepage "/"
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn generated — DO NOT edit directly
│   │   ├── base/                     # Your wrapper — app ONLY imports from here
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   └── layout/                   # Navbar, Sidebar, Footer
│   │       ├── Navbar.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   │
│   ├── features/                     # Domain-driven — each feature is self-contained
│   │   ├── users/
│   │   │   ├── components/           # UserCard, UserForm, UserTable
│   │   │   ├── hooks/                # useUsers, useUserById
│   │   │   ├── api/                  # fetch functions
│   │   │   └── types.ts              # User, UserDTO, UserCreatePayload
│   │   ├── products/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   └── types.ts
│   │   └── auth/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── api/
│   │       └── types.ts
│   │
│   ├── lib/                          # Singleton instances, 3rd-party config
│   │   ├── query-client.ts           # TanStack Query setup
│   │   ├── axios.ts                  # Axios instance + interceptors
│   │   └── auth.ts                   # Auth config (e.g. NextAuth)
│   │
│   ├── hooks/                        # Global hooks — used across multiple features
│   │   ├── useDebounce.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── stores/                       # Zustand — global client state only
│   │   └── ui-store.ts               # Sidebar open, theme
│   │
│   ├── types/                        # Global TypeScript types
│   │   ├── api.ts                    # ApiResponse<T>, PaginatedResponse<T>
│   │   └── index.ts
│   │
│   └── utils/                        # Pure functions — no side effects
│       ├── format.ts                 # date-fns wrappers
│       └── cn.ts                     # clsx + tailwind-merge
│
├── public/                           # Static assets — images, fonts, icons
├── .env.local                        # Secrets — NEVER commit
├── .env.example                      # Template — always commit this
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### 2.4 Import Rules

> Consider enforcing these rules automatically with `eslint-plugin-import` or `@feature-sliced/eslint-config`.

| Layer | Allowed imports |
|---|---|
| `app/` | `features/`, `components/base/`, `lib/`, `utils/` |
| `features/x/` | `lib/`, `utils/`, `types/` — never import from another feature |
| `components/` | `lib/`, `utils/` — never import from `features/` |
| `lib/` | `utils/` only |
| `utils/` | No internal imports |

---

## 3. Technical Notes

### components/base/ — wrapper pattern

The app must only import from `components/base/`, never from `components/ui/` directly. This decouples the application from shadcn/ui, allowing future library migration with minimal refactoring.

```tsx
// ❌ Never do this
import { Button } from "@/components/ui/button"

// ✅ Always do this
import { Button } from "@/components/base"
```

### lib/ vs utils/ distinction

- **`lib/`** — files with side effects or singleton instances (axios instance, queryClient, auth config). These *initialize* something.
- **`utils/`** — pure functions only. Input goes in, output comes out, no side effects. Safe to import anywhere.

### Global hooks vs feature hooks

- **`hooks/` (root)** — only for hooks used across multiple features: `useDebounce`, `useMediaQuery`, `useLocalStorage`.
- **`features/x/hooks/`** — hooks specific to that feature. Keep them colocated — only promote to root `hooks/` if reused elsewhere.

### Environment files

- **`.env.local`** — contains actual secrets. Add to `.gitignore`. Never commit.
- **`.env.example`** — template showing required keys with no values. Always commit this so teammates know what to configure.

### Route groups — `(auth)` and `(dashboard)`

Parentheses in folder names create route groups in Next.js App Router. They allow grouping pages under a shared layout **without adding a URL segment**.

```
app/(auth)/login/page.tsx   →   resolves to /login  (not /auth/login)
app/(dashboard)/settings/   →   resolves to /settings
```