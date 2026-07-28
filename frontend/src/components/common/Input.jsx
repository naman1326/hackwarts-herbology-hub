import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  containerClassName,
  className,
  ...props
}, ref) => {
  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-cream mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent">
            <Icon size={20} />
          </div>
        )}
        
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg',
            'bg-white/5 border border-white/10',
            'text-cream placeholder-cream/50',
            'focus:outline-none focus:border-accent focus:bg-white/10',
            'transition-all duration-300',
            Icon && 'pl-10',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
