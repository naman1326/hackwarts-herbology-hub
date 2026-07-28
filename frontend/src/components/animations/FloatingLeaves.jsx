import { motion } from 'framer-motion'
import { useMemo } from 'react'

export function FloatingLeaves() {
  const leaves = useMemo(
    () => Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 10,
      left: Math.random() * 100,
    })),
    []
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {leaves.map(leaf => (
        <motion.div
          key={leaf.id}
          className="absolute text-4xl opacity-30"
          style={{ left: `${leaf.left}%` }}
          initial={{ y: -100, x: 0 }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
            x: Math.sin(leaf.delay) * 100,
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          🍃
        </motion.div>
      ))}
    </div>
  )
}
