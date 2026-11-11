import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Check, Users, X } from 'lucide-react'
import { Badge } from '../../../components/ui/Badge'
import { buttonClasses } from '../../../components/ui/Button'
import { bookingStatusLabel, bookingStatusVariant } from '../../../lib/bookingStatus'

export function IncomingBookingCard({ booking, onStatus }) {
  const { trip } = booking
  if (!trip) return null

  return (
    <article className="rounded-3xl border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">
            <Users size={14} className="mr-1 inline text-primary" />
            {booking.student_name || booking.name || 'Étudiant'}
          </p>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
            {trip.from_city} → {trip.to_city}
          </p>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
            {format(parseISO(trip.departure_date), 'EEE d MMM', { locale: fr })} · {trip.departure_time}
          </p>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
            {booking.seats} place{booking.seats > 1 ? 's' : ''} · {trip.price * booking.seats} DT
          </p>
        </div>
        <Badge variant={bookingStatusVariant[booking.status]}>{bookingStatusLabel[booking.status]}</Badge>
      </div>

      {booking.status === 'pending' && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onStatus('confirmed')}
            className={buttonClasses({ size: 'sm' })}
          >
            <Check size={14} /> Confirmer
          </button>
          <button
            type="button"
            onClick={() => onStatus('refused')}
            className={buttonClasses({ variant: 'danger', size: 'sm' })}
          >
            <X size={14} /> Refuser
          </button>
        </div>
      )}
    </article>
  )
}
