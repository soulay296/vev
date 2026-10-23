import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Phone, Users } from 'lucide-react'
import { SearchForm } from '../features/search/components/SearchForm'
import { images } from '../constants/images'
import { texts } from '../constants/texts'

const steps = [
  { icon: MapPin, title: 'Cherchez', text: 'Votre ville de départ, votre destination et la date.' },
  { icon: Users, title: 'Rejoignez le groupe', text: 'Réservez votre place et retrouvez les autres étudiants.' },
  { icon: Phone, title: 'Appelez le chauffeur', text: 'Le paiement se fait en espèces le jour du trajet.' },
]

const popularRoutes = [
  { from: 'Tunis', to: 'Sousse' },
  { from: 'Tunis', to: 'Sfax' },
  { from: 'Sousse', to: 'Monastir' },
  { from: 'Tunis', to: 'Bizerte' },
]

export function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-5xl px-4 py-6">
      <section className="relative overflow-hidden rounded-3xl">
        <img
          src={images.hero.src}
          alt={images.hero.alt}
          className="h-64 w-full object-cover sm:h-80"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
          <h1 className="max-w-lg text-2xl font-bold leading-tight sm:text-4xl">
            Votre trajet collectif, simplement.
          </h1>
          <p className="mt-2 max-w-md text-sm text-white/85 sm:text-base">
            {texts.tagline} — bus, minibus et vans entre étudiants.
          </p>
        </div>
      </section>

      <div className="-mt-6 px-2 sm:-mt-8">
        <SearchForm />
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Comment ça marche</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.25 }}
              className="rounded-3xl border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon size={20} />
              </span>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Trajets populaires</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {popularRoutes.map((route) => (
            <Link
              key={`${route.from}-${route.to}`}
              to={`/search?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}`}
              className="rounded-full border border-border-light px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary dark:border-border-dark"
            >
              {route.from} → {route.to}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl bg-primary/10 p-5 dark:bg-primary/15">
        <h2 className="text-lg font-semibold">Vous êtes propriétaire d'un n9l jeme3i ?</h2>
        <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
          Publiez vos trajets et gérez les réservations des étudiants.
        </p>
        <Link
          to="/owner"
          className="mt-4 inline-flex rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary"
        >
          Ouvrir l'espace propriétaire
        </Link>
      </section>
    </motion.div>
  )
}
