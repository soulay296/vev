import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { apiFetch, getToken, isDemoMode, setToken } from '../../lib/api'

const USER_KEY = 'vev-user'
const DEMO_SESSION_KEY = 'vev-demo-session'
const AuthContext = createContext(null)

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? readJson(USER_KEY) : readJson(DEMO_SESSION_KEY)))
  const [ready, setReady] = useState(!getToken() || isDemoMode())

  useEffect(() => {
    if (!getToken() || isDemoMode()) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await apiFetch('/auth/me')
        if (cancelled) return
        setUser(data.user)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      } catch (error) {
        if (cancelled) return
        if (error.status === 401) {
          setToken(null)
          localStorage.removeItem(USER_KEY)
          setUser(null)
        }
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    if (isDemoMode()) {
      const demoUser = { first_name: 'Invité', last_name: 'démo', email, phone: '', role: 'student', demo: true }
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser))
      setUser(demoUser)
      return { demo: true }
    }
    const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password } })
    setToken(data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setUser(data.user)
    return data
  }, [])

  const register = useCallback(async (payload) => {
    if (isDemoMode()) {
      const { password: _password, ...rest } = payload
      const demoUser = { phone: '', ...rest, demo: true }
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser))
      setUser(demoUser)
      return { demo: true }
    }
    const data = await apiFetch('/auth/register', { method: 'POST', body: payload })
    setToken(data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(DEMO_SESSION_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, ready, isDemoUser: !!user?.demo, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return context
}
