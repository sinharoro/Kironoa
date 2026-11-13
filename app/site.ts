const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const BASE_PATH = rawBasePath.replace(/\/$/, '')

export function asset(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${BASE_PATH}${normalized}`
}
