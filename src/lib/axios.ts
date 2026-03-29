// src/lib/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

function getTenantSlugFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined // SSR guard
  const row = document.cookie
    .split('; ')
    .find((r) => r.startsWith('tenant-slug='))
  if (!row) return undefined
  return decodeURIComponent(row.split('=').slice(1).join('='))
}

api.interceptors.request.use((config) => {
  const slug = getTenantSlugFromCookie()
  if (slug) {
    config.headers['X-Tenant-Slug'] = slug
  }
  return config
})

export default api
