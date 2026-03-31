'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { register } from '../services/auth.mock'
import { useAuthStore } from '../store/auth.store'
import type { RegisterPayload } from '../types'

const ACTIVATE_PATH = '/activate'

export function useRegister() {
  const router = useRouter()
  const setSession = useAuthStore((state) => state.setSession)
  const setPendingActivation = useAuthStore(
    (state) => state.setPendingActivation,
  )
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function submit(payload: RegisterPayload) {
    setIsPending(true)

    const response = await register(payload)

    if (response.status === 'ERROR') {
      setError(response.message)
      setIsPending(false)
      return response
    }

    setError(null)
    setSession(null)
    setPendingActivation(response)
    router.replace(ACTIVATE_PATH)
    setIsPending(false)
    return response
  }

  return {
    submit,
    error,
    isPending,
  }
}
