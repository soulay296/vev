import lightLogo from '../../assets/logo/vev-logo.svg'
import darkLogo from '../../assets/logo/vev-logo-dark.svg'

export function Logo({ dark = false, className = '', showText = true }) {
  return (
    <img
      src={dark ? darkLogo : lightLogo}
      alt="vev"
      className={`h-9 w-auto ${className}`}
      style={showText ? undefined : { width: '2.25rem', objectFit: 'cover', objectPosition: 'left' }}
    />
  )
}
