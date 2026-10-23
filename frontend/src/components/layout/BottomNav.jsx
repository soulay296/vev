import { NavLink } from 'react-router-dom'
import { Search, CalendarCheck, User } from 'lucide-react'
import { texts } from '../../constants/texts'

const items = [
  { to: '/search', label: texts.search, icon: Search },
  { to: '/bookings', label: texts.myBookings, icon: CalendarCheck },
  { to: '/profile', label: texts.profile, icon: User },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-light bg-surface-light/95 backdrop-blur md:hidden dark:border-border-dark dark:bg-surface-dark/95">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium transition-colors duration-150 ${
                isActive ? 'text-primary' : 'text-muted-light dark:text-muted-dark'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
