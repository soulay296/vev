import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftRight, Search } from 'lucide-react'
import { Input } from '../../../components/ui/Input'
import { cities } from '../../../constants/cities'

const schema = z
  .object({
    from_city: z.string().min(1, 'Choisissez une ville de départ'),
    to_city: z.string().min(1, "Choisissez une ville d'arrivée"),
    departure_date: z.string().min(1, 'Choisissez une date'),
    departure_time: z.string().optional(),
  })
  .refine((data) => data.from_city !== data.to_city, {
    message: 'Les villes doivent être différentes',
    path: ['to_city'],
  })

export function SearchForm({ defaultValues, onSearch, compact = false }) {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      from_city: defaultValues?.from_city || '',
      to_city: defaultValues?.to_city || '',
      departure_date: defaultValues?.departure_date || format(new Date(), 'yyyy-MM-dd'),
      departure_time: defaultValues?.departure_time || '',
    },
  })

  const swapCities = () => {
    const { from_city, to_city } = getValues()
    setValue('from_city', to_city, { shouldValidate: true })
    setValue('to_city', from_city, { shouldValidate: true })
  }

  const submit = (values) => {
    if (onSearch) {
      onSearch(values)
      return
    }
    const params = new URLSearchParams(values)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className={`space-y-3 rounded-3xl border border-border-light bg-surface-light p-4 shadow-card dark:border-border-dark dark:bg-surface-dark ${compact ? '' : 'sm:p-5'}`}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Départ" as="select" error={errors.from_city?.message} {...register('from_city')}>
          <option value="">Ville de départ</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Input>
        <Input label="Arrivée" as="select" error={errors.to_city?.message} {...register('to_city')}>
          <option value="">Ville d'arrivée</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Input>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Date"
          type="date"
          error={errors.departure_date?.message}
          min={format(new Date(), 'yyyy-MM-dd')}
          {...register('departure_date')}
        />
        <Input label="Heure (optionnel)" type="time" error={errors.departure_time?.message} {...register('departure_time')} />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={swapCities}
          aria-label="Inverser départ et arrivée"
          className="rounded-2xl border border-border-light p-3 text-muted-light transition-colors hover:text-primary dark:border-border-dark dark:text-muted-dark"
        >
          <ArrowLeftRight size={18} />
        </button>
        <button
          type="submit"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-secondary"
        >
          <Search size={18} />
          Rechercher un trajet
        </button>
      </div>
    </form>
  )
}
