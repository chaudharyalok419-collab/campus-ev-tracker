# Deployment guide

## Backend → Render

1. Push your code to GitHub (see below for git instructions).
2. Go to https://render.com → New → Web Service → connect your GitHub repo.
3. Set:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
4. Add environment variables under the Environment tab — copy every key from `backend/.env`, including `FIREBASE_DATABASE_URL` and `ADMIN_SETUP_KEY`.
5. For the service account key: don't commit the JSON file. Instead, open it locally, copy its full contents, and add it as a single environment variable (e.g. `FIREBASE_SERVICE_ACCOUNT_JSON`), then update `backend/src/config/firebase.js` to read from `process.env.FIREBASE_SERVICE_ACCOUNT_JSON` (JSON.parse it) when running in production, falling back to the local file in development.
6. Deploy. Render gives you a URL like `https://campus-ev-tracker-backend.onrender.com`.

## Frontend → Vercel

1. Go to https://vercel.com → Add New → Project → import your GitHub repo.
2. Set:
   - Root directory: `client`
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add environment variables — copy every `VITE_*` key from `client/.env`, but set `VITE_API_BASE_URL` to your Render backend URL from above.
4. Deploy. Vercel gives you a URL like `https://campus-ev-tracker.vercel.app`.

## Connect them together

Back in `backend/src/server.js`, the CORS config already allows `https://campus-ev-tracker.vercel.app` — update that string to match your actual Vercel URL, commit, and redeploy the backend.

## GitHub upload guide

```bash
cd campus-ev-tracker
git add .
git status   # double check .env and serviceAccountKey.json are NOT listed
git commit -m "Initial commit: Campus EV Tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/campus-ev-tracker.git
git push -u origin main
```

If `git status` shows `.env` or `serviceAccountKey.json` as staged, stop — check your `.gitignore` is in the project root and run `git rm --cached <file>` to unstage it before committing.
