import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export function LoadingSpinner({ size = 'md', className }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <motion.div
        className={cn(
          'rounded-full border-2 border-accent/30',
          'border-t-accent',
          sizes[size]
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
