import React from 'react'
import { Navbar } from '../common/Navbar'
import { Footer } from '../common/Footer'
import { MagicalBackground } from '../animations/MagicalBackground'
import { FloatingLeaves } from '../animations/FloatingLeaves'
import { Fireflies } from '../animations/Fireflies'

export function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-dark">
      {/* Background Effects */}
      <MagicalBackground />
      <FloatingLeaves />
      <Fireflies />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
