const STORAGE_KEY = 'vev-demo-bookings'

export function getDemoBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function notify() {
  window.dispatchEvent(new Event('vev-bookings'))
}

export function saveDemoBooking(booking) {
  const all = getDemoBookings()
  if (all.some((item) => item.tripId === booking.tripId)) return all
  const next = [booking, ...all]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  notify()
  return next
}

export function cancelDemoBooking(id) {
  const next = getDemoBookings().filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  notify()
  return next
}

export function isTripBooked(tripId) {
  return getDemoBookings().some((item) => item.tripId === tripId)
}
