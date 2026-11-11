import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { SearchForm } from '../features/search/components/SearchForm'
import { SearchFilters } from '../features/search/components/SearchFilters'
import { TripCard } from '../features/trips/components/TripCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { Badge } from '../components/ui/Badge'
import { useTrips } from '../features/trips/hooks'
import { filterTrips, sortTrips } from '../lib/search'
import { isDemoMode } from '../lib/api'

const emptyFilters = {
  from_city: '',
  to_city: '',
  departure_date: '',
  departure_time: '',
  vehicle_type: 'all',
  sort: 'time',
}

function TripCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark">
      <Skeleton className="h-36 rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState(emptyFilters)

  useEffect(() => {
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const date = searchParams.get('departure_date')
    const time = searchParams.get('departure_time')
    if (from || to) {
      setFilters((current) => ({
        ...current,
        from_city: from || '',
        to_city: to || '',
        departure_date: date || '',
        departure_time: time || '',
      }))
    }
  }, [searchParams])

  const { data, isLoading } = useTrips({
    from_city: filters.from_city,
    to_city: filters.to_city,
    departure_date: filters.departure_date,
    departure_time: filters.departure_time,
    vehicle_type: filters.vehicle_type === 'all' ? '' : filters.vehicle_type,
  })

  const trips = sortTrips(filterTrips(data || [], filters), filters.sort)
  const hasCriteria =
    filters.from_city || filters.to_city || filters.departure_date || filters.departure_time || filters.vehicle_type !== 'all'

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold">Rechercher un trajet</h1>
      <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
        Trouvez un bus, minibus ou van pour votre prochain déplacement.
      </p>

      <div className="mt-4">
        <SearchForm defaultValues={filters} onSearch={(values) => setFilters((current) => ({ ...current, ...values }))} />
      </div>

      <div className="mt-6">
        <SearchFilters value={filters} onChange={setFilters} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {trips.length} trajet{trips.length > 1 ? 's' : ''} trouvé{trips.length > 1 ? 's' : ''}
        </h2>
        {isDemoMode() && <Badge variant="warning">Données de démonstration</Badge>}
      </div>

      <div className="mt-4 space-y-4">
        {isLoading ? (
          <>
            <TripCardSkeleton />
            <TripCardSkeleton />
          </>
        ) : trips.length === 0 ? (
          <EmptyState
            title={hasCriteria ? 'Aucun trajet pour ces critères' : 'Aucun trajet disponible'}
            description="Essayez une autre date ou une autre ville de destination."
          />
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="space-y-4"
          >
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </motion.div>
        )}
      </div>

      {isDemoMode() && (
        <p className="mt-6 text-center text-xs text-muted-light dark:text-muted-dark">
          Exemples affichés en attendant la connexion à la base de données · {format(new Date(), 'dd/MM/yyyy')}
        </p>
      )}
    </div>
  )
}
