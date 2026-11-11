const STORAGE_KEY = 'vev-demo-bookings'

export function getDemoBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persist(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  window.dispatchEvent(new Event('vev-bookings'))
}

function isActive(booking) {
  return booking.status === 'pending' || booking.status === 'confirmed'
}

export function saveDemoBooking({ tripId, seats, name }) {
  const all = getDemoBookings()
  if (all.some((booking) => booking.tripId === tripId && isActive(booking))) return false
  persist([
    {
      id: crypto.randomUUID(),
      tripId,
      seats,
      name: name || 'Vous',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    ...all,
  ])
  return true
}

export function cancelDemoBooking(id) {
  persist(getDemoBookings().map((booking) => (booking.id === id ? { ...booking, status: 'cancelled' } : booking)))
}

export function updateDemoBookingStatus(id, status) {
  persist(getDemoBookings().map((booking) => (booking.id === id ? { ...booking, status } : booking)))
}
