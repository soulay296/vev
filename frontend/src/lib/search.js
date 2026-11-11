export function filterTrips(trips, filters = {}) {
  return trips.filter((trip) => {
    if (filters.from_city && trip.from_city !== filters.from_city) return false
    if (filters.to_city && trip.to_city !== filters.to_city) return false
    if (filters.departure_date && trip.departure_date < filters.departure_date) return false
    if (filters.departure_time && trip.departure_time < filters.departure_time) return false
    if (filters.vehicle_type && filters.vehicle_type !== 'all' && trip.vehicle_type !== filters.vehicle_type) {
      return false
    }
    return true
  })
}

export function sortTrips(trips, sort = 'time') {
  const list = [...trips]
  switch (sort) {
    case 'price_asc':
      return list.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return list.sort((a, b) => b.price - a.price)
    case 'rating':
      return list.sort((a, b) => (b.owner_rating ?? 0) - (a.owner_rating ?? 0))
    default:
      return list.sort((a, b) =>
        `${a.departure_date} ${a.departure_time}`.localeCompare(`${b.departure_date} ${b.departure_time}`)
      )
  }
}
