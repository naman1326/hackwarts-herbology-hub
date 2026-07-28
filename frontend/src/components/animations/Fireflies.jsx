import { motion } from 'framer-motion'
import { useMemo } from 'react'

export function Fireflies() {
  const fireflies = useMemo(
    () => Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 3,
    })),
    []
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {fireflies.map(firefly => (
        <motion.div
          key={firefly.id}
          className="absolute w-1 h-1 rounded-full bg-accent"
          style={{
            left: `${firefly.left}%`,
            top: `${firefly.top}%`,
            boxShadow: '0 0 10px rgba(183, 215, 106, 0.8)',
          }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, 30, 0],
            x: [0, Math.random() * 40 - 20, 0],
          }}
          transition={{
            duration: firefly.duration,
            delay: firefly.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
