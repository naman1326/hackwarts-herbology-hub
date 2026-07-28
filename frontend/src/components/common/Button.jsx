import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const variants = {
  primary:
    'bg-gradient-to-r from-[#B7D76A] via-[#D4AF37] to-[#B7D76A] text-emerald-950 font-bold font-cinzel border border-amber-200/60 shadow-[0_0_20px_rgba(183,215,106,0.45)] hover:shadow-[0_0_30px_rgba(212,175,55,0.75)] hover:brightness-110',
  secondary:
    'bg-primary-500 text-cream font-semibold border border-primary-400/40 shadow-md hover:bg-primary-600 hover:shadow-lg',
  outline:
    'border-2 border-accent/80 text-accent font-semibold bg-accent/10 hover:bg-accent/20 hover:border-gold hover:text-gold shadow-sm',
  ghost: 'text-cream font-medium hover:bg-white/10 hover:text-accent',
}

const sizes = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-3 text-base',
  lg: 'px-7 py-3.5 text-lg tracking-wide',
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
      whileHover={!disabled && !isLoading ? { scale: 1.03 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      className={cn(
        'relative overflow-hidden rounded-xl font-bold tracking-wide',
        'transition-all duration-300 select-none cursor-pointer',
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
