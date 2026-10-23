import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Input } from '../components/ui/Input'

const schema = z.object({
  first_name: z.string().min(2, 'Prénom requis'),
  last_name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Numéro invalide'),
  password: z.string().min(6, 'Au moins 6 caractères'),
  role: z.enum(['student', 'owner']),
})

export function RegisterPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'student' },
  })

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    toast.info("L'inscription sera branchée à l'étape suivante.")
    navigate('/')
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-8">
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
        Étudiant ou propriétaire de n9l jeme3i, rejoignez vev.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-3xl border border-border-light bg-surface-light p-5 dark:border-border-dark dark:bg-surface-dark">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Prénom" error={errors.first_name?.message} {...register('first_name')} />
          <Input label="Nom" error={errors.last_name?.message} {...register('last_name')} />
        </div>
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input label="Téléphone" type="tel" placeholder="+216 ..." error={errors.phone?.message} {...register('phone')} />
        <Input
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input label="Je suis" as="select" error={errors.role?.message} {...register('role')}>
          <option value="student">Étudiant</option>
          <option value="owner">Propriétaire de transport</option>
        </Input>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-60"
        >
          {isSubmitting ? 'Création...' : "S'inscrire"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-light dark:text-muted-dark">
        Déjà un compte ?{' '}
        <Link to="/login" className="font-semibold text-primary">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
