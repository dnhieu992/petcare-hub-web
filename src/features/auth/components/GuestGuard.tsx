'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '../store/auth.store'

const DEFAULT_AUTHENTICATED_PATH = '/settings'
const ACTIVATE_PATH = '/activate'

export function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const session = useAuthStore((state) => state.session)
  const pendingActivation = useAuthStore((state) => state.pendingActivation)
  const hydrated = useAuthStore((state) => state.hydrated)

  useEffect(() => {
    if (!hydrated) return

    if (session) {
      router.replace(DEFAULT_AUTHENTICATED_PATH)
      return
    }

    if (pendingActivation && pathname !== ACTIVATE_PATH) {
      router.replace(ACTIVATE_PATH)
    }
  }, [hydrated, pathname, pendingActivation, router, session])

  if (!hydrated) {
    return null
  }

  if (session) {
    return null
  }

  if (pendingActivation && pathname !== ACTIVATE_PATH) {
    return null
  }

  return children
}
