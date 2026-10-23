import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import { Phone, Ticket, Trash2 } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'
import { Badge } from '../components/ui/Badge'
import { cancelDemoBooking, getDemoBookings } from '../lib/demoBookings'

function BookingCard({ booking, onCancel }) {
  const { trip } = booking
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
        <Badge variant="warning">En attente</Badge>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link
          to={`/trips/${trip.id}`}
          className="flex-1 rounded-xl border border-border-light px-3 py-2 text-center text-sm font-medium transition-colors hover:border-primary hover:text-primary dark:border-border-dark"
        >
          Voir le trajet
        </Link>
        <a
          href={`tel:${trip.phone}`}
          aria-label="Appeler le propriétaire"
          className="rounded-xl border border-border-light p-2 text-primary dark:border-border-dark"
        >
          <Phone size={18} />
        </a>
        <button
          type="button"
          onClick={() => onCancel(booking.id)}
          aria-label="Annuler la réservation"
          className="rounded-xl border border-border-light p-2 text-red-500 transition-colors hover:border-red-400 dark:border-border-dark"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  )
}

export function BookingsPage() {
  const [bookings, setBookings] = useState(getDemoBookings)

  useEffect(() => {
    const sync = () => setBookings(getDemoBookings())
    window.addEventListener('vev-bookings', sync)
    return () => window.removeEventListener('vev-bookings', sync)
  }, [])

  const handleCancel = (id) => {
    cancelDemoBooking(id)
    toast.success('Réservation annulée', { description: 'Votre place a été libérée.' })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center gap-2">
        <Ticket size={22} className="text-primary" />
        <h1 className="text-2xl font-bold">Mes réservations</h1>
      </div>

      <div className="mt-6 space-y-4">
        {bookings.length === 0 ? (
          <EmptyState
            title="Aucune réservation pour le moment"
            description="Cherchez un trajet collectif et réservez votre place en quelques secondes."
            action={
              <Link
                to="/search"
                className="inline-flex rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary"
              >
                Rechercher un trajet
              </Link>
            }
          />
        ) : (
          bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
          ))
        )}
      </div>

      <p className="mt-6 text-center text-xs text-muted-light dark:text-muted-dark">
        Les réservations sont stockées localement en attendant la connexion au serveur.
      </p>
    </div>
  )
}
