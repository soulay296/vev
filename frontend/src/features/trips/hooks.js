import { useQuery } from '@tanstack/react-query'
import { apiFetch, isDemoMode, markDemoMode } from '../../lib/api'
import { getDemoTripMembers, getDemoTrips, findDemoTrip } from '../../lib/demoTrips'

async function fetchTrips(filters) {
  const params = new URLSearchParams()
  for (const key of ['from_city', 'to_city', 'departure_date', 'departure_time', 'vehicle_type']) {
    if (filters[key]) params.set(key, filters[key])
  }
  const data = await apiFetch(`/trips?${params.toString()}`)
  return data.trips
}

export function useTrips(filters = {}) {
  return useQuery({
    queryKey: ['trips', filters],
    queryFn: async () => {
      if (isDemoMode()) return getDemoTrips()
      try {
        return await fetchTrips(filters)
      } catch (error) {
        if (error.status === 0) {
          markDemoMode()
          return getDemoTrips()
        }
        throw error
      }
    },
  })
}

export function useTrip(id) {
  return useQuery({
    queryKey: ['trip', id],
    enabled: !!id,
    retry: false,
    queryFn: async () => {
      if (isDemoMode()) {
        const trip = findDemoTrip(id)
        if (!trip) throw new Error('Trajet introuvable')
        return { trip, members: getDemoTripMembers(id) }
      }
      try {
        return await apiFetch(`/trips/${id}`)
      } catch (error) {
        if (error.status === 0) {
          markDemoMode()
          const trip = findDemoTrip(id)
          if (trip) return { trip, members: getDemoTripMembers(id) }
        }
        throw error
      }
    },
  })
}
