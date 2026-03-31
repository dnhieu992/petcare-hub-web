const SESSION_KEY = 'petcare-hub.auth.session'

export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null

  const rawSession = window.localStorage.getItem(SESSION_KEY)

  if (!rawSession) return null

  try {
    const session = JSON.parse(rawSession) as { accessToken?: string }
    return typeof session.accessToken === 'string' ? session.accessToken : null
  } catch {
    return null
  }
}
