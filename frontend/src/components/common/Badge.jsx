import React from 'react'
import { cn } from '../../utils/cn'

const variants = {
  default: 'bg-accent/20 text-accent border-accent/30',
  primary: 'bg-primary/20 text-primary border-primary/30',
  gold: 'bg-gold/20 text-gold border-gold/30',
  success: 'bg-green-500/20 text-green-300 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  error: 'bg-red-500/20 text-red-300 border-red-500/30',
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  icon: Icon,
}) {
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full',
      'border font-medium font-poppins',
      'transition-all duration-300',
      variants[variant],
      sizes[size],
      className
    )}>
      {Icon && <Icon size={14} />}
      {children}
    </span>
  )
}
