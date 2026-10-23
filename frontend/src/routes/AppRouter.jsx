import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { HomePage } from '../pages/HomePage'
import { SearchPage } from '../pages/SearchPage'
import { TripDetailPage } from '../pages/TripDetailPage'
import { BookingsPage } from '../pages/BookingsPage'
import { ProfilePage } from '../pages/ProfilePage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { OwnerPage } from '../pages/OwnerPage'
import { NotFoundPage } from '../pages/NotFoundPage'

function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export function AppRouter() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><HomePage /></Page>} />
        <Route path="/search" element={<Page><SearchPage /></Page>} />
        <Route path="/trips/:id" element={<Page><TripDetailPage /></Page>} />
        <Route path="/bookings" element={<Page><BookingsPage /></Page>} />
        <Route path="/profile" element={<Page><ProfilePage /></Page>} />
        <Route path="/login" element={<Page><LoginPage /></Page>} />
        <Route path="/register" element={<Page><RegisterPage /></Page>} />
        <Route path="/owner" element={<Page><OwnerPage /></Page>} />
        <Route path="*" element={<Page><NotFoundPage /></Page>} />
      </Routes>
    </AnimatePresence>
  )
}
