'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { login } from '../services/auth.mock'
import { useAuthStore } from '../store/auth.store'
import type { LoginPayload } from '../types'

const APP_PATH = '/settings'
const ACTIVATE_PATH = '/activate'

export function useLogin() {
  const router = useRouter()
  const setSession = useAuthStore((state) => state.setSession)
  const setPendingActivation = useAuthStore(
    (state) => state.setPendingActivation,
  )
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function submit(payload: LoginPayload) {
    setIsPending(true)

    const response = await login(payload)

    if (response.status === 'ERROR') {
      setError(response.message)
      setIsPending(false)
      return response
    }

    setError(null)

    if (response.status === 'PENDING_ACTIVATION') {
      setSession(null)
      setPendingActivation(response)
      router.replace(ACTIVATE_PATH)
      setIsPending(false)
      return response
    }

    setPendingActivation(null)
    setSession({
      status: 'AUTHENTICATED',
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user: response.user,
      tenant: response.tenant,
    })
    router.replace(APP_PATH)
    setIsPending(false)
    return response
  }

  return {
    submit,
    error,
    isPending,
  }
}
