import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Phone, Trash2 } from 'lucide-react'
import { Badge } from '../../../components/ui/Badge'
import { buttonClasses } from '../../../components/ui/Button'
import { bookingStatusLabel, bookingStatusVariant } from '../../../lib/bookingStatus'

export function BookingCard({ booking, onCancel }) {
  const { trip } = booking
  if (!trip) return null
  const cancellable = booking.status === 'pending' || booking.status === 'confirmed'

  return (
    <article className="rounded-3xl border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">
            {trip.from_city} → {trip.to_city}
          </p>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
            {format(parseISO(trip.departure_date), 'EEEE d MMMM', { locale: fr })} · {trip.departure_time}
          </p>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
            {booking.seats} place{booking.seats > 1 ? 's' : ''} · {trip.price * booking.seats} DT
          </p>
        </div>
        <Badge variant={bookingStatusVariant[booking.status]}>{bookingStatusLabel[booking.status]}</Badge>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link to={`/trips/${trip.id}`} className={buttonClasses({ variant: 'outline', size: 'sm', className: 'flex-1' })}>
          Voir le trajet
        </Link>
        <a
          href={`tel:${trip.phone}`}
          aria-label="Appeler le propriétaire"
          className="rounded-xl border border-border-light p-2 text-primary transition-colors hover:border-primary dark:border-border-dark"
        >
          <Phone size={18} />
        </a>
        {cancellable && (
          <button
            type="button"
            onClick={() => onCancel(booking)}
            aria-label="Annuler la réservation"
            className="rounded-xl border border-border-light p-2 text-red-600 transition-colors hover:border-red-400 dark:border-border-dark dark:text-red-400"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </article>
  )
}
