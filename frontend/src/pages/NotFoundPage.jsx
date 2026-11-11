import { Link } from 'react-router-dom'
import { buttonClasses } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-2 text-xl font-semibold">Page introuvable</h1>
      <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className={buttonClasses({ className: 'mt-5' })}>
        Retour à l'accueil
      </Link>
    </div>
  )
}
