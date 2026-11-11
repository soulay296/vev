import { useState } from 'react'

export function SafeImage({ src, fallback, alt, className, loading, ...props }) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={failed && fallback ? fallback : src}
      alt={alt}
      className={className}
      loading={loading || 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      {...props}
    />
  )
}
