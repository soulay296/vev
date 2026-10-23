import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-2 text-xl font-semibold">Page introuvable</h1>
      <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="mt-5 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}
