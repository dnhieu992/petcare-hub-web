// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const RESERVED_SUBDOMAINS = new Set(['www', 'app', 'api', 'mail', 'ftp', 'localhost'])

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname
  const parts = hostname.split('.')

  // No subdomain present (e.g., plain localhost or root domain)
  if (parts.length < 3) return NextResponse.next()

  const slug = parts[0]

  // Skip reserved subdomains
  if (RESERVED_SUBDOMAINS.has(slug)) return NextResponse.next()

  // Forward slug to server components via request header
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-slug', slug)

  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // Also store in cookie for client-side axios interceptor
  response.cookies.set('tenant-slug', slug, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
  })

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
