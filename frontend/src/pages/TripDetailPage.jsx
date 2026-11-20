import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import { ArrowLeft, Clock, MapPin, Phone, Star, Users } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { BottomSheet } from '../components/ui/BottomSheet'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { Button, buttonClasses } from '../components/ui/Button'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useTrip } from '../features/trips/hooks'
import { useCreateBooking, useMyBookings } from '../features/bookings/hooks'
import { useAuth } from '../features/auth/AuthContext'
import { isDemoMode } from '../lib/api'
import { images } from '../constants/images'
import { bookingStatusLabel, bookingStatusVariant } from '../lib/bookingStatus'

export function TripDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const { user } = useAuth()
  const { data, isLoading } = useTrip(id)
  const { data: myBookings = [] } = useMyBookings()
  const createBooking = useCreateBooking()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [seats, setSeats] = useState(1)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-5">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-40 rounded-3xl" />
      </div>
    )
  }

  const trip = data?.trip
  if (!trip) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <EmptyState
          title="Trajet introuvable"
          description="Ce trajet n'existe plus ou a été supprimé."
          action={
            <Link to="/search" className="text-sm font-medium text-primary">
              Retour à la recherche
            </Link>
          }
        />
      </div>
    )
  }

  const { members } = data
  const vehicle = images.vehicles[trip.vehicle_type] || images.vehicles.louage8
  const maxSeats = Math.max(1, trip.seats_left)
  const activeBooking = myBookings.find(
    (booking) => booking.tripId === id && booking.status !== 'cancelled' && booking.status !== 'refused'
  )

  const openBooking = () => {
    if (!isDemoMode() && !user) {
      toast.info('Connectez-vous pour réserver votre place.')
      navigate('/login', { state: { from: `/trips/${id}` } })
      return
    }
    setSeats(1)
    setSheetOpen(true)
  }

  const confirmBooking = () => {
    createBooking.mutate(
      { trip, seats },
      {
        onSuccess: () => {
          setSheetOpen(false)
          toast.success('Réservation envoyée !', {
            description: `${seats} place${seats > 1 ? 's' : ''} — le propriétaire doit confirmer.`,
          })
        },
        onError: (error) => {
          toast.error(error.message || 'Réservation impossible pour le moment.')
        },
      }
    )
  }

  const BookingContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl bg-primary/10 px-4 py-3">
        <span className="text-sm font-medium">Prix par place</span>
        <span className="text-lg font-bold text-primary">{trip.price} DT</span>
      </div>

      <div>
        <label id="seats-label" htmlFor="seats-value" className="text-sm font-medium">
          Nombre de places
        </label>
        <div role="group" aria-labelledby="seats-label" className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSeats((value) => Math.max(1, value - 1))}
            disabled={seats <= 1}
            aria-label="Retirer une place"
            className="h-10 w-10 rounded-xl border border-border-light text-lg font-semibold disabled:opacity-50 dark:border-border-dark"
          >
            −
          </button>
          <span id="seats-value" aria-live="polite" className="w-8 text-center text-lg font-semibold">
            {seats}
          </span>
          <button
            type="button"
            onClick={() => setSeats((value) => Math.min(maxSeats, value + 1))}
            disabled={seats >= maxSeats}
            aria-label="Ajouter une place"
            className="h-10 w-10 rounded-xl border border-border-light text-lg font-semibold disabled:opacity-50 dark:border-border-dark"
          >
            +
          </button>
          <span className="text-xs text-muted-light dark:text-muted-dark">{maxSeats} max</span>
        </div>
      </div>

      <p className="text-xs text-muted-light dark:text-muted-dark">
        Le paiement se fait en espèces au chauffeur le jour du trajet. Aucun débit en ligne pour le moment.
      </p>

      <Button size="lg" loading={createBooking.isPending} onClick={confirmBooking}>
        Confirmer la réservation · {seats * trip.price} DT
      </Button>
    </div>
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-5">
      <Link to="/search" className="inline-flex items-center gap-1 text-sm text-muted-light hover:text-primary dark:text-muted-dark">
        <ArrowLeft size={16} /> Retour aux résultats
      </Link>

      <div className="mt-4 overflow-hidden rounded-3xl border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark">
        <div className="relative h-48 sm:h-60">
          <img src={vehicle.src} alt={vehicle.alt} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <Badge className="bg-black/40 text-white backdrop-blur">
              Louage
            </Badge>
            <h1 className="mt-2 text-2xl font-bold">
              {trip.from_city} → {trip.to_city}
            </h1>
            <p className="text-sm text-white/85">
              {format(parseISO(trip.departure_date), 'EEEE d MMMM', { locale: fr })} · {trip.departure_time}
            </p>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> {trip.from_city} → {trip.to_city}
            </p>
            <p className="flex items-center gap-2">
              <Clock size={16} className="text-primary" /> Départ à {trip.departure_time}
            </p>
            <p className="flex items-center gap-2">
              <Users size={16} className="text-primary" /> {trip.seats_left} places restantes sur {trip.total_seats}
            </p>
            {trip.owner_rating != null && (
              <p className="flex items-center gap-2">
                <Star size={16} className="text-primary" /> {trip.owner_rating} ({trip.owner_trips} trajets)
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-primary/5 p-4 dark:bg-primary/10">
            <p className="text-xs uppercase tracking-wide text-muted-light dark:text-muted-dark">Propriétaire</p>
            <p className="mt-1 font-semibold">{trip.owner_name}</p>
            <a
              href={`tel:${trip.phone}`}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <Phone size={16} /> Appeler le propriétaire
            </a>
          </div>
        </div>

        <div className="border-t border-border-light p-5 dark:border-border-dark">
          <h2 className="font-semibold">Le groupe</h2>
          {members.length === 0 ? (
            <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
              Personne n'a encore réservé — soyez le premier à rejoindre le groupe.
            </p>
          ) : (
            <>
              <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
                {members.length} étudiant{members.length > 1 ? 's' : ''} ont déjà rejoint ce trajet.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {members.map((member) => (
                  <span
                    key={`${member.name}-${member.seats}`}
                    className="inline-flex items-center gap-2 rounded-full bg-border-light/60 px-3 py-1.5 text-xs font-medium dark:bg-border-dark/60"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                      {member.name.slice(0, 1).toUpperCase()}
                    </span>
                    {member.name}
                    <span className="text-muted-light dark:text-muted-dark">· {member.seats}p</span>
                    {member.status === 'confirmed' && <Badge variant="success">✓</Badge>}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="sticky bottom-16 border-t border-border-light bg-surface-light/95 p-4 backdrop-blur md:bottom-0 dark:border-border-dark dark:bg-surface-dark/95">
          {activeBooking ? (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-light dark:text-muted-dark">Réservation déjà envoyée</span>
              <Badge variant={bookingStatusVariant[activeBooking.status]}>
                {bookingStatusLabel[activeBooking.status]}
              </Badge>
            </div>
          ) : (
            <button
              type="button"
              onClick={openBooking}
              className={buttonClasses({ size: 'lg' })}
            >
              Réserver · {trip.price} DT / place
            </button>
          )}
        </div>
      </div>

      {isMobile ? (
        <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Réserver une place">
          {BookingContent}
        </BottomSheet>
      ) : (
        <Modal open={sheetOpen} onClose={() => setSheetOpen(false)} title="Réserver une place">
          {BookingContent}
        </Modal>
      )}
    </div>
  )
}
