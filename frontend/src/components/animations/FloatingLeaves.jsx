import { useMemo } from 'react'

export function FloatingLeaves() {
  const leaves = useMemo(
    () => [
      { id: 1, left: '10%', delay: '0s', duration: '14s' },
      { id: 2, left: '35%', delay: '4s', duration: '18s' },
      { id: 3, left: '65%', delay: '2s', duration: '16s' },
      { id: 4, left: '88%', delay: '6s', duration: '15s' },
    ],
    []
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transform-gpu">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute text-2xl opacity-20 animate-drift transform-gpu"
          style={{
            left: leaf.left,
            top: '-5%',
            animationDelay: leaf.delay,
            animationDuration: leaf.duration,
          }}
        >
          🍃
        </div>
      ))}
    </div>
  )
}
