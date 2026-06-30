# Environment variables guide

## backend/.env

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server listens on | `3000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `CLIENT_URL` | Frontend origin allowed by CORS | `http://localhost:5173` |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Path to the downloaded service account JSON | `./src/firebase/serviceAccountKey.json` |
| `FIREBASE_DATABASE_URL` | Realtime Database URL from Firebase Console | `https://your-project-default-rtdb.firebaseio.com` |
| `ADMIN_SETUP_KEY` | Secret required to create the first admin via `/admin/setup` | any random string |

## client/.env

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | From Firebase Console → Project Settings → Your apps |
| `VITE_FIREBASE_AUTH_DOMAIN` | Same location |
| `VITE_FIREBASE_DATABASE_URL` | Same as backend's `FIREBASE_DATABASE_URL` |
| `VITE_FIREBASE_PROJECT_ID` | Same location |
| `VITE_FIREBASE_STORAGE_BUCKET` | Same location |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Same location |
| `VITE_FIREBASE_APP_ID` | Same location |
| `VITE_API_BASE_URL` | Where the backend is running | `http://localhost:3000` locally |
| `VITE_CAMPUS_LAT` / `VITE_CAMPUS_LNG` | Center coordinates the map opens to | your campus's coordinates |
| `VITE_CAMPUS_NAME` | Display name only | `My Campus` |

Vite only exposes variables prefixed `VITE_` to browser code — anything without that prefix stays server-side only, which is why the Firebase Admin credentials live in `backend/.env` and never in `client/.env`.
