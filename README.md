# vev

vev est une application web (mobile-first) de transport collectif tunisien ("n9l jeme3i" : bus, minibus, vans). 
Les propriétaires publient leurs trajets avec leur numéro de téléphone, et les étudiants recherchent, rejoignent un groupe et réservent une place.

## Stack technique
- Frontend : React + Vite, React Router, Tailwind CSS
- Backend : Node.js + Express
- Base de données : PostgreSQL (compatible Supabase)
- Authentification : JWT
- Langues : français d'abord, structure prête pour l'arabe (RTL)

## Structure du projet
```
vev/
├── frontend/  # React + Vite
└── backend/   # Node.js + Express
```

## Lancement en développement

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
API: http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App: http://localhost:5173

## Variables d'environnement
Voir `.env.example` à la racine et dans `frontend/`/`backend/`.
Ne jamais commiter de clés/secrets.
