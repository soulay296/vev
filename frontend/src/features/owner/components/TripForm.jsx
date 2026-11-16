import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { cities } from '../../../constants/cities'

const schema = z
  .object({
    from_city: z.string().min(1, 'Choisissez une ville de départ'),
    to_city: z.string().min(1, "Choisissez une ville d'arrivée"),
    departure_date: z.string().min(1, 'Choisissez une date'),
    departure_time: z.string().regex(/^\d{2}:\d{2}$/, 'Heure au format HH:MM'),
    price: z.coerce.number().int('Prix entier requis').min(1, 'Prix minimum 1 DT').max(999),
    total_seats: z.coerce.number().int('Nombre entier requis').min(1, 'Au moins 1 place').max(60, 'Maximum 60 places'),
    vehicle_type: z.enum(['bus', 'minibus', 'van']),
    phone: z.string().min(8, 'Numéro invalide (8 chiffres minimum)'),
  })
  .refine((data) => data.from_city !== data.to_city, {
    message: 'Les villes doivent être différentes',
    path: ['to_city'],
  })

export function TripForm({ trip, defaultPhone, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: trip
      ? {
          from_city: trip.from_city,
          to_city: trip.to_city,
          departure_date: trip.departure_date,
          departure_time: trip.departure_time,
          price: trip.price,
          total_seats: trip.total_seats,
          vehicle_type: trip.vehicle_type,
          phone: trip.phone,
        }
      : {
          from_city: '',
          to_city: '',
          departure_date: format(new Date(), 'yyyy-MM-dd'),
          departure_time: '',
          price: 10,
          total_seats: 12,
          vehicle_type: 'minibus',
          phone: defaultPhone || '',
        },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
        <Input label="Heure de départ" type="time" error={errors.departure_time?.message} {...register('departure_time')} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Prix par place (DT)" type="number" error={errors.price?.message} {...register('price')} />
        <Input label="Places totales" type="number" error={errors.total_seats?.message} {...register('total_seats')} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Type de véhicule" as="select" error={errors.vehicle_type?.message} {...register('vehicle_type')}>
          <option value="minibus">Louage 8 places</option>
          <option value="bus">Louage 12 places</option>
          <option value="van">Louage 6 places</option>
        </Input>
        <Input
          label="Téléphone de contact"
          type="tel"
          placeholder="+216 ..."
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <Button type="submit" size="lg" loading={submitting} className="mt-2">
        {trip ? 'Enregistrer les modifications' : 'Publier le trajet'}
      </Button>
    </form>
  )
}
