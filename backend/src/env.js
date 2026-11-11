import dotenv from 'dotenv'

dotenv.config()

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
export const DATABASE_URL = process.env.DATABASE_URL
export const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10
