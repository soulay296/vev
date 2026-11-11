import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from './AuthContext'
import { isDemoMode } from '../../lib/api'

export function RequireAuth({ children }) {
  const { user, ready } = useAuth()
  const location = useLocation()

  if (isDemoMode()) return children
  if (!ready) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  return children
}
