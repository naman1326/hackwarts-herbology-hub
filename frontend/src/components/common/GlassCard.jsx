import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export function GlassCard({
  children,
  className,
  hoverEffect = true,
  onClick,
  ...props
}) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -8 } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative group',
        'rounded-2xl overflow-hidden',
        'bg-white/5 backdrop-blur-[20px]',
        'border border-white/10',
        'shadow-lg',
        'transition-all duration-300',
        onClick && 'cursor-pointer hover:bg-white/8 hover:border-white/20',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {/* Gradient overlay for glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-accent/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
