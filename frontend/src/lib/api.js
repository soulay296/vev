import { toast } from 'sonner'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const TOKEN_KEY = 'vev-token'

let demoMode = !BASE_URL

export function isDemoMode() {
  return demoMode
}

export function markDemoMode() {
  if (demoMode) return
  demoMode = true
  toast.info('Serveur injoignable — mode démonstration activé.')
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function apiFetch(path, { method = 'GET', body } = {}) {
  if (!BASE_URL) {
    markDemoMode()
    throw new ApiError('API non configurée', 0)
  }
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    markDemoMode()
    throw new ApiError('Serveur injoignable', 0)
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(data?.error || `Erreur ${response.status}`, response.status)
  }
  return data
}
