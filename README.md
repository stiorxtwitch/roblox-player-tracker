# Roblox Player Tracker

Projet simple : Roblox -> API Vercel -> Supabase -> site web.

## 1. Supabase

Dans SQL Editor, exécute `supabase.sql`.

## 2. Vercel

Ajoute ces variables d'environnement :

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ROBLOX_API_KEY`

Ne mets jamais la `SUPABASE_SERVICE_ROLE_KEY` dans Roblox ou GitHub.

## 3. Roblox

Dans Roblox Studio :
- active `Game Settings > Security > Allow HTTP Requests`
- ouvre `roblox/PlayerTracker.server.lua`
- remplace `API_URL` par ton URL Vercel
- remplace `API_KEY` par la même valeur que `ROBLOX_API_KEY`

Place le script dans `ServerScriptService`.

## 4. Déploiement

Importe ce dépôt GitHub dans Vercel.

Le site sera disponible à la racine de ton domaine Vercel.
