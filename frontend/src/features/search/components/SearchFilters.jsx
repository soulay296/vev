const vehicles = [
  { value: 'all', label: 'Tous' },
  { value: 'bus', label: 'Bus' },
  { value: 'minibus', label: 'Minibus' },
  { value: 'van', label: 'Van' },
]

const sorts = [
  { value: 'time', label: 'Heure de départ' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Note du propriétaire' },
]

export function SearchFilters({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Type de véhicule">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.value}
            type="button"
            aria-pressed={value.vehicle_type === vehicle.value}
            onClick={() => onChange((current) => ({ ...current, vehicle_type: vehicle.value }))}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              value.vehicle_type === vehicle.value
                ? 'bg-primary text-white'
                : 'border border-border-light text-muted-light hover:border-primary hover:text-primary dark:border-border-dark dark:text-muted-dark'
            }`}
          >
            {vehicle.label}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-light dark:text-muted-dark">
        Trier par
        <select
          value={value.sort}
          onChange={(event) => onChange((current) => ({ ...current, sort: event.target.value }))}
          className="rounded-xl border border-border-light bg-surface-light px-3 py-2 text-sm text-text-light outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
        >
          {sorts.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
