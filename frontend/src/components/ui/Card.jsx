export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-3xl bg-surface-light dark:bg-surface-dark shadow-card border border-border-light dark:border-border-dark overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
