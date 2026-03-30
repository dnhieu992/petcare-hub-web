# Multi-Tenancy

## Overview

PetCare Hub uses subdomain-based multi-tenancy. Each clinic gets its own subdomain (e.g., `clinicA.petapp.com`). The subdomain slug is extracted per request and used to scope all data and UI to the correct tenant.

---

## Request Flow

```
Request: clinicA.petapp.com/pets
         ↓
middleware.ts
  - Extract slug from subdomain (e.g., "clinicA")
  - Attach as Next.js internal header: x-tenant-slug: "clinicA"
         ↓
layout.tsx (root layout)
  - Read x-tenant-slug from request headers
  - Fetch clinic record from DB by slug
  - If not found → redirect to 404 or error page
  - Inject tenant data into <TenantProvider>
         ↓
Any page (e.g., /pets)
  - useTenant() → returns clinicId, clinicName, slug, etc.
```

---

## Header / Storage Conventions

| Layer       | Key             | Value       | Purpose                        |
|-------------|-----------------|-------------|--------------------------------|
| Middleware  | `x-tenant-slug` | `"clinicA"` | Next.js internal header        |
| Cookie      | `tenant-slug`   | `"clinicA"` | Browser-side storage           |
| API request | `X-Tenant-Slug` | `"clinicA"` | Sent to backend on every call  |

---

## Tenant Interface

Defined in `lib/tenant-context.ts`:

```ts
export interface Tenant {
  clinicId: string
  clinicName: string
  slug: string
  primaryColor: string
  logoUrl: string | null
}
```

---

## Implementation Notes

### middleware.ts
- Extract slug from the first subdomain segment of the hostname.
- **Exclude** reserved/system subdomains: `www`, `app`, `localhost`, `api`, etc.
- **Exclude** static asset paths (`/_next/`, `/favicon.ico`, `/public/`, etc.) — no slug check needed.
- Attach slug to header: `x-tenant-slug`.

### lib/tenant-context.ts
- Creates a React context holding the `Tenant` object.
- Exports `TenantProvider` component and `useTenant()` hook.
- `useTenant()` throws if called outside of `TenantProvider`.

### layout.tsx (root)
- Reads `x-tenant-slug` header via `next/headers`.
- Fetches clinic from DB by slug.
- On slug not found: return 404 page or redirect.
- Wraps children with `<TenantProvider tenant={clinic}>`.

### lib/axios.ts
- Request interceptor reads slug from cookie (`tenant-slug`).
- Injects `X-Tenant-Slug` header into every outgoing API request.

---

## Error Handling

| Scenario                        | Behavior                              |
|---------------------------------|---------------------------------------|
| Slug not found in DB            | Render 404 page or redirect           |
| Missing slug on valid subdomain | Treat as unknown tenant → 404         |
| `useTenant()` outside provider  | Throw error (dev-time safety)         |
| API call missing `X-Tenant-Slug`| Backend returns 400/401               |

---

## Security Considerations

- Never trust the slug from client-side alone — always validate against DB in the server layout.
- The `x-tenant-slug` header is internal to Next.js and not exposed to the browser.
- Scope all DB queries to `clinicId` derived from the validated tenant, not from raw slug.
