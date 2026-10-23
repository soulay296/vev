import { Link } from 'react-router-dom'
import { ChevronRight, Globe, LogIn, Moon, Sun, UserPlus } from 'lucide-react'
import { useTheme } from '../hooks/theme'
import { images } from '../constants/images'

export function ProfilePage() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="flex flex-col items-center rounded-3xl border border-border-light bg-surface-light p-6 text-center dark:border-border-dark dark:bg-surface-dark">
        <img src={images.avatars.placeholder.src} alt={images.avatars.placeholder.alt} className="h-20 w-20 rounded-full" />
        <h1 className="mt-3 text-xl font-bold">Bienvenue sur vev</h1>
        <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
          Connectez-vous pour réserver et suivre vos trajets.
        </p>
        <div className="mt-4 flex w-full gap-2">
          <Link
            to="/login"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary"
          >
            <LogIn size={16} /> Se connecter
          </Link>
          <Link
            to="/register"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-border-light px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary dark:border-border-dark"
          >
            <UserPlus size={16} /> S'inscrire
          </Link>
        </div>
      </div>

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
