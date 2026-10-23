export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-white shadow-soft transition-colors duration-150 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
