import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth, requireOwner } from '../middleware/auth.js'

const router = Router()

const TRIP_SELECT = `
  SELECT t.id, t.owner_id, t.from_city, t.to_city,
    to_char(t.departure_date, 'YYYY-MM-DD') AS departure_date,
    t.departure_time, t.price, t.total_seats, t.vehicle_type, t.phone,
    u.first_name || ' ' || u.last_name AS owner_name,
    NULL::numeric AS owner_rating,
    (SELECT COUNT(*)::int FROM trips t2 WHERE t2.owner_id = t.owner_id) AS owner_trips,
    t.total_seats - COALESCE((SELECT SUM(b.seats) FROM bookings b WHERE b.trip_id = t.id AND b.status IN ('pending', 'confirmed')), 0)::int AS seats_left
  FROM trips t JOIN users u ON u.id = t.owner_id
`

const VEHICLES = ['bus', 'minibus', 'van']

function validateTripPayload(body) {
  const { from_city, to_city, departure_date, departure_time, price, total_seats, vehicle_type, phone } = body || {}
  if (!from_city || !to_city || !departure_date || !departure_time || !phone) {
    return 'Champs obligatoires manquants'
  }
  if (from_city === to_city) return 'Les villes de départ et d\'arrivée doivent être différentes'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(departure_date)) return 'Date invalide (YYYY-MM-DD)'
  if (!/^\d{2}:\d{2}$/.test(departure_time)) return 'Heure invalide (HH:MM)'
  const priceNum = Number(price)
  const seatsNum = Number(total_seats)
  if (!Number.isInteger(priceNum) || priceNum < 1 || priceNum > 999) return 'Prix invalide'
  if (!Number.isInteger(seatsNum) || seatsNum < 1 || seatsNum > 60) return 'Nombre de places invalide'
  if (!VEHICLES.includes(vehicle_type)) return 'Type de véhicule invalide'
  if (String(phone).length < 8) return 'Numéro de téléphone invalide'
  return null
}

router.get('/', async (req, res) => {
  const conditions = []
  const params = []
  const push = (value, clause) => {
    params.push(value)
    conditions.push(clause.replace('$n', `$${params.length}`))
  }
  if (req.query.from_city) push(req.query.from_city, 't.from_city = $n')
  if (req.query.to_city) push(req.query.to_city, 't.to_city = $n')
  if (req.query.departure_date) push(req.query.departure_date, 't.departure_date >= $n::date')
  if (req.query.departure_time) push(req.query.departure_time, 't.departure_time >= $n')
  if (req.query.vehicle_type && VEHICLES.includes(req.query.vehicle_type)) {
    push(req.query.vehicle_type, 't.vehicle_type = $n')
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const sorts = {
    price_asc: 't.price ASC',
    price_desc: 't.price DESC',
    rating: 'owner_trips DESC',
  }
  const orderBy = sorts[req.query.sort] || 't.departure_date ASC, t.departure_time ASC'
  const { rows } = await query(`${TRIP_SELECT} ${where} ORDER BY ${orderBy} LIMIT 100`, params)
  res.json({ trips: rows })
})

router.get('/mine', requireAuth, requireOwner, async (req, res) => {
  const { rows } = await query(`${TRIP_SELECT} WHERE t.owner_id = $1 ORDER BY t.departure_date ASC, t.departure_time ASC`, [
    req.user.id,
  ])
  res.json({ trips: rows })
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  if (!/^\d+$/.test(id)) return res.status(404).json({ error: 'Trajet introuvable' })
  const { rows } = await query(`${TRIP_SELECT} WHERE t.id = $1`, [id])
  if (!rows[0]) return res.status(404).json({ error: 'Trajet introuvable' })
  const members = await query(
    `SELECT u.first_name AS name, b.seats, b.status
     FROM bookings b JOIN users u ON u.id = b.user_id
     WHERE b.trip_id = $1 AND b.status IN ('pending', 'confirmed')
     ORDER BY b.created_at ASC`,
    [id]
  )
  res.json({ trip: rows[0], members: members.rows })
})

router.post('/', requireAuth, requireOwner, async (req, res) => {
  const error = validateTripPayload(req.body)
  if (error) return res.status(400).json({ error })
  const { from_city, to_city, departure_date, departure_time, price, total_seats, vehicle_type, phone } = req.body
  const { rows } = await query(
    `INSERT INTO trips (owner_id, from_city, to_city, departure_date, departure_time, price, total_seats, vehicle_type, phone)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
    [req.user.id, from_city, to_city, departure_date, departure_time, Number(price), Number(total_seats), vehicle_type, phone]
  )
  const detail = await query(`${TRIP_SELECT} WHERE t.id = $1`, [rows[0].id])
  res.status(201).json({ trip: detail.rows[0] })
})

router.put('/:id', requireAuth, requireOwner, async (req, res) => {
  const id = req.params.id
  if (!/^\d+$/.test(id)) return res.status(404).json({ error: 'Trajet introuvable' })
  const error = validateTripPayload(req.body)
  if (error) return res.status(400).json({ error })
  const { rows: owned } = await query('SELECT id FROM trips WHERE id = $1 AND owner_id = $2', [id, req.user.id])
  if (!owned[0]) return res.status(404).json({ error: 'Trajet introuvable' })
  const { from_city, to_city, departure_date, departure_time, price, total_seats, vehicle_type, phone } = req.body
  await query(
    `UPDATE trips SET from_city = $1, to_city = $2, departure_date = $3, departure_time = $4, price = $5, total_seats = $6, vehicle_type = $7, phone = $8 WHERE id = $9`,
    [from_city, to_city, departure_date, departure_time, Number(price), Number(total_seats), vehicle_type, phone, id]
  )
  const detail = await query(`${TRIP_SELECT} WHERE t.id = $1`, [id])
  res.json({ trip: detail.rows[0] })
})

router.delete('/:id', requireAuth, requireOwner, async (req, res) => {
  const id = req.params.id
  if (!/^\d+$/.test(id)) return res.status(404).json({ error: 'Trajet introuvable' })
  const { rowCount } = await query('DELETE FROM trips WHERE id = $1 AND owner_id = $2', [id, req.user.id])
  if (!rowCount) return res.status(404).json({ error: 'Trajet introuvable' })
  res.status(204).end()
})

export default router
