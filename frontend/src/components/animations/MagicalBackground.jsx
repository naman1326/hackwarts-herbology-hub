import { useEffect, useRef } from 'react'

export function MagicalBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateSize()

    const particles = []
    const particleCount = 25

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1
        this.speedX = Math.random() * 0.4 - 0.2
        this.speedY = Math.random() * 0.4 - 0.2
        this.opacity = Math.random() * 0.4 + 0.15
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.fillStyle = `rgba(183, 215, 106, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    let animId
    const animate = () => {
      if (!document.hidden) {
        ctx.fillStyle = 'rgba(14, 26, 20, 0.15)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        particles.forEach((particle) => {
          particle.update()
          particle.draw()
        })
      }

      animId = requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener('resize', updateSize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 transform-gpu"
      style={{ background: 'transparent' }}
    />
  )
}
