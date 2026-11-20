import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArrowRight, Clock, Phone, Star, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Badge } from '../../../components/ui/Badge'
import { buttonClasses } from '../../../components/ui/Button'
import { SafeImage } from '../../../components/ui/SafeImage'
import { images } from '../../../constants/images'

const vehicleLabels = { louage6: 'Louage 6 places', louage8: 'Louage 8 places', louage12: 'Louage 12 places' }

export function TripCard({ trip }) {
  const vehicleImage = images.vehicles[trip.vehicle_type] || images.vehicles.louage8
  const date = parseISO(trip.departure_date)

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
      className="overflow-hidden rounded-3xl border border-border-light bg-surface-light shadow-card dark:border-border-dark dark:bg-surface-dark"
    >
      <div className="relative h-36 w-full overflow-hidden">
        <SafeImage
          src={vehicleImage.src}
          fallback={vehicleImage.placeholder}
          alt={vehicleImage.alt}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-3 flex items-center gap-2 text-white">
          <Badge className="bg-black/40 text-white backdrop-blur">
            {vehicleLabels[trip.vehicle_type] || 'Louage'}
          </Badge>
          <span className="text-xs font-medium">{format(date, 'EEE d MMM', { locale: fr })}</span>
        </div>
        <span className="absolute bottom-2 right-3 rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
          {trip.price} DT
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span>{trip.from_city}</span>
          <ArrowRight size={18} className="text-primary" />
          <span>{trip.to_city}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-light dark:text-muted-dark">
          <span className="inline-flex items-center gap-1">
            <Clock size={15} /> {trip.departure_time}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={15} /> {trip.seats_left} places restantes
          </span>
          {trip.owner_rating != null && (
            <span className="inline-flex items-center gap-1">
              <Star size={15} className="text-primary" /> {trip.owner_rating} · {trip.owner_name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Link to={`/trips/${trip.id}`} className={buttonClasses({ className: 'flex-1' })}>
            Voir le trajet
          </Link>
          <a
            href={`tel:${trip.phone}`}
            aria-label={`Appeler ${trip.owner_name}`}
            className="rounded-2xl border border-border-light p-2.5 text-primary transition-colors hover:border-primary dark:border-border-dark"
          >
            <Phone size={18} />
          </a>
        </div>
      </div>
    </motion.article>
  )
}
