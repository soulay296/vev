import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Phone, Users } from 'lucide-react'
import { SearchForm } from '../features/search/components/SearchForm'
import { RegisterForm } from '../features/auth/components/RegisterForm'
import { useAuth } from '../features/auth/AuthContext'
import { buttonClasses } from '../components/ui/Button'
import { texts } from '../constants/texts'

const steps = [
  { icon: MapPin, title: 'Cherchez', text: 'Votre ville de départ, votre destination et la date.' },
  { icon: Users, title: 'Rejoignez le groupe', text: 'Réservez votre place dans le louage avec les autres voyageurs.' },
  { icon: Phone, title: 'Appelez le chauffeur', text: 'Le paiement se fait en espèces le jour du trajet.' },
]

const popularRoutes = [
  { from: 'Tunis', to: 'Sousse' },
  { from: 'Tunis', to: 'Sfax' },
  { from: 'Sousse', to: 'Monastir' },
  { from: 'Tunis', to: 'Bizerte' },
]

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <section className="rounded-3xl border border-border-light bg-primary/10 p-5 dark:border-border-dark dark:bg-primary/15 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {user ? `Bienvenue, ${user.first_name}` : 'Bienvenue sur vev'}
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-light dark:text-muted-dark sm:text-base">
              {texts.tagline} : réservez votre place dans un louage entre gouvernorats, ou trouvez un louage pour
              votre prochain déplacement en Tunisie.
            </p>
            {user ? (
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/search" className={buttonClasses()}>
                  Chercher un louage
                </Link>
                <Link to="/bookings" className={buttonClasses({ variant: 'outline' })}>
                  Mes réservations
                </Link>
              </div>
            ) : (
              <p className="mt-4 text-sm font-medium text-primary">Inscrivez-vous pour réserver votre louage.</p>
            )}
          </div>

          <div className="rounded-3xl border border-border-light bg-surface-light p-5 dark:border-border-dark dark:bg-surface-dark">
            {user ? (
              <>
                <h2 className="text-lg font-semibold">Votre espace</h2>
                <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
                  Retrouvez vos réservations, votre profil et, si vous êtes propriétaire, vos trajets publiés.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link to="/bookings" className={`${buttonClasses()} w-full`}>
                    Mes réservations
                  </Link>
                  <Link to="/profile" className={`${buttonClasses({ variant: 'outline' })} w-full`}>
                    Mon profil
                  </Link>
                  {user.role === 'owner' && (
                    <Link to="/owner" className={`${buttonClasses({ variant: 'outline' })} w-full`}>
                      Espace propriétaire
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">Créer un compte</h2>
                <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
                  Étudiant ou propriétaire de louage, rejoignez vev.
                </p>
                <RegisterForm />
                <p className="mt-3 text-center text-sm text-muted-light dark:text-muted-dark">
                  Déjà un compte ?{' '}
                  <Link to="/login" className="font-semibold text-primary">
                    Se connecter
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Chercher un louage</h2>
        <div className="mt-3">
          <SearchForm />
        </div>
      </section>

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
        <h2 className="text-lg font-semibold">Vous êtes propriétaire d'un louage ?</h2>
        <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
          Publiez vos trajets et gérez les réservations des étudiants.
        </p>
        <Link to="/owner" className={`${buttonClasses({ className: 'mt-4' })} sm:mt-4`}>
          Ouvrir l'espace propriétaire
        </Link>
      </section>
    </div>
  )
}
