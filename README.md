# Campus EV Tracker

Live GPS tracking for campus electric vehicles. Drivers share their location in real time; students see every EV on a map, the nearest one, ETA, and can call or request pickup. Admins manage drivers and vehicles from a dashboard.

## Stack

Frontend: React 18 + Vite, Tailwind CSS, React Router, React Leaflet (OpenStreetMap)
Backend: Node.js + Express
Data: Firebase Realtime Database (live GPS, pickup requests), Firestore (drivers, vehicles, ride history), Firebase Authentication (driver/admin login)

## Project structure

```
campus-ev-tracker/
  client/      React frontend (Vite)
  backend/     Express API
  docs/        Setup and deployment guides
```

## Prerequisites

- Node.js 18 or later (check with `node --version`)
- A free Firebase project (see `docs/FIREBASE_SETUP.md`)
- Git

## Quick start

### 1. Clone and install

```bash
cd campus-ev-tracker

cd backend
npm install

cd ../client
npm install
```

### 2. Configure environment variables

Copy the example env files and fill in your real Firebase values (see `docs/FIREBASE_SETUP.md` for where to get each one):

```bash
cp backend/.env.example backend/.env
cp client/.env.example client/.env
```

Edit `backend/.env` and `client/.env` with your actual Firebase project values.

### 3. Get your Firebase service account key

Firebase Console → Project Settings → Service accounts → Generate new private key. Save the downloaded file as:

```
backend/src/firebase/serviceAccountKey.json
```

This file is git-ignored and must never be committed.

### 4. Run both servers

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd client
npm run dev
```

Backend runs at `http://localhost:3000`. Frontend runs at `http://localhost:5173`.

### 5. Create your first admin account

With the backend running, send one request (replace the secret key with the one you set as `ADMIN_SETUP_KEY` in `backend/.env`):

```bash
curl -X POST http://localhost:3000/api/v1/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "ChangeMe123!",
    "name": "Admin",
    "secretKey": "change-this-to-a-random-secret-before-using"
  }'
```

Then log in at `http://localhost:5173/admin/login`. From there, use "Add driver" to create driver accounts — drivers log in at `/driver/login`.

**Important**: after creating your first admin, remove or comment out the `/setup` route in `backend/src/routes/admin.js` so nobody else can create admin accounts.

## How the pieces fit together

- Students visit `/` — no login. They see a live map and list of EVs pulled from Firebase Realtime Database.
- Drivers log in at `/driver/login`, then press "Start ride." The browser's `navigator.geolocation.watchPosition()` streams GPS coordinates straight into Firebase Realtime Database — every connected student's browser updates instantly.
- Admins log in at `/admin/login` to add/remove/disable drivers and view stats. Admin actions go through the Express backend, which uses the Firebase Admin SDK to make privileged changes (create users, disable accounts).

## Full documentation

- `docs/FIREBASE_SETUP.md` — step-by-step Firebase project setup
- `docs/DEPLOYMENT.md` — deploying frontend to Vercel and backend to Render
- `docs/API.md` — full API reference
- `docs/ENV_VARIABLES.md` — every environment variable explained
- `docs/TROUBLESHOOTING.md` — common errors and fixes

## Known limitations of this build

- The admin "Edit driver" button is a placeholder — edit driver records directly in the Firestore console for now, or extend `AddDriverModal.jsx` pattern into an edit form.
- Push notifications, QR codes per EV, and battery percentage are stubbed as future work — the architecture (Firebase + REST API) supports adding them without restructuring.
- Firebase Security Rules are not included here — the setup guide tells you how to lock down "test mode" rules before going to production.
