import { NextRequest, NextResponse } from 'next/server'

const RESERVED_SUBDOMAINS = new Set(['www', 'app', 'api', 'admin', 'mail', 'ftp', 'localhost'])
const SLUG_PATTERN = /^[a-z0-9-]{1,63}$/

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname
  const parts = hostname.split('.')

  // Bare hostname with no subdomain (e.g., "localhost")
  if (parts.length === 1) return NextResponse.next()

  // Two-segment hostname: root domain (petapp.com) → skip; subdomain on localhost (clinic1.localhost) → proceed
  if (parts.length === 2 && parts[1] !== 'localhost') return NextResponse.next()

  const slug = parts[0]

  // Skip reserved subdomains
  if (RESERVED_SUBDOMAINS.has(slug)) return NextResponse.next()

  // Validate slug format before injecting into headers/cookies
  if (!SLUG_PATTERN.test(slug)) return NextResponse.next()

  // Forward slug to server components via request header
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-slug', slug)

  const response = NextResponse.next({ request: { headers: requestHeaders } })

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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
