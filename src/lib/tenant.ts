// src/lib/tenant.ts
import type { Tenant } from './tenant-context'

const FALLBACK_TENANT: Tenant = {
  clinicId: 'clinic_demo',
  clinicName: 'Demo Company',
  slug: 'demo-company',
  primaryColor: '#0f172a',
  logoUrl: null,
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const baseUrl = process.env.API_URL

  if (!baseUrl) {
    return process.env.NODE_ENV === 'production' ? null : FALLBACK_TENANT
  }

  let res: Response
  try {
    res = await fetch(`${baseUrl}/clinics/slug/${slug}`, {
      next: { revalidate: 60 }, // cache for 60 seconds
    })
  } catch (err) {
    console.error('[getTenantBySlug] Network error:', err)
    return process.env.NODE_ENV === 'production' ? null : FALLBACK_TENANT
  }

  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Unexpected status ${res.status} fetching tenant`)
  const data = await res.json()
  if (
    !data?.clinicId || typeof data.clinicId !== 'string' ||
    typeof data.clinicName !== 'string' ||
    typeof data.slug !== 'string' ||
    typeof data.primaryColor !== 'string'
  ) {
    throw new Error('Invalid tenant response: missing required fields')
  }
  return data as Tenant
}
