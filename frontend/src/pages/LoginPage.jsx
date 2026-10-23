import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Input } from '../components/ui/Input'

const schema = z.object({
  email: z.string().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(6, 'Au moins 6 caractères'),
})

export function LoginPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    toast.info("L'authentification sera branchée à l'étape suivante.")
    navigate('/')
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-60"
        >
          {isSubmitting ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-light dark:text-muted-dark">
        Pas encore de compte ?{' '}
        <Link to="/register" className="font-semibold text-primary">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
