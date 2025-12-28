# Projet Biblio — API NodeJS/Express

API simple pour gérer une bibliothèque (livres, auteurs, authentification) réalisée en Node.js + Express et Firestore.

---

## Description
Ce projet contient une API REST qui permet de :
- Gérer des **livres** (CRUD, pagination, recherche, filtrage par disponibilité)
- Gérer des **auteurs** (CRUD)
- Gérer l'**authentification** (register / login / refresh) avec **JWT**
- Hasher les mots de passe avec **bcrypt**
- Rendre une page d'accueil et une page de liste des livres en **EJS**

L'API est organisée en couches : controllers, models (Firebase), routes, schemas (Joi), middlewares.

---

## Fonctionnalités principales
- Express + Helmet, CORS, Morgan
- Firebase Firestore pour stockage
- Validation des payloads avec **Joi**
- Authentification par **JWT** (access & refresh tokens)
- Seed de données (script `npm run seed`)
- Collection Postman fournie (`postman/projet-biblio.postman_collection.json`) 

---

## Prérequis
- Node.js (>= 18 recommandé)
- Un projet Firebase avec une **clé de service** (service account JSON) et Firestore activé

---

## Installation et démarrage
1. Cloner le repo :

```bash
git clone https://github.com/fleuris11/biblioJs.git
cd biblioJs
```

2. Copier le fichier d'exemple d'environnement et le modifier :

```bash
cp .env
# puis ouvrez .env et renseignez les valeurs (JWT secrets, chemin FIREBASE_SERVICE_ACCOUNT_PATH...)
```

3. Placer votre `firebase-config.json`

4. Installer les dépendances :

```bash
npm install
```

5. Lancer le serveur en développement :

```bash
npm run dev
```

Le serveur écoute par défaut sur `http://localhost:8080`chez moi 

> Astuce : si vous modifiez `.env`, redémarrez le serveur pour que les variables soient prises en compte.

---

## Scripts utiles
- `npm run dev` — démarre en mode développement (nodemon)
---

## Variables d'environnement (dans `.env`)
Assurez-vous d'au moins renseigner :

```
PORT=8080
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-config.json
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
```

> **Important** : Ne commitez jamais `.env` ni `firebase-config.json`.

---

## Endpoints principaux
Utilisez `{{base_url}} = http://localhost:8080` (ou la valeur de `PORT`, par ex. `8080`). Voici un extrait utile :

### Auth
- POST /api/auth/register — body { email, password }
- POST /api/auth/login — body { email, password } → renvoie `access_token` & `refresh_token`
- POST /api/auth/refresh — body { refresh_token } → renvoie nouveaux tokens

### Authors (Auteurs)
- GET /api/authors — lister tous
- GET /api/authors/:id — obtenir un auteur
- POST /api/authors — **protégé** (Bearer token) → créer un auteur
- PUT /api/authors/:id — **protégé** → modifier
- DELETE /api/authors/:id — **protégé** → supprimer

### Books (Livres)
- GET /api/books?page=1&limit=10&q=&available=true — pagination, recherche et filtre
- GET /api/books/:id — détails
- POST /api/books — **protégé** → créer un livre
  - Vous pouvez soit fournir `author_id` (UUID), soit un objet `author` pour créer l'auteur automatiquement :
    ```json
    {
      "title":"Wiliam livre",
      "author": { "name":"wili ismail", "birth_year":1970 },
      "isbn":"9781234567890",
      "published_year":2020,
      "pages":100
    }
    ```
- PUT /api/books/:id — **protégé** → modifier
- DELETE /api/books/:id — **protégé** → supprimer

---

## Test avec Postman
- Importez la collection : `postman/projet-biblio.postman_collection.json` (déjà incluse dans le repo).
- Créez un Environment avec `base_url = http://localhost:8080` (ou votre URL) et les variables `access_token`, `refresh_token`, `last_author_id`, `last_book_id`.
- Lancez d'abord **Auth / Login** (les Tests enregistrent automatiquement `access_token` et `refresh_token`).
- Exécutez ensuite les requêtes protégées (les pré-requests ajoutent l'en-tête `Authorization`).

---

## Seed (données d'exemple)
Le script `scripts/seed.js` insère :
- 3 auteurs
- 3 livres (référençant les auteurs)
- 2 utilisateurs (mot de passe hashé)



---

## Debug & erreurs courantes
- `JWT_ACCESS_SECRET not set` → vérifiez votre `.env` (pas d'espaces autour de `=`) et redémarrez le serveur.
- `Missing token` → ajoutez `Authorization: Bearer <access_token>` (Postman : onglet Authorization ou header manuel).
- ISBN duplicate → le serveur renvoie 409 (vérifiez la valeur `isbn`).

---




