import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes as X } from 'react-icons/fa'
import { cn } from '../../utils/cn'

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeButton = true,
}) {
  const sizes = {
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-lg',
    xl: 'w-full max-w-xl',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className={cn('relative', sizes[size])}>
              {/* Card */}
              <div className="bg-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                {(title || closeButton) && (
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    {title && (
                      <h2 className="text-xl font-cinzel font-bold text-cream">
                        {title}
                      </h2>
                    )}
                    {closeButton && (
                      <button
                        onClick={onClose}
                        className="text-cream/60 hover:text-cream transition-colors"
                        aria-label="Close modal"
                      >
                        <X size={24} />
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="border-t border-white/10 p-6 bg-white/5">
                    {footer}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
