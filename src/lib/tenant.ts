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
