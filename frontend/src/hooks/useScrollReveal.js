import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight * 0.75
        setIsRevealed(isVisible)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return [ref, isRevealed]
}
