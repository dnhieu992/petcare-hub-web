import { NextRequest, NextResponse } from 'next/server'

const RESERVED_SUBDOMAINS = new Set(['www', 'app', 'api', 'admin', 'mail', 'ftp', 'localhost'])
const SLUG_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/
const AUTH_STATUS_COOKIE = 'petcare-hub.auth.status'
const AUTHENTICATED_PATH = '/settings'
const ACTIVATE_PATH = '/activate'
const LOGIN_PATH = '/login'
const GUEST_ONLY_PATHS = new Set([LOGIN_PATH, '/register', ACTIVATE_PATH])
const PROTECTED_PATH_PREFIXES = [AUTHENTICATED_PATH]

function isProtectedPath(pathname: string) {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const authStatus = request.cookies.get(AUTH_STATUS_COOKIE)?.value
  const hostname = request.nextUrl.hostname
  const parts = hostname.split('.')
  const requestHeaders = new Headers(request.headers)
  let response = NextResponse.next({ request: { headers: requestHeaders } })

  if (GUEST_ONLY_PATHS.has(pathname)) {
    if (authStatus === 'AUTHENTICATED') {
      return NextResponse.redirect(new URL(AUTHENTICATED_PATH, request.url))
    }

    if (authStatus === 'PENDING_ACTIVATION' && pathname !== ACTIVATE_PATH) {
      return NextResponse.redirect(new URL(ACTIVATE_PATH, request.url))
    }
  }

  if (isProtectedPath(pathname)) {
    if (authStatus === 'PENDING_ACTIVATION') {
      return NextResponse.redirect(new URL(ACTIVATE_PATH, request.url))
    }

    if (authStatus !== 'AUTHENTICATED') {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
    }
  }

  // Bare hostname with no subdomain (e.g., "localhost")
  if (parts.length === 1) return response

  // Two-segment hostname: if second part is NOT "localhost", treat as root domain (e.g. petapp.com) → skip.
  // If second part IS "localhost" (e.g. clinic1.localhost), first part is a subdomain → proceed.
  if (parts.length === 2 && parts[1] !== 'localhost') return response

  const slug = parts[0]

  // Skip reserved subdomains
  if (RESERVED_SUBDOMAINS.has(slug)) return response

  // Validate slug format before injecting into headers/cookies
  if (!SLUG_PATTERN.test(slug)) return response

  // Forward slug to server components via request header
  requestHeaders.set('x-tenant-slug', slug)

  response = NextResponse.next({ request: { headers: requestHeaders } })

  // Store in cookie for client-side axios interceptor
  response.cookies.set('tenant-slug', slug, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/|api/).*)'],
}
