# Deployment

## Live Application

🌐 **https://anchorflow-app.vercel.app/**

## Deploy to Vercel

1. Fork or clone the repository: `https://github.com/efekrbas/anchorflow`
2. Go to [vercel.com](https://vercel.com) and import your GitHub repository
3. Set the following environment variables in Vercel dashboard:
   - `STELLAR_SECRET_KEY` — Your Stellar secret key
   - `STELLAR_PUBLIC_KEY` — Your Stellar public key
   - `ANCHOR_DOMAIN` — The anchor domain (e.g., `testanchor.stellar.org`)
4. Click **Deploy**

The `vercel.json` in the project root handles routing automatically:
- `/` → Dashboard (static HTML)
- `/api/*` → Backend service (Node.js)

## Docker (Local Development)

```bash
docker-compose up -d
# Backend available at http://localhost:3001
```
