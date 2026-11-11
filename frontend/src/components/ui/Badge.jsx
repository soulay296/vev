const variants = {
  default: 'bg-border-light/70 text-text-light dark:bg-border-dark/70 dark:text-text-dark',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-accent/15 text-green-700 dark:bg-accent/20 dark:text-green-400',
  warning: 'bg-secondary/15 text-amber-700 dark:bg-secondary/20 dark:text-amber-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
}

export function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
