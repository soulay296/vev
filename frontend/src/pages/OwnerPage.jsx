import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { CalendarPlus, Car, Phone, Ticket, TrendingUp } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'
import { Badge } from '../components/ui/Badge'

const stats = [
  { label: 'Trajets publiés', value: '0', icon: Car },
  { label: 'Réservations', value: '0', icon: Ticket },
  { label: 'Revenus estimés', value: '0 DT', icon: TrendingUp },
]

export function OwnerPage() {
  const comingSoon = () =>
    toast.info("La gestion des trajets sera disponible à l'étape de l'espace propriétaire.")

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Espace propriétaire</h1>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
            Publiez vos trajets et gérez les réservations.
          </p>
        </div>
        <button
          type="button"
          onClick={comingSoon}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary"
        >
          <CalendarPlus size={18} /> Ajouter un trajet
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-3xl border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={18} />
            </span>
            <p className="mt-3 text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-light dark:text-muted-dark">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Mes trajets</h2>
        <Badge variant="warning">Démo</Badge>
      </div>

      <div className="mt-3">
        <EmptyState
          title="Aucun trajet publié"
          description="Ajoutez votre premier trajet : départ, arrivée, horaire, prix, places et numéro de téléphone."
          action={
            <button
              type="button"
              onClick={comingSoon}
              className="inline-flex rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary"
            >
              Publier un trajet
            </button>
          }
        />
      </div>

      <div className="mt-6 rounded-3xl border border-border-light p-4 text-sm text-muted-light dark:border-border-dark dark:text-muted-dark">
        <p className="flex items-center gap-2 font-medium text-text-light dark:text-text-dark">
          <Phone size={16} className="text-primary" /> Paiement en espèces
        </p>
        <p className="mt-1">
          Les étudiants paient directement le chauffeur. Le paiement en ligne sera ajouté plus tard sans changer le parcours de réservation.
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-muted-light dark:text-muted-dark">
        Vous êtes étudiant ?{' '}
        <Link to="/search" className="font-medium text-primary">
          Chercher un trajet
        </Link>
      </p>
    </div>
  )
}
