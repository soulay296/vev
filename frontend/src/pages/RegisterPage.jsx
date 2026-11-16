import { Link } from 'react-router-dom'
import { RegisterForm } from '../features/auth/components/RegisterForm'

export function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-8">
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
        Étudiant ou propriétaire de louage, rejoignez vev.
      </p>

      <div className="mt-6 rounded-3xl border border-border-light bg-surface-light p-5 dark:border-border-dark dark:bg-surface-dark">
        <RegisterForm />
      </div>

      <p className="mt-4 text-center text-sm text-muted-light dark:text-muted-dark">
        Déjà un compte ?{' '}
        <Link to="/login" className="font-semibold text-primary">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
