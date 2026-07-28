import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const variants = {
  primary: 'bg-accent text-dark hover:bg-gold',
  secondary: 'bg-primary text-cream hover:bg-primary/80',
  outline: 'border border-accent text-accent hover:bg-accent/10',
  ghost: 'text-cream hover:bg-white/10',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isLoading,
  disabled,
  ...props
}) {
  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      className={cn(
        'relative overflow-hidden rounded-lg font-poppins font-600',
        'transition-all duration-300',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}
