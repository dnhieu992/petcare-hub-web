'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuthStore } from '../store/auth.store'

export function AuthHydrator({ children }: { children?: ReactNode }) {
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth)

  useEffect(() => {
    hydrateAuth()
  }, [hydrateAuth])

  return children ?? null
}
