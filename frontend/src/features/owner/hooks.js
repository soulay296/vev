import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch, isDemoMode, markDemoMode } from '../../lib/api'
import {
  deleteDemoOwnerTrip,
  findDemoTrip,
  getDemoBookings,
  getMyDemoTrips,
  saveDemoOwnerTrip,
} from '../../lib/demoTrips'
import { updateDemoBookingStatus } from '../../lib/demoBookings'
import { useAuth } from '../auth/AuthContext'

function withDemoTrip(booking) {
  return { ...booking, trip: findDemoTrip(booking.tripId) }
}

export function useMyTrips() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['my-trips'],
    enabled: isDemoMode() || !!user,
    queryFn: async () => {
      if (isDemoMode()) return getMyDemoTrips()
      try {
        return (await apiFetch('/trips/mine')).trips
      } catch (error) {
        if (error.status === 0) {
          markDemoMode()
          return getMyDemoTrips()
        }
        throw error
      }
    },
  })
}

export function useSaveTrip() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: async (trip) => {
      if (isDemoMode()) {
        return saveDemoOwnerTrip({
          ...trip,
          price: Number(trip.price),
          total_seats: Number(trip.total_seats),
          owner_name: `${user?.first_name || 'Propriétaire'} ${user?.last_name || '(démo)'}`.trim(),
        })
      }
      const payload = {
        from_city: trip.from_city,
        to_city: trip.to_city,
        departure_date: trip.departure_date,
        departure_time: trip.departure_time,
        price: Number(trip.price),
        total_seats: Number(trip.total_seats),
        vehicle_type: trip.vehicle_type,
        phone: trip.phone,
      }
      if (trip.id) return apiFetch(`/trips/${trip.id}`, { method: 'PUT', body: payload })
      return apiFetch('/trips', { method: 'POST', body: payload })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-trips'] })
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}

export function useDeleteTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (trip) => {
      if (isDemoMode()) {
        deleteDemoOwnerTrip(trip.id)
        return null
      }
      return apiFetch(`/trips/${trip.id}`, { method: 'DELETE' })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-trips'] })
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}

export function useReceivedBookings() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['received-bookings'],
    enabled: isDemoMode() || !!user,
    queryFn: async () => {
      if (isDemoMode()) return getDemoBookings().map(withDemoTrip)
      try {
        return (await apiFetch('/bookings/received')).bookings
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

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ booking, status }) => {
      if (isDemoMode()) {
        updateDemoBookingStatus(booking.id, status)
        return null
      }
      return apiFetch(`/bookings/${booking.id}`, { method: 'PATCH', body: { status } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['received-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trip'] })
    },
  })
}
