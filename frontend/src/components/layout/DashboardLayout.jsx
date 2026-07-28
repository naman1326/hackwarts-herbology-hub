import { Navbar } from '../common/Navbar'
import { FloatingLeaves } from '../animations/FloatingLeaves'
import { Fireflies } from '../animations/Fireflies'

export function DashboardLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-dark">
      {/* Background Effects */}
      <FloatingLeaves />
      <Fireflies />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
