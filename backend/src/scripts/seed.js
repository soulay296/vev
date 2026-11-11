import bcrypt from 'bcryptjs'
import pool from '../db.js'

function day(offset) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toISOString().slice(0, 10)
}

async function run() {
  const password = await bcrypt.hash('demo1234', 10)
  const owners = [
    ['Ahmed', 'Ben Ali', 'ahmed@vev.tn', '+21620123456'],
    ['Sami', 'Trabelsi', 'sami@vev.tn', '+21620987654'],
    ['Nizar', 'Gharbi', 'nizar@vev.tn', '+21622111222'],
    ['Hatem', 'Mansouri', 'hatem@vev.tn', '+21623333444'],
  ]
  const ownerIds = []
  for (const [first_name, last_name, email, phone] of owners) {
    const { rows } = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, 'owner')
       ON CONFLICT (email) DO UPDATE SET phone = EXCLUDED.phone
       RETURNING id`,
      [first_name, last_name, email, phone, password]
    )
    ownerIds.push(rows[0].id)
  }
  await pool.query(
    `INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, $5, 'student')
     ON CONFLICT (email) DO NOTHING`,
    ['Étudiant', 'Démo', 'etudiant@vev.tn', '', password]
  )
  const trips = [
    [ownerIds[0], 'Tunis', 'Sousse', day(1), '14:00', 12, 15, 'minibus', '+21620123456'],
    [ownerIds[1], 'Tunis', 'Sfax', day(1), '16:30', 18, 22, 'bus', '+21620987654'],
    [ownerIds[2], 'Sousse', 'Monastir', day(2), '08:00', 5, 8, 'van', '+21622111222'],
    [ownerIds[3], 'Tunis', 'Bizerte', day(2), '10:15', 7, 14, 'minibus', '+21623333444'],
  ]
  for (const trip of trips) {
    await pool.query(
      `INSERT INTO trips (owner_id, from_city, to_city, departure_date, departure_time, price, total_seats, vehicle_type, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      trip
    )
  }
  console.log('Seed terminé : 4 propriétaires, 1 étudiant (mot de passe demo1234), 4 trajets.')
  await pool.end()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
