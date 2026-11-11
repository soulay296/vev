import { BrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import { AppRouter } from './routes/AppRouter'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
        <MainLayout>
          <AppRouter />
        </MainLayout>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
