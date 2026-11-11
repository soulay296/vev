import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Info } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../features/auth/AuthContext'
import { isDemoMode } from '../lib/api'

const schema = z.object({
  email: z.string().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(6, 'Au moins 6 caractères'),
})

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    try {
      const result = await login(values.email, values.password)
      toast.success(result.demo ? 'Connecté en mode démo.' : 'Bon retour sur vev !')
      navigate(location.state?.from || '/', { replace: true })
    } catch (error) {
      toast.error(error.message || 'Connexion impossible.')
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-8">
      <h1 className="text-2xl font-bold">Connexion</h1>
      <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
        Accédez à vos réservations et à votre profil.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-3xl border border-border-light bg-surface-light p-5 dark:border-border-dark dark:bg-surface-dark">
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" size="lg" loading={isSubmitting}>
          {isSubmitting ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>

      {isDemoMode() && (
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-secondary/15 p-3 text-xs text-amber-700 dark:text-amber-400">
          <Info size={14} className="mt-0.5 shrink-0" />
          Mode démo : la connexion est simulée, n'importe quel identifiant fonctionne. Configurez VITE_API_BASE_URL pour
          l'authentification réelle.
        </p>
      )}

      <p className="mt-4 text-center text-sm text-muted-light dark:text-muted-dark">
        Pas encore de compte ?{' '}
        <Link to="/register" className="font-semibold text-primary">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
