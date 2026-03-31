import type { AuthSession, PendingActivationContext } from '../types'

const SESSION_KEY = 'petcare-hub.auth.session'
const PENDING_ACTIVATION_KEY = 'petcare-hub.auth.pending-activation'
const AUTH_STATUS_COOKIE = 'petcare-hub.auth.status'
const AUTH_STATUS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export interface AuthStorageSnapshot {
  session: AuthSession | null
  pendingActivation: PendingActivationContext | null
}

function safeParse<T>(value: string | null): T | null {
  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function writeAuthStatusCookie(value: string | null) {
  if (typeof document === 'undefined') return

  if (!value) {
    document.cookie = `${AUTH_STATUS_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`
    return
  }

  document.cookie =
    `${AUTH_STATUS_COOKIE}=${encodeURIComponent(value)}; Max-Age=${AUTH_STATUS_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`
}

export function readAuthStorage(): AuthStorageSnapshot {
  if (typeof window === 'undefined') {
    return { session: null, pendingActivation: null }
  }

  return {
    session: safeParse<AuthSession>(window.localStorage.getItem(SESSION_KEY)),
    pendingActivation: safeParse<PendingActivationContext>(
      window.localStorage.getItem(PENDING_ACTIVATION_KEY),
    ),
  }
}

export function saveAuthSession(session: AuthSession | null) {
  if (typeof window === 'undefined') return

  if (session) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    writeAuthStatusCookie(session.status)
    return
  }

  window.localStorage.removeItem(SESSION_KEY)
  writeAuthStatusCookie(null)
}

export function savePendingActivation(
  pendingActivation: PendingActivationContext | null,
) {
  if (typeof window === 'undefined') return

  if (pendingActivation) {
    window.localStorage.setItem(
      PENDING_ACTIVATION_KEY,
      JSON.stringify(pendingActivation),
    )
    writeAuthStatusCookie(pendingActivation.status)
    return
  }

  window.localStorage.removeItem(PENDING_ACTIVATION_KEY)
  writeAuthStatusCookie(null)
}

export function clearAuthStorage() {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem(SESSION_KEY)
  window.localStorage.removeItem(PENDING_ACTIVATION_KEY)
  writeAuthStatusCookie(null)
}

export const authStorageKeys = {
  session: SESSION_KEY,
  pendingActivation: PENDING_ACTIVATION_KEY,
  authStatusCookie: AUTH_STATUS_COOKIE,
} as const
