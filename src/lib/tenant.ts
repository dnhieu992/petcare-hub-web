// src/lib/tenant.ts
import type { Tenant } from './tenant-context'

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const baseUrl = process.env.API_URL
  if (!baseUrl) throw new Error('API_URL environment variable is not set')

  let res: Response
  try {
    res = await fetch(`${baseUrl}/clinics/slug/${slug}`, {
      next: { revalidate: 60 }, // cache for 60 seconds
    })
  } catch (err) {
    console.error('[getTenantBySlug] Network error:', err)
    return null
  }

  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Unexpected status ${res.status} fetching tenant`)
  const data = await res.json()
  if (!data?.clinicId || typeof data.clinicId !== 'string') {
    throw new Error('Invalid tenant response: missing clinicId')
  }
  return data as Tenant
}
