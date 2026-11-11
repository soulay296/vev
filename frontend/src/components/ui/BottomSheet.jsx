import { useId, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useDialog } from '../../hooks/useDialog'

export function BottomSheet({ open, onClose, title, children }) {
  const containerRef = useRef(null)
  const titleId = useId()
  useDialog({ open, onClose, containerRef })

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-surface-light p-5 pb-[calc(2rem+env(safe-area-inset-bottom))] shadow-card dark:bg-surface-dark"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border-light dark:bg-border-dark" />
            <div className="mb-4 flex items-center justify-between">
              <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="rounded-full p-2 hover:bg-border-light dark:hover:bg-border-dark"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
