import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { RequireAuth } from '../features/auth/RequireAuth'

const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })))
const SearchPage = lazy(() => import('../pages/SearchPage').then((m) => ({ default: m.SearchPage })))
const TripDetailPage = lazy(() => import('../pages/TripDetailPage').then((m) => ({ default: m.TripDetailPage })))
const BookingsPage = lazy(() => import('../pages/BookingsPage').then((m) => ({ default: m.BookingsPage })))
const ProfilePage = lazy(() => import('../pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const LoginPage = lazy(() => import('../pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('../pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const OwnerPage = lazy(() => import('../pages/OwnerPage').then((m) => ({ default: m.OwnerPage })))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={28} className="animate-spin text-primary" />
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Page><HomePage /></Page>} />
        <Route path="/search" element={<Page><SearchPage /></Page>} />
        <Route path="/trips/:id" element={<Page><TripDetailPage /></Page>} />
        <Route path="/bookings" element={<Page><BookingsPage /></Page>} />
        <Route path="/profile" element={<Page><ProfilePage /></Page>} />
        <Route path="/login" element={<Page><LoginPage /></Page>} />
        <Route path="/register" element={<Page><RegisterPage /></Page>} />
        <Route
          path="/owner"
          element={
            <Page>
              <RequireAuth>
                <OwnerPage />
              </RequireAuth>
            </Page>
          }
        />
        <Route path="*" element={<Page><NotFoundPage /></Page>} />
      </Routes>
    </Suspense>
  )
}
