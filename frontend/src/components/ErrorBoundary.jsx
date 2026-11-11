import { Component } from 'react'
import { Button } from './ui/Button'

export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('vev error boundary:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
          <p className="text-6xl font-bold text-primary">Oups</p>
          <h1 className="mt-3 text-xl font-semibold">Une erreur est survenue</h1>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
            La page a rencontré un problème inattendu. Réessayez dans un instant.
          </p>
          <Button className="mt-5" onClick={() => window.location.reload()}>
            Recharger la page
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
