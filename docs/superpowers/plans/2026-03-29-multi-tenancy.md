# Multi-Tenancy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement subdomain-based multi-tenancy so each clinic gets its own scoped subdomain (e.g., `clinicA.petapp.com`) with tenant data injected globally via React context.

**Architecture:** Next.js middleware extracts the subdomain slug and forwards it as an internal request header (`x-tenant-slug`). The root layout reads the header, fetches the clinic record from the backend, and wraps the app in a `TenantProvider`. Client-side API calls pick up the slug from a cookie and send it as `X-Tenant-Slug` on every axios request.

**Tech Stack:** Next.js 15 App Router, TypeScript, Axios, React Context

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `middleware.ts` (project root) | Extract subdomain slug, set request header + cookie |
| Create | `src/lib/tenant-context.tsx` | `Tenant` type, `TenantProvider`, `useTenant()` hook |
| Create | `src/lib/tenant.ts` | Server-side `getTenantBySlug()` fetch helper |
| Modify | `src/app/layout.tsx` | Read header, fetch tenant, render `TenantProvider` |
| Modify | `src/lib/axios.ts` | Request interceptor injects `X-Tenant-Slug` from cookie |
| Modify | `.env.example` | Add `API_URL` variable for server-side fetch |

---

## Task 1: Create `middleware.ts`

**Files:**
- Create: `middleware.ts` (project root, next to `package.json`)

- [ ] **Step 1: Create the middleware file**

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const RESERVED_SUBDOMAINS = new Set(['www', 'app', 'api', 'mail', 'ftp', 'localhost'])

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname
  const parts = hostname.split('.')

  // No subdomain present (e.g., plain localhost or root domain)
  if (parts.length < 3) return NextResponse.next()

  const slug = parts[0]

  // Skip reserved subdomains
  if (RESERVED_SUBDOMAINS.has(slug)) return NextResponse.next()

  // Forward slug to server components via request header
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-slug', slug)

  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // Also store in cookie for client-side axios interceptor
  response.cookies.set('tenant-slug', slug, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
  })

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
```

- [ ] **Step 2: Verify middleware is recognized by Next.js**

Run: `npx next build 2>&1 | grep -i middleware`

Expected: No errors. Next.js should compile middleware without issues.

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: add tenant middleware to extract subdomain slug"
```

---

## Task 2: Create `src/lib/tenant-context.tsx`

**Files:**
- Create: `src/lib/tenant-context.tsx`

- [ ] **Step 1: Create the context file**

```tsx
// src/lib/tenant-context.tsx
'use client'

import { createContext, useContext, type ReactNode } from 'react'

export interface Tenant {
  clinicId: string
  clinicName: string
  slug: string
  primaryColor: string
  logoUrl: string | null
}

const TenantContext = createContext<Tenant | null>(null)

export function TenantProvider({
  tenant,
  children,
}: {
  tenant: Tenant
  children: ReactNode
}) {
  return (
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  )
}

export function useTenant(): Tenant {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenant() must be used inside <TenantProvider>')
  return ctx
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/tenant-context.tsx
git commit -m "feat: add TenantProvider and useTenant hook"
```

---

## Task 3: Create `src/lib/tenant.ts` (server-side helper)

**Files:**
- Create: `src/lib/tenant.ts`

- [ ] **Step 1: Add `API_URL` to `.env.example`**

Open `.env.example` and append:

```
API_URL=http://localhost:3001
```

- [ ] **Step 2: Create the server-side fetch helper**

```ts
// src/lib/tenant.ts
import type { Tenant } from './tenant-context'

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const baseUrl = process.env.API_URL
  if (!baseUrl) throw new Error('API_URL environment variable is not set')

  try {
    const res = await fetch(`${baseUrl}/clinics/slug/${slug}`, {
      next: { revalidate: 60 }, // cache for 60 seconds
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`Unexpected status ${res.status} fetching tenant`)
    return (await res.json()) as Tenant
  } catch {
    return null
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/tenant.ts .env.example
git commit -m "feat: add getTenantBySlug server helper"
```

---

## Task 4: Modify `src/app/layout.tsx`

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update root layout to resolve and inject tenant**

Replace the entire contents of `src/app/layout.tsx`:

```tsx
// src/app/layout.tsx
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { getTenantBySlug } from '@/lib/tenant'
import { TenantProvider } from '@/lib/tenant-context'
import './globals.css'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const slug = headersList.get('x-tenant-slug')

  if (!slug) return notFound()

  const tenant = await getTenantBySlug(slug)
  if (!tenant) return notFound()

  return (
    <html lang="en">
      <body>
        <TenantProvider tenant={tenant}>
          {children}
        </TenantProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify build compiles**

Run: `npx next build`

Expected: Build completes with no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: resolve tenant in root layout and inject TenantProvider"
```

---

## Task 5: Modify `src/lib/axios.ts` — inject `X-Tenant-Slug`

**Files:**
- Modify: `src/lib/axios.ts`

- [ ] **Step 1: Add tenant slug interceptor**

Replace the entire contents of `src/lib/axios.ts`:

```ts
// src/lib/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

function getTenantSlugFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined // SSR guard
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('tenant-slug='))
    ?.split('=')[1]
}

api.interceptors.request.use((config) => {
  const slug = getTenantSlugFromCookie()
  if (slug) {
    config.headers['X-Tenant-Slug'] = slug
  }
  return config
})

export default api
```

- [ ] **Step 2: Verify build compiles**

Run: `npx next build`

Expected: Build completes with no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/axios.ts
git commit -m "feat: inject X-Tenant-Slug header into all axios requests"
```

---

## Task 6: Manual end-to-end smoke test

No automated tests yet (test framework not set up). Do a local smoke test.

- [ ] **Step 1: Set up local env**

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
API_URL=http://localhost:3001
```

- [ ] **Step 2: Add a test entry to `/etc/hosts`**

```bash
echo "127.0.0.1 clinica.localhost" | sudo tee -a /etc/hosts
```

- [ ] **Step 3: Start dev server and open the subdomain**

```bash
npm run dev
```

Open: `http://clinica.localhost:3000`

Expected: If your backend returns a clinic for slug `clinica`, the page renders. If no backend is running, the page returns 404 (which is correct behavior — slug resolved but fetch returned null).

- [ ] **Step 4: Verify cookie is set**

Open browser DevTools → Application → Cookies.

Expected: Cookie `tenant-slug=clinica` is present.

- [ ] **Step 5: Verify axios sends the header**

Open DevTools → Network → any API call.

Expected: Request header `X-Tenant-Slug: clinica` is present.
