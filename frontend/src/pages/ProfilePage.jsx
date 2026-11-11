import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ChevronRight, Globe, LogIn, LogOut, Moon, Sun, UserPlus } from 'lucide-react'
import { useTheme } from '../providers/ThemeProvider'
import { useAuth } from '../features/auth/AuthContext'
import { images } from '../constants/images'
import { Badge } from '../components/ui/Badge'
import { buttonClasses } from '../components/ui/Button'

export function ProfilePage() {
  const { isDark, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    queryClient.clear()
    logout()
    toast.success('Vous êtes déconnecté.')
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      {user ? (
        <div className="flex flex-col items-center rounded-3xl border border-border-light bg-surface-light p-6 text-center dark:border-border-dark dark:bg-surface-dark">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-primary">
            {(user.first_name || 'V').slice(0, 1).toUpperCase()}
          </span>
          <h1 className="mt-3 text-xl font-bold">
            {user.first_name} {user.last_name}
          </h1>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">{user.email}</p>
          {user.phone && (
            <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">{user.phone}</p>
          )}
          <div className="mt-3">
            <Badge variant={user.role === 'owner' ? 'primary' : 'default'}>
              {user.role === 'owner' ? 'Propriétaire' : 'Étudiant'}
            </Badge>
          </div>
          <button type="button" onClick={handleLogout} className={buttonClasses({ variant: 'outline', className: 'mt-5' })}>
            <LogOut size={16} /> Se déconnecter
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-3xl border border-border-light bg-surface-light p-6 text-center dark:border-border-dark dark:bg-surface-dark">
          <img src={images.avatars.placeholder.src} alt={images.avatars.placeholder.alt} className="h-20 w-20 rounded-full" />
          <h1 className="mt-3 text-xl font-bold">Bienvenue sur vev</h1>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
            Connectez-vous pour réserver et suivre vos trajets.
          </p>
          <div className="mt-4 flex w-full gap-2">
            <Link to="/login" className={buttonClasses({ className: 'flex-1' })}>
              <LogIn size={16} /> Se connecter
            </Link>
            <Link to="/register" className={buttonClasses({ variant: 'outline', className: 'flex-1' })}>
              <UserPlus size={16} /> S'inscrire
            </Link>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-3xl border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center justify-between px-4 py-4 text-sm font-medium"
        >
          <span className="flex items-center gap-3">
            {isDark ? <Sun size={18} className="text-primary" /> : <Moon size={18} className="text-primary" />}
            Mode {isDark ? 'clair' : 'sombre'}
          </span>
          <span className="text-xs text-muted-light dark:text-muted-dark">Changer</span>
        </button>

        <div className="flex items-center justify-between border-t border-border-light px-4 py-4 text-sm dark:border-border-dark">
          <span className="flex items-center gap-3">
            <Globe size={18} className="text-primary" /> Langue
          </span>
          <span className="text-xs text-muted-light dark:text-muted-dark">Français (العربية bientôt)</span>
        </div>

        <Link
          to="/owner"
          className="flex items-center justify-between border-t border-border-light px-4 py-4 text-sm font-medium dark:border-border-dark"
        >
          <span>Espace propriétaire</span>
          <ChevronRight size={16} className="text-muted-light dark:text-muted-dark" />
        </Link>
      </div>
    </div>
  )
}
