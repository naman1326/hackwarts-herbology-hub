import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export function SkeletonLoader({ className, variant = 'default' }) {
  const variants = {
    default: 'rounded-lg',
    circle: 'rounded-full',
    card: 'rounded-2xl',
  }

  return (
    <motion.div
      className={cn(
        'bg-gradient-to-r from-white/5 via-white/10 to-white/5',
        'animate-shimmer',
        variants[variant],
        className
      )}
      style={{
        backgroundSize: '200% 100%',
      }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <SkeletonLoader className="h-8 w-3/4" />
      <SkeletonLoader className="h-4 w-full" />
      <SkeletonLoader className="h-4 w-5/6" />
      <div className="flex gap-2 pt-4">
        <SkeletonLoader className="h-8 w-20" variant="default" />
        <SkeletonLoader className="h-8 w-20" variant="default" />
      </div>
    </div>
  )
}
