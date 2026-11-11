import { addDays, format } from 'date-fns'
import { getDemoBookings } from './demoBookings'

const day = (offset) => format(addDays(new Date(), offset), 'yyyy-MM-dd')

const OWNER_TRIPS_KEY = 'vev-demo-owner-trips'

export const baseDemoTrips = [
  {
    id: 'demo-1',
    from_city: 'Tunis',
    to_city: 'Sousse',
    departure_date: day(1),
    departure_time: '14:00',
    price: 12,
    total_seats: 15,
    seats_left: 6,
    vehicle_type: 'minibus',
    owner_name: 'Ahmed Ben Ali',
    owner_rating: 4.8,
    owner_trips: 42,
    phone: '+21620123456',
  },
  {
    id: 'demo-2',
    from_city: 'Tunis',
    to_city: 'Sfax',
    departure_date: day(1),
    departure_time: '16:30',
    price: 18,
    total_seats: 22,
    seats_left: 11,
    vehicle_type: 'bus',
    owner_name: 'Sami Trabelsi',
    owner_rating: 4.5,
    owner_trips: 118,
    phone: '+21620987654',
  },
  {
    id: 'demo-3',
    from_city: 'Sousse',
    to_city: 'Monastir',
    departure_date: day(2),
    departure_time: '08:00',
    price: 5,
    total_seats: 8,
    seats_left: 2,
    vehicle_type: 'van',
    owner_name: 'Nizar Gharbi',
    owner_rating: 4.9,
    owner_trips: 67,
    phone: '+21622111222',
  },
  {
    id: 'demo-4',
    from_city: 'Tunis',
    to_city: 'Bizerte',
    departure_date: day(2),
    departure_time: '10:15',
    price: 7,
    total_seats: 14,
    seats_left: 9,
    vehicle_type: 'minibus',
    owner_name: 'Hatem Mansouri',
    owner_rating: 4.2,
    owner_trips: 21,
    phone: '+21623333444',
  },
]

export function getDemoOwnerTrips() {
  try {
    return JSON.parse(localStorage.getItem(OWNER_TRIPS_KEY)) || []
  } catch {
    return []
  }
}

export function saveDemoOwnerTrip(trip) {
  const all = getDemoOwnerTrips()
  const record = {
    owner_rating: null,
    owner_trips: all.length,
    ...trip,
    id: trip.id || `local-${crypto.randomUUID()}`,
  }
  const next = trip.id ? all.map((item) => (item.id === trip.id ? record : item)) : [record, ...all]
  localStorage.setItem(OWNER_TRIPS_KEY, JSON.stringify(next))
  return record
}

export function deleteDemoOwnerTrip(id) {
  localStorage.setItem(OWNER_TRIPS_KEY, JSON.stringify(getDemoOwnerTrips().filter((item) => item.id !== id)))
}

function withSeatsLeft(trip) {
  const taken = getDemoBookings()
    .filter((booking) => booking.tripId === trip.id && (booking.status === 'pending' || booking.status === 'confirmed'))
    .reduce((sum, booking) => sum + booking.seats, 0)
  return { ...trip, seats_left: Math.max(0, trip.total_seats - taken) }
}

export function getDemoTrips() {
  return [...getDemoOwnerTrips(), ...baseDemoTrips].map(withSeatsLeft)
}

export function getMyDemoTrips() {
  return getDemoTrips().filter((trip) => trip.id.startsWith('local-'))
}

export function findDemoTrip(id) {
  return getDemoTrips().find((trip) => trip.id === id) || null
}

export function getDemoTripMembers(id) {
  return getDemoBookings()
    .filter((booking) => booking.tripId === id && booking.status !== 'cancelled' && booking.status !== 'refused')
    .map((booking) => ({ name: booking.name, seats: booking.seats, status: booking.status }))
}
