import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Info } from 'lucide-react'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useAuth } from '../AuthContext'
import { isDemoMode } from '../../../lib/api'

const schema = z.object({
  first_name: z.string().min(2, 'Prénom requis'),
  last_name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Numéro invalide'),
  password: z.string().min(6, 'Au moins 6 caractères'),
  role: z.enum(['student', 'owner']),
})

export function RegisterForm({ onSuccess }) {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'student' },
  })

  const onSubmit = async (values) => {
    try {
      const result = await registerUser(values)
      toast.success(result.demo ? 'Compte démo créé.' : 'Bienvenue sur vev !')
      if (onSuccess) {
        onSuccess(result, values)
        return
      }
      navigate(result.demo && values.role === 'owner' ? '/owner' : '/search', { replace: true })
    } catch (error) {
      toast.error(error.message || 'Inscription impossible.')
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
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
          <option value="owner">Propriétaire de louage</option>
        </Input>
        <Button type="submit" size="lg" loading={isSubmitting}>
          {isSubmitting ? 'Création...' : "S'inscrire"}
        </Button>
      </form>

      {isDemoMode() && (
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-secondary/15 p-3 text-xs text-amber-700 dark:text-amber-400">
          <Info size={14} className="mt-0.5 shrink-0" />
          Mode démo : le compte est stocké localement dans ce navigateur.
        </p>
      )}
    </>
  )
}
