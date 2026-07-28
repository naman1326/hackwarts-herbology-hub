import { useMemo } from 'react'

export function Fireflies() {
  const fireflies = useMemo(
    () => [
      { id: 1, left: '15%', top: '25%', delay: '0s' },
      { id: 2, left: '45%', top: '65%', delay: '1.5s' },
      { id: 3, left: '75%', top: '35%', delay: '0.8s' },
      { id: 4, left: '85%', top: '80%', delay: '2.2s' },
    ],
    []
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transform-gpu">
      {fireflies.map((firefly) => (
        <div
          key={firefly.id}
          className="absolute w-1.5 h-1.5 rounded-full bg-accent animate-firefly transform-gpu"
          style={{
            left: firefly.left,
            top: firefly.top,
            animationDelay: firefly.delay,
            boxShadow: '0 0 8px rgba(183, 215, 106, 0.7)',
          }}
        />
      ))}
    </div>
  )
}
