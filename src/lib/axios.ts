// src/lib/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

function getTenantSlugFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined // SSR guard
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('tenant-slug='))
    ?.split('=')[1]
}

api.interceptors.request.use((config) => {
  const slug = getTenantSlugFromCookie()
  if (slug) {
    config.headers['X-Tenant-Slug'] = slug
  }
  return config
})

export default api
