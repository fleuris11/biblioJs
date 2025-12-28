# Projet Biblio - API NodeJS/Express

Synopsis et instructions d'installation minimales.

## Installation
1. Copier `.env.example` en `.env` et remplir les variables (notamment les secrets JWT et le chemin vers `firebase-config.json`).
2. Placer votre `firebase-config.json` (clé privée) à la racine (NE PAS COMMITTER).
3. npm install
4. npm run dev

## Endpoints (extrait)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- GET /api/books
- GET /api/books/:id
- POST /api/books (auth)
- PUT /api/books/:id (auth)
- DELETE /api/books/:id (auth)

## Bonnes pratiques
- Ne commitez JAMAIS `.env` ni `firebase-config.json`.
- Testez avec Postman avant de rendre le projet.

(Je peux compléter README et générer une collection Postman si vous voulez.)
