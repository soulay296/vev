import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../db.js'
import { JWT_SECRET, SALT_ROUNDS } from '../env.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
}

function publicUser(row) {
  return {
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
  }
}

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, phone, password, role } = req.body || {}
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' })
  }
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Mot de passe trop court (6 caractères minimum)' })
  }
  const safeRole = role === 'owner' ? 'owner' : 'student'
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    const { rows } = await query(
      'INSERT INTO users (first_name, last_name, email, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [String(first_name).trim(), String(last_name).trim(), String(email).toLowerCase().trim(), phone || '', hash, safeRole]
    )
    const user = rows[0]
    res.status(201).json({ token: signToken(user), user: publicUser(user) })
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Un compte existe déjà avec cet email' })
    throw error
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' })
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [String(email).toLowerCase().trim()])
  const user = rows[0]
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
  }
  res.json({ token: signToken(user), user: publicUser(user) })
})

router.get('/me', requireAuth, async (req, res) => {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [req.user.id])
  if (!rows[0]) return res.status(401).json({ error: 'Utilisateur introuvable' })
  res.json({ user: publicUser(rows[0]) })
})

export default router
