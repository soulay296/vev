import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch, isDemoMode, markDemoMode } from '../../lib/api'
import { cancelDemoBooking, getDemoBookings, saveDemoBooking } from '../../lib/demoBookings'
import { findDemoTrip } from '../../lib/demoTrips'
import { useAuth } from '../auth/AuthContext'

function withDemoTrip(booking) {
  return { ...booking, trip: findDemoTrip(booking.tripId) }
}

export function useMyBookings() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['bookings', 'mine'],
    enabled: isDemoMode() || !!user,
    queryFn: async () => {
      if (isDemoMode()) return getDemoBookings().map(withDemoTrip)
      try {
        return (await apiFetch('/bookings/mine')).bookings
      } catch (error) {
        if (error.status === 0) {
          markDemoMode()
          return getDemoBookings().map(withDemoTrip)
        }
        throw error
      }
    },
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: async ({ trip, seats }) => {
      if (isDemoMode()) {
        const created = saveDemoBooking({ tripId: trip.id, seats, name: user?.first_name })
        if (!created) throw new Error('Vous avez déjà une réservation active pour ce trajet.')
        return null
      }
      return apiFetch('/bookings', { method: 'POST', body: { trip_id: Number(trip.id), seats } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trip'] })
    },
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (booking) => {
      if (isDemoMode()) {
        cancelDemoBooking(booking.id)
        return null
      }
      return apiFetch(`/bookings/${booking.id}`, { method: 'PATCH', body: { status: 'cancelled' } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trip'] })
    },
  })
}
