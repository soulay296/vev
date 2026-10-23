import { BrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import { AppRouter } from './routes/AppRouter'

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <AppRouter />
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
