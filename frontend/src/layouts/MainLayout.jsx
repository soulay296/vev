import { Header } from '../components/layout/Header'
import { BottomNav } from '../components/layout/BottomNav'

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-8">{children}</main>
      <BottomNav />
    </div>
  )
}
