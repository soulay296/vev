import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const base = 'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary: 'bg-primary text-white shadow-soft hover:bg-primary-hover',
  outline:
    'border border-border-light text-text-light hover:border-primary hover:text-primary dark:border-border-dark dark:text-text-dark dark:hover:border-primary dark:hover:text-primary',
  ghost:
    'text-muted-light hover:bg-border-light hover:text-text-light dark:text-muted-dark dark:hover:bg-border-dark dark:hover:text-text-dark',
  danger:
    'border border-border-light text-red-600 hover:border-red-400 hover:bg-red-50 dark:border-border-dark dark:text-red-400 dark:hover:bg-red-950/40',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'w-full px-4 py-3 text-sm',
}

export function buttonClasses({ variant = 'primary', size = 'md', className = '' } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`
}

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, className = '', children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  )
})
