import { Link } from 'react-router-dom'
import { Ticket } from 'lucide-react'
import { toast } from 'sonner'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { buttonClasses } from '../components/ui/Button'
import { BookingCard } from '../features/bookings/components/BookingCard'
import { useCancelBooking, useMyBookings } from '../features/bookings/hooks'
import { useAuth } from '../features/auth/AuthContext'
import { isDemoMode } from '../lib/api'

export function BookingsPage() {
  const { user } = useAuth()
  const { data: bookings = [], isLoading } = useMyBookings()
  const cancelBooking = useCancelBooking()

  const handleCancel = (booking) => {
    cancelBooking.mutate(booking, {
      onSuccess: () => toast.success('Réservation annulée', { description: 'Votre place a été libérée.' }),
      onError: (error) => toast.error(error.message || 'Annulation impossible.'),
    })
  }

  if (!isDemoMode() && !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center gap-2">
          <Ticket size={22} className="text-primary" />
          <h1 className="text-2xl font-bold">Mes réservations</h1>
        </div>
        <div className="mt-6">
          <EmptyState
            title="Connectez-vous"
            description="Vos réservations sont liées à votre compte. Connectez-vous pour les retrouver."
            action={
              <Link to="/login" className={buttonClasses()}>
                Se connecter
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center gap-2">
        <Ticket size={22} className="text-primary" />
        <h1 className="text-2xl font-bold">Mes réservations</h1>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </>
        ) : bookings.length === 0 ? (
          <EmptyState
            title="Aucune réservation pour le moment"
            description="Cherchez un trajet collectif et réservez votre place en quelques secondes."
            action={
              <Link to="/search" className={buttonClasses()}>
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

      {isDemoMode() && (
        <p className="mt-6 text-center text-xs text-muted-light dark:text-muted-dark">
          Les réservations sont stockées localement en attendant la connexion au serveur.
        </p>
      )}
    </div>
  )
}
