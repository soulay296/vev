import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import tripRoutes from './routes/trips.js'
import bookingRoutes from './routes/bookings.js'
import './env.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'vev-backend' })
})

app.use('/api/auth', authRoutes)
app.use('/api/trips', tripRoutes)
app.use('/api/bookings', bookingRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' })
})

app.use((error, req, res, next) => {
  console.error(error)
  res.status(error.status || 500).json({ error: error.message || 'Erreur interne' })
})

export default app
