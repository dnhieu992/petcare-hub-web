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
