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
