import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { CalendarPlus, Car, Phone, Ticket, TrendingUp } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'
import { Badge } from '../components/ui/Badge'
import { Button, buttonClasses } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { BottomSheet } from '../components/ui/BottomSheet'
import { Skeleton } from '../components/ui/Skeleton'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useAuth } from '../features/auth/AuthContext'
import { useDeleteTrip, useMyTrips, useReceivedBookings, useSaveTrip, useUpdateBookingStatus } from '../features/owner/hooks'
import { TripForm } from '../features/owner/components/TripForm'
import { OwnerTripCard } from '../features/owner/components/OwnerTripCard'
import { IncomingBookingCard } from '../features/owner/components/IncomingBookingCard'
import { isDemoMode } from '../lib/api'

export function OwnerPage() {
  const { user } = useAuth()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const { data: myTrips = [], isLoading } = useMyTrips()
  const { data: received = [] } = useReceivedBookings()
  const saveTrip = useSaveTrip()
  const deleteTrip = useDeleteTrip()
  const updateStatus = useUpdateBookingStatus()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  if (!isDemoMode() && user && user.role !== 'owner') {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <EmptyState
          title="Compte étudiant"
          description="L'espace propriétaire est réservé aux comptes propriétaires de transport. Créez un compte propriétaire pour publier vos trajets."
          action={
            <Link to="/search" className={buttonClasses()}>
              Chercher un trajet
            </Link>
          }
        />
      </div>
    )
  }

  const activeBookings = received.filter((booking) => booking.status !== 'cancelled' && booking.status !== 'refused')
  const revenue = activeBookings
    .filter((booking) => booking.status === 'confirmed')
    .reduce((sum, booking) => sum + booking.seats * (booking.trip?.price || 0), 0)

  const stats = [
    { label: 'Trajets publiés', value: String(myTrips.length), icon: Car },
    { label: 'Réservations', value: String(activeBookings.length), icon: Ticket },
    { label: 'Revenus confirmés', value: `${revenue} DT`, icon: TrendingUp },
  ]

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (trip) => {
    setEditing(trip)
    setFormOpen(true)
  }

  const handleSubmit = (values) => {
    saveTrip.mutate(
      { ...values, id: editing?.id },
      {
        onSuccess: () => {
          setFormOpen(false)
          toast.success(editing ? 'Trajet mis à jour.' : 'Trajet publié !')
        },
        onError: (error) => toast.error(error.message || 'Enregistrement impossible.'),
      }
    )
  }

  const handleDelete = (trip) => {
    deleteTrip.mutate(trip, {
      onSuccess: () => toast.success('Trajet supprimé.'),
      onError: (error) => toast.error(error.message || 'Suppression impossible.'),
    })
  }

  const handleStatus = (booking, status) => {
    updateStatus.mutate(
      { booking, status },
      {
        onSuccess: () =>
          toast.success(status === 'confirmed' ? 'Réservation confirmée.' : 'Réservation refusée.'),
        onError: (error) => toast.error(error.message || 'Action impossible.'),
      }
    )
  }

  const FormDialog = isMobile ? BottomSheet : Modal

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Espace propriétaire</h1>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
            Publiez vos trajets et gérez les réservations.
          </p>
        </div>
        <Button onClick={openCreate}>
          <CalendarPlus size={18} /> Ajouter un trajet
        </Button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-3xl border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={18} />
            </span>
            <p className="mt-3 text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-light dark:text-muted-dark">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Mes trajets</h2>
        {isDemoMode() && <Badge variant="warning">Démo</Badge>}
      </div>

      <div className="mt-3 space-y-3">
        {isLoading ? (
          <Skeleton className="h-28 rounded-3xl" />
        ) : myTrips.length === 0 ? (
          <EmptyState
            title="Aucun trajet publié"
            description="Ajoutez votre premier trajet : départ, arrivée, horaire, prix, places et numéro de téléphone."
            action={
              <Button onClick={openCreate}>Publier un trajet</Button>
            }
          />
        ) : (
          myTrips.map((trip) => (
            <OwnerTripCard key={trip.id} trip={trip} onEdit={openEdit} onDelete={handleDelete} />
          ))
        )}
      </div>

      <h2 className="mt-8 text-lg font-semibold">Réservations reçues</h2>
      <div className="mt-3 space-y-3">
        {received.length === 0 ? (
          <EmptyState
            title="Aucune réservation reçue"
            description="Les demandes des étudiants apparaîtront ici pour confirmation ou refus."
          />
        ) : (
          received.map((booking) => (
            <IncomingBookingCard
              key={booking.id}
              booking={booking}
              onStatus={(status) => handleStatus(booking, status)}
            />
          ))
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-border-light p-4 text-sm text-muted-light dark:border-border-dark dark:text-muted-dark">
        <p className="flex items-center gap-2 font-medium text-text-light dark:text-text-dark">
          <Phone size={16} className="text-primary" /> Paiement en espèces
        </p>
        <p className="mt-1">
          Les étudiants paient directement le chauffeur. Le paiement en ligne sera ajouté plus tard sans changer le
          parcours de réservation.
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-muted-light dark:text-muted-dark">
        Vous êtes étudiant ?{' '}
        <Link to="/search" className="font-medium text-primary">
          Chercher un trajet
        </Link>
      </p>

      <FormDialog open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Modifier le trajet' : 'Publier un trajet'}>
        <TripForm
          trip={editing}
          defaultPhone={user?.phone}
          onSubmit={handleSubmit}
          submitting={saveTrip.isPending}
        />
      </FormDialog>
    </div>
  )
}
