import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Clock, Pencil, Users } from 'lucide-react'
import { useState } from 'react'
import { buttonClasses } from '../../../components/ui/Button'

export function OwnerTripCard({ trip, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const date = parseISO(trip.departure_date)

  return (
    <article className="rounded-3xl border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">
            {trip.from_city} → {trip.to_city}
          </p>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
            {format(date, 'EEEE d MMMM', { locale: fr })} · <Clock size={13} className="inline" /> {trip.departure_time}
          </p>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
            {trip.price} DT / place · <Users size={13} className="inline" /> {trip.seats_left} restantes sur{' '}
            {trip.total_seats}
          </p>
        </div>
        <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">{trip.price} DT</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link to={`/trips/${trip.id}`} className={buttonClasses({ variant: 'outline', size: 'sm' })}>
          Voir
        </Link>
        <button type="button" onClick={() => onEdit(trip)} className={buttonClasses({ variant: 'outline', size: 'sm' })}>
          <Pencil size={14} /> Modifier
        </button>
        {confirming ? (
          <button
            type="button"
            onClick={() => onDelete(trip)}
            className={buttonClasses({ variant: 'danger', size: 'sm' })}
          >
            Confirmer la suppression ?
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label="Supprimer le trajet"
            className={buttonClasses({ variant: 'danger', size: 'sm' })}
          >
            Supprimer
          </button>
        )}
      </div>
    </article>
  )
}
