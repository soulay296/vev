const variants = {
  default: 'bg-border-light text-text-light dark:bg-border-dark dark:text-text-dark',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-accent/10 text-accent',
  warning: 'bg-secondary/15 text-secondary',
  danger: 'bg-red-100 text-red-600 dark:bg-red-950',
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
