import { Router } from 'express'
import pool, { query } from '../db.js'
import { requireAuth, requireOwner } from '../middleware/auth.js'

const router = Router()

const STATUSES = ['pending', 'confirmed', 'refused', 'cancelled']

function mapBooking(row) {
  return {
    id: row.id,
    tripId: row.trip_id,
    seats: row.seats,
    status: row.status,
    createdAt: row.created_at,
    student_name: row.student_name || null,
    name: row.student_name || null,
    trip: {
      id: row.trip_id,
      from_city: row.from_city,
      to_city: row.to_city,
      departure_date: row.departure_date,
      departure_time: row.departure_time,
      price: row.price,
      total_seats: row.total_seats,
      vehicle_type: row.vehicle_type,
      phone: row.phone,
      owner_id: row.owner_id,
    },
  }
}

router.post('/', requireAuth, async (req, res) => {
  const { trip_id, seats } = req.body || {}
  const seatsNum = Number(seats)
  if (!trip_id || !Number.isInteger(seatsNum) || seatsNum < 1) {
    return res.status(400).json({ error: 'Nombre de places invalide' })
  }
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows } = await client.query('SELECT * FROM trips WHERE id = $1 FOR UPDATE', [trip_id])
    const trip = rows[0]
    if (!trip) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Trajet introuvable' })
    }
    const { rows: taken } = await client.query(
      `SELECT COALESCE(SUM(seats), 0)::int AS taken FROM bookings WHERE trip_id = $1 AND status IN ('pending', 'confirmed')`,
      [trip_id]
    )
    if (taken[0].taken + seatsNum > trip.total_seats) {
      await client.query('ROLLBACK')
      return res.status(409).json({ error: 'Plus assez de places disponibles' })
    }
    const { rows: existing } = await client.query(
      `SELECT id FROM bookings WHERE trip_id = $1 AND user_id = $2 AND status IN ('pending', 'confirmed')`,
      [trip_id, req.user.id]
    )
    if (existing[0]) {
      await client.query('ROLLBACK')
      return res.status(409).json({ error: 'Vous avez déjà une réservation active pour ce trajet' })
    }
    const { rows: created } = await client.query(
      'INSERT INTO bookings (trip_id, user_id, seats) VALUES ($1, $2, $3) RETURNING *',
      [trip_id, req.user.id, seatsNum]
    )
    await client.query('COMMIT')
    res.status(201).json({ booking: created[0] })
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    throw error
  } finally {
    client.release()
  }
})

router.get('/mine', requireAuth, async (req, res) => {
  const { rows } = await query(
    `SELECT b.id, b.trip_id, b.seats, b.status, b.created_at,
            t.from_city, t.to_city, to_char(t.departure_date, 'YYYY-MM-DD') AS departure_date,
            t.departure_time, t.price, t.total_seats, t.vehicle_type, t.phone, t.owner_id
     FROM bookings b JOIN trips t ON t.id = b.trip_id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [req.user.id]
  )
  res.json({ bookings: rows.map(mapBooking) })
})

router.get('/received', requireAuth, requireOwner, async (req, res) => {
  const { rows } = await query(
    `SELECT b.id, b.trip_id, b.seats, b.status, b.created_at, u.first_name AS student_name,
            t.from_city, t.to_city, to_char(t.departure_date, 'YYYY-MM-DD') AS departure_date,
            t.departure_time, t.price, t.total_seats, t.vehicle_type, t.phone, t.owner_id
     FROM bookings b
     JOIN trips t ON t.id = b.trip_id
     JOIN users u ON u.id = b.user_id
     WHERE t.owner_id = $1
     ORDER BY b.created_at DESC`,
    [req.user.id]
  )
  res.json({ bookings: rows.map(mapBooking) })
})

router.patch('/:id', requireAuth, async (req, res) => {
  const { status } = req.body || {}
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Statut invalide' })
  const id = req.params.id
  if (!/^\d+$/.test(id)) return res.status(404).json({ error: 'Réservation introuvable' })
  const { rows } = await query(
    `SELECT b.*, t.owner_id FROM bookings b JOIN trips t ON t.id = b.trip_id WHERE b.id = $1`,
    [id]
  )
  const booking = rows[0]
  if (!booking) return res.status(404).json({ error: 'Réservation introuvable' })

  const isOwner = booking.owner_id === req.user.id
  const isStudent = booking.user_id === req.user.id
  if (!isOwner && !isStudent) return res.status(403).json({ error: 'Accès refusé' })
  if (status !== 'cancelled' && !isOwner) return res.status(403).json({ error: 'Seul le propriétaire peut décider' })
  if (booking.status === 'cancelled' || booking.status === 'refused') {
    return res.status(409).json({ error: 'Cette réservation est déjà clôturée' })
  }
  if (status === 'cancelled' && booking.status === 'confirmed' && !isStudent && !isOwner) {
    return res.status(403).json({ error: 'Accès refusé' })
  }
  const { rows: updated } = await query('UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *', [status, id])
  res.json({ booking: updated[0] })
})

export default router
