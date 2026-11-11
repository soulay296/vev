import app from './app.js'

const PORT = process.env.PORT || 5000

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET non défini : valeur de développement utilisée. Définissez-le en production.')
}

app.listen(PORT, () => {
  console.log(`vev backend running on http://localhost:${PORT}`)
})
