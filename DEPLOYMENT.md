# CodeNova — Deployment Guide

This project deploys across **3 platforms** because each component has different runtime needs:

| Component | Platform | Why |
|---|---|---|
| Frontend (React) | **Vercel** | Best-in-class CDN for static SPAs |
| Backend (Node/Express) | **Railway** | Persistent Node.js server, free tier |
| ML Pipeline (Python/FastAPI) | **Railway** | Persistent Python process, free tier |

---

## Prerequisites

1. **GitHub account** — https://github.com
2. **Vercel account** — https://vercel.com (sign in with GitHub)
3. **Railway account** — https://railway.app (sign in with GitHub)

---

## Step 1 — Push to GitHub

```powershell
cd C:\Autodesk\CodeNova
git init
git add .
git commit -m "Initial commit: CodeNova platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CodeNova.git
git push -u origin main
```

---

## Step 2 — Deploy Backend on Railway

1. Go to https://railway.app/new → **Deploy from GitHub repo** → `CodeNova`
2. **Root Directory** → `backend`
3. Click **Variables** and add these:

```
NODE_ENV=production
PORT=5000
ML_SERVICE_URL=https://YOUR-ML-URL-FROM-STEP-3
ML_SERVICE_TIMEOUT_MS=30000
ANTHROPIC_AUTH_TOKEN=your_openrouter_key_here
ANTHROPIC_BASE_URL=https://openrouter.ai/api
ANTHROPIC_MODEL=google/gemini-2.0-flash-001
JWT_SECRET=change-this-to-a-long-random-string
FRONTEND_URL=https://codenova.vercel.app
```

4. Click **Deploy** (~1-2 min)
5. **Settings** → **Networking** → **Generate Domain**
6. Test: `https://YOUR-BACKEND-URL/api/v1/health` → `{"success":true,...}`

Railway uses `npm run build` as the build command and `npm start` as the start command.

---

## Step 3 — Deploy ML Service on Railway

1. Deploy the same GitHub repository as a separate Railway service.
2. Set **Root Directory** to `ai-ml/pipeline_service`.
3. Railway uses `requirements.txt` and starts `uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Generate a public domain and test `https://YOUR-ML-URL/health`.
5. Set the backend `ML_SERVICE_URL` variable to that public ML URL, then redeploy the backend.

---

## Step 4 — Deploy Frontend on Vercel

### Option A — Vercel Dashboard (easier)

1. Go to https://vercel.com/new
2. **Import** `CodeNova` from GitHub
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Environment Variables** and add:

```
VITE_API_BASE_URL=https://YOUR-BACKEND-URL/api/v1
```

5. Click **Deploy** (~1 min)
6. Your app is live at `https://codenova-XXXX.vercel.app`

### Option B — Vercel CLI

```powershell
cd C:\Autodesk\CodeNova\frontend
npm install -g vercel
vercel login
vercel env add VITE_API_BASE_URL production
# Paste: https://YOUR-BACKEND-URL/api/v1
vercel --prod
```

---

## Step 5 — Update Backend CORS

After Vercel gives you a URL, update the backend's `FRONTEND_URL` env var on Railway:

1. Go to Railway → your backend service → **Variables**
2. Set `FRONTEND_URL` to your Vercel URL (e.g., `https://codenova.vercel.app`)
3. Railway will auto-redeploy

---

## Final URL Map

| Service | URL | Platform |
|---|---|---|
| Frontend | `https://codenova.vercel.app` | Vercel |
| Backend API | `https://codenova-backend.up.railway.app/api/v1` | Railway |
| ML Pipeline | `https://codenova-ml.up.railway.app` | Railway |

Frontend talks to Backend → Backend talks to ML Service.

---

## Costs

| Platform | Free Tier | What's included |
|---|---|---|
| Vercel | Generous | 100 GB bandwidth/mo, unlimited sites |
| Railway | $5/mo credit | ~500 hrs runtime, 8 GB RAM |
| **Total** | **~$0-5/mo** | Full stack for a demo |

---

## Troubleshooting

### Vercel shows `{"detail":"Not Found"}` or `Route GET / not found`

These responses are from the Express backend, not the React application. In the Vercel project settings, set **Root Directory** to `frontend`. Do not deploy from the repository root or point the project at `backend/src/server.ts`.

Use these exact frontend settings:

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

The frontend's `vercel.json` is loaded because the project root is `frontend`. The backend remains a separate service.
This app uses internal state navigation rather than React Router, so no catch-all rewrite is needed; this also prevents API requests from being served `index.html`.

### "Module not found" on Vercel
→ Make sure `Root Directory` is set to `frontend` (not the repo root).

### Backend can't reach ML service
→ Check `ML_SERVICE_URL` env var on Railway. The ML service must be running first.

### CORS errors in browser
→ Make sure `FRONTEND_URL` on Railway matches your Vercel URL exactly (no trailing slash).

### ML service build fails on Railway
→ LightGBM needs `libgomp1` system lib. The `Aptfile` + `nixpacks.toml` handle this. If it still fails, check Railway build logs.

### "ANTHROPIC_AUTH_TOKEN is invalid"
→ Get a free key at https://openrouter.ai/keys

---

## How to redeploy after changes

```powershell
git add .
git commit -m "Updated feature X"
git push
```

- Vercel auto-redeploys on git push
- Railway auto-redeploys on git push

---

**That's the whole deployment. 3 platforms, 3 services, ~20 minutes total.**
