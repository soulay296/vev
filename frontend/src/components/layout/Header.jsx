import { Link, NavLink } from 'react-router-dom'
import { Moon, Sun, LogIn, LayoutDashboard } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { useTheme } from '../../hooks/theme'

const links = [
  { to: '/search', label: 'Recherche' },
  { to: '/bookings', label: 'Mes réservations' },
  { to: '/owner', label: 'Espace propriétaire' },
]

export function Header() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 border-b border-border-light bg-surface-light/90 backdrop-blur dark:border-border-dark dark:bg-surface-dark/90">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link to="/" aria-label="Accueil vev" className="flex items-center gap-2">
          <Logo dark={isDark} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-light hover:text-primary dark:text-muted-dark'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
            className="rounded-xl p-2 text-muted-light transition-colors hover:bg-border-light hover:text-text-light dark:text-muted-dark dark:hover:bg-border-dark dark:hover:text-text-dark"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link
            to="/owner"
            aria-label="Espace propriétaire"
            className="rounded-xl p-2 text-muted-light transition-colors hover:bg-border-light hover:text-text-light md:hidden dark:text-muted-dark dark:hover:bg-border-dark dark:hover:text-text-dark"
          >
            <LayoutDashboard size={20} />
          </Link>
          <Link
            to="/login"
            className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-light transition-colors hover:text-primary sm:flex dark:text-muted-dark"
          >
            <LogIn size={16} />
            Connexion
          </Link>
        </div>
      </div>
    </header>
  )
}
