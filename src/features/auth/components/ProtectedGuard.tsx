'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/auth.store'

const LOGIN_PATH = '/login'
const ACTIVATE_PATH = '/activate'

export function ProtectedGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const session = useAuthStore((state) => state.session)
  const pendingActivation = useAuthStore((state) => state.pendingActivation)
  const hydrated = useAuthStore((state) => state.hydrated)

  useEffect(() => {
    if (!hydrated) return

    if (pendingActivation) {
      router.replace(ACTIVATE_PATH)
      return
    }

    if (!session) {
      router.replace(LOGIN_PATH)
    }
  }, [hydrated, pendingActivation, router, session])

  if (!hydrated || pendingActivation || !session) {
    return null
  }

  return children
}
