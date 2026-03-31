import type { ReactNode } from 'react'
import { AuthHydrator } from '@/features/auth/components/AuthHydrator'
import { ProtectedGuard } from '@/features/auth/components/ProtectedGuard'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthHydrator>
      <ProtectedGuard>
        <div className="min-h-screen bg-slate-50">{children}</div>
      </ProtectedGuard>
    </AuthHydrator>
  )
}
