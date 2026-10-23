import { images } from '../../constants/images'

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border-light bg-surface-light px-6 py-10 text-center dark:border-border-dark dark:bg-surface-dark">
      <img
        src={images.illustrations.empty.src}
        alt={images.illustrations.empty.alt}
        className="h-28 w-auto"
      />
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-muted-light dark:text-muted-dark">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
