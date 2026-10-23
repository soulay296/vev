import { forwardRef } from 'react'

export const Input = forwardRef(function Input(
  { label, error, id, className = '', as: Tag = 'input', children, ...props },
  ref
) {
  const inputId = id || props.name
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium">
          {label}
        </label>
      )}
      <Tag
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full rounded-2xl border bg-surface-light px-4 py-3 text-sm outline-none transition-colors duration-150 placeholder:text-muted-light focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-surface-dark dark:placeholder:text-muted-dark ${
          error ? 'border-red-500' : 'border-border-light dark:border-border-dark'
        } ${className}`}
        {...props}
      >
        {children}
      </Tag>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
})
