import { motion } from 'framer-motion'
import { FloatingLeaves } from '../animations/FloatingLeaves'
import { Fireflies } from '../animations/Fireflies'
import { MagicalBackground } from '../animations/MagicalBackground'

export function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-dark overflow-hidden">
      {/* Background Effects */}
      <MagicalBackground />
      <FloatingLeaves />
      <Fireflies />

      {/* Logo */}
      <motion.div
        className="absolute top-8 left-8 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 font-cinzel font-bold text-xl">
          <span className="text-3xl">🌿</span>
          <span className="text-cream">Herbology</span>
          <span className="text-accent">Hub</span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-md px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
