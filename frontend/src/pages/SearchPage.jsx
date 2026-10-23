import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { SearchForm } from '../features/search/components/SearchForm'
import { TripCard } from '../features/trips/components/TripCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { Badge } from '../components/ui/Badge'
import { demoTrips } from '../constants/demoTrips'

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
  const [filters, setFilters] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const date = searchParams.get('departure_date')
    const time = searchParams.get('departure_time')
    if (from || to) {
      setFilters({ from_city: from || '', to_city: to || '', departure_date: date || '', departure_time: time || '' })
    }
  }, [searchParams])

  const results = useMemo(() => {
    if (!filters) return demoTrips
    return demoTrips.filter((trip) => {
      const matchFrom = !filters.from_city || trip.from_city === filters.from_city
      const matchTo = !filters.to_city || trip.to_city === filters.to_city
      const matchDate = !filters.departure_date || trip.departure_date >= filters.departure_date
      const matchTime = !filters.departure_time || trip.departure_time >= filters.departure_time
      return matchFrom && matchTo && matchDate && matchTime
    })
  }, [filters])

  const handleSearch = (values) => {
    setFilters(values)
    setLoading(true)
    window.setTimeout(() => setLoading(false), 450)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold">Rechercher un trajet</h1>
      <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
        Trouvez un bus, minibus ou van pour votre prochain déplacement.
      </p>

      <div className="mt-4">
        <SearchForm
          defaultValues={filters || undefined}
          onSearch={handleSearch}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {results.length} trajet{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
        </h2>
        <Badge variant="warning">Données de démonstration</Badge>
      </div>

      <div className="mt-4 space-y-4">
        {loading ? (
          <>
            <TripCardSkeleton />
            <TripCardSkeleton />
          </>
        ) : results.length === 0 ? (
          <EmptyState
            title="Aucun trajet pour ces critères"
            description="Essayez une autre date ou une autre ville de destination."
          />
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="space-y-4"
          >
            {results.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </motion.div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-muted-light dark:text-muted-dark">
        Exemples affichés en attendant la connexion à la base de données · {format(new Date(), 'dd/MM/yyyy')}
      </p>
    </div>
  )
}
