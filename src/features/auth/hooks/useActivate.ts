'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { resendPasscode, verifyPasscode } from '../services/auth.mock'
import { useAuthStore } from '../store/auth.store'

const APP_PATH = '/settings'
const RESEND_COOLDOWN_SECONDS = 30

export function useActivate() {
  const router = useRouter()
  const pendingActivation = useAuthStore((state) => state.pendingActivation)
  const setSession = useAuthStore((state) => state.setSession)
  const setPendingActivation = useAuthStore(
    (state) => state.setPendingActivation,
  )
  const [error, setError] = useState<string | null>(null)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (countdown <= 0) return

    const timer = window.setTimeout(() => {
      setCountdown((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [countdown])

  async function submit(passcode: string) {
    if (!pendingActivation) {
      setError('No activation session was found. Please log in again.')
      return null
    }

    setIsPending(true)
    const response = await verifyPasscode({
      email: pendingActivation.email,
      passcode,
    })

    if (response.status === 'ERROR') {
      setError(response.message)
      setIsPending(false)
      return response
    }

    setError(null)
    setResendMessage(null)
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

  async function resendCode() {
    if (!pendingActivation || countdown > 0) {
      return null
    }

    const response = await resendPasscode(pendingActivation.email)

    if (response.status === 'ERROR') {
      setError(response.message)
      setResendMessage(null)
      return response
    }

    setError(null)
    setResendMessage('We sent a new activation code.')
    setCountdown(RESEND_COOLDOWN_SECONDS)
    return response
  }

  return {
    submit,
    resendCode,
    countdown,
    error,
    isPending,
    pendingActivation,
    resendMessage,
  }
}
