import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'

const SPELLS = [
  'Lumos!',
  'Alohomora!',
  'Wingardium Leviosa!',
  'Expelliarmus!',
  'Expecto Patronum!',
  'Accio!',
  'Incendio!',
  'Aguamenti!',
  'Revelio!',
]

export function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [activeSpell, setActiveSpell] = useState(null)

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animFrameRef = useRef(null)

  useEffect(() => {
    const checkTouch = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
      setIsTouchDevice(isTouch)
    }
    checkTouch()
    window.addEventListener('resize', checkTouch)
    return () => window.removeEventListener('resize', checkTouch)
  }, [])

  // Canvas particle loop for trail & spell sparks (runs outside React state for 60fps smoothness)
  useEffect(() => {
    if (isTouchDevice) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        p.size *= 0.95

        if (p.life <= 0 || p.size <= 0.2) return false

        ctx.save()
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        return true
      })

      animFrameRef.current = requestAnimationFrame(render)
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [isTouchDevice])

  useEffect(() => {
    if (isTouchDevice) return

    let lastTrailTime = 0

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e
      rawX.set(x)
      rawY.set(y)

      const now = Date.now()
      if (now - lastTrailTime > 35) {
        lastTrailTime = now
        // Push trail particle
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: Math.random() * 0.8 + 0.5,
          size: Math.random() * 3 + 2,
          life: 0.8,
          decay: 0.04,
          color: ['#B7D76A', '#D4AF37', '#6366F1', '#EC4899', '#F59E0B'][Math.floor(Math.random() * 5)],
        })
      }
    }

    const handleMouseOver = (e) => {
      const target = e.target
      if (!target) return
      const isInteractive = target.closest(
        'a, button, input, select, textarea, [role="button"], label, .interactive, .glass-card, [tabindex]'
      )
      setIsHovering(!!isInteractive)
    }

    const handleMouseDown = (e) => {
      setIsMouseDown(true)
      const x = e.clientX
      const y = e.clientY

      const randomSpell = SPELLS[Math.floor(Math.random() * SPELLS.length)]
      setActiveSpell({ id: Date.now(), text: randomSpell })

      // Burst of magical spell sparks on canvas
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
        const speed = Math.random() * 3 + 1.5
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 3,
          life: 1.0,
          decay: 0.035,
          color: ['#FFD700', '#B7D76A', '#9333EA', '#38BDF8', '#F43F5E'][Math.floor(Math.random() * 5)],
        })
      }

      setTimeout(() => setIsMouseDown(false), 200)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [isTouchDevice, rawX, rawY])

  useEffect(() => {
    if (!activeSpell) return
    const timer = setTimeout(() => setActiveSpell(null), 1000)
    return () => clearTimeout(timer)
  }, [activeSpell])

  if (isTouchDevice) return null

  return (
    <>
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          html, body, body *, a, button, input, select, textarea, [role="button"] {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Lightweight Overlay Canvas for Stardust & Sparkles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
      />

      {/* Wand Cursor Container */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transform-gpu"
        style={{
          x: rawX,
          y: rawY,
        }}
      >
        {/* Lumos Tip Glow Ring */}
        <motion.div
          className="absolute -top-4 -left-4 w-8 h-8 rounded-full pointer-events-none transform-gpu"
          animate={{
            scale: isHovering ? [1, 1.4, 1.1] : [0.8, 1.05, 0.8],
            opacity: isHovering ? 0.9 : 0.55,
          }}
          transition={{
            duration: isHovering ? 0.8 : 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: isHovering
              ? 'radial-gradient(circle, rgba(212,175,55,0.85) 0%, rgba(183,215,106,0.4) 50%, rgba(0,0,0,0) 70%)'
              : 'radial-gradient(circle, rgba(183,215,106,0.7) 0%, rgba(47,107,59,0.25) 50%, rgba(0,0,0,0) 70%)',
          }}
        />

        {/* Harry Potter Wand SVG Element */}
        <motion.div
          animate={{
            rotate: isMouseDown ? [0, -25, 15, 0] : isHovering ? -12 : -5,
            scale: isMouseDown ? 1.15 : isHovering ? 1.08 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 25,
          }}
          style={{
            transformOrigin: '0px 0px',
          }}
          className="relative drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] transform-gpu"
        >
          <svg
            width="42"
            height="42"
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible pointer-events-none"
          >
            <defs>
              <linearGradient id="wandWood" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ECEFF1" />
                <stop offset="15%" stopColor="#8C5828" />
                <stop offset="50%" stopColor="#5C3A21" />
                <stop offset="85%" stopColor="#3D2314" />
                <stop offset="100%" stopColor="#25140B" />
              </linearGradient>

              <linearGradient id="wandGold" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFF2A1" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#AA7C11" />
              </linearGradient>

              <radialGradient id="lumosTip" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor={isHovering ? '#FFF4A3' : '#E2F79E'} />
                <stop offset="70%" stopColor={isHovering ? '#D4AF37' : '#B7D76A'} />
                <stop offset="100%" stopColor={isHovering ? '#9333EA' : '#2F6B3B'} stopOpacity="0.8" />
              </radialGradient>
            </defs>

            <path
              d="M 1.5 1.5 L 34 34"
              stroke="url(#wandWood)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 2 2 L 32 32"
              stroke="#A8723A"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.7"
            />

            <circle cx="9" cy="9" r="2.8" fill="url(#wandWood)" stroke="url(#wandGold)" strokeWidth="0.8" />
            <circle cx="16" cy="16" r="3.2" fill="url(#wandWood)" stroke="url(#wandGold)" strokeWidth="0.8" />
            <circle cx="23" cy="23" r="3.6" fill="url(#wandWood)" stroke="url(#wandGold)" strokeWidth="1" />
            <circle cx="30" cy="30" r="4.2" fill="url(#wandWood)" stroke="url(#wandGold)" strokeWidth="1.2" />

            <circle cx="34" cy="34" r="3" fill="url(#wandGold)" />
            <line x1="28" y1="26" x2="26" y2="28" stroke="url(#wandGold)" strokeWidth="1.5" />
            <line x1="31" y1="29" x2="29" y2="31" stroke="url(#wandGold)" strokeWidth="1.5" />

            <circle
              cx="0"
              cy="0"
              r={isHovering ? 4.5 : 3.5}
              fill="url(#lumosTip)"
            />

            <path
              d="M 0 -6 L 1.2 -1.8 L 5.5 -1.2 L 2.1 1.5 L 3.2 5.5 L 0 3 L -3.2 5.5 L -2.1 1.5 L -5.5 -1.2 L -1.2 -1.8 Z"
              fill={isHovering ? '#FFF59D' : '#E2F7A2'}
              opacity={isHovering ? 0.9 : 0.75}
              transform="scale(0.7)"
            />
          </svg>
        </motion.div>

        {/* Floating Spell Cast Text Banner */}
        <AnimatePresence>
          {activeSpell && (
            <motion.div
              key={activeSpell.id}
              initial={{ opacity: 0, y: 0, scale: 0.7 }}
              animate={{ opacity: 1, y: -35, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute left-4 top-0 -translate-y-full pointer-events-none px-2.5 py-1 rounded-full text-xs font-serif font-bold tracking-wider text-amber-200 bg-emerald-950/90 border border-amber-400/40 shadow-[0_0_15px_rgba(212,175,55,0.5)] whitespace-nowrap transform-gpu"
            >
              ✨ {activeSpell.text}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
