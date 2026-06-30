# Troubleshooting

**`Error: Cannot find module './src/firebase/serviceAccountKey.json'`**
You haven't downloaded the service account key. Firebase Console → Project Settings → Service accounts → Generate new private key, save to `backend/src/firebase/serviceAccountKey.json`.

**`Error: Firebase App named '[DEFAULT]' already exists`**
Happens during nodemon hot-reload. The code already guards against this with `if (!admin.apps.length)`. If it persists, fully stop and restart `npm run dev`.

**`Error: EADDRINUSE: address already in use :::3000`**
Something else is using port 3000. Change `PORT` in `backend/.env` to `3001`, restart, and update `VITE_API_BASE_URL` in `client/.env` to match.

**Map doesn't show / tiles are blank gray squares**
Make sure `import 'leaflet/dist/leaflet.css'` is present (it's already in `client/src/index.css`). Also check you have internet access — OpenStreetMap tiles load from `tile.openstreetmap.org`.

**Marker icons missing / broken image icons**
This project uses custom `divIcon` markers (see `client/src/components/map/leafletIcons.js`), so this shouldn't happen. If you added your own `<Marker>` without a custom icon, Leaflet's default icon paths break under Vite — the same file patches the default icon URLs to fix this.

**GPS doesn't update / "Geolocation is not supported"**
`navigator.geolocation` only works over `https://` or `localhost` — it's blocked on plain `http://` for any other host. This matters once you deploy: Vercel serves over https by default, so it's fine in production; just don't test GPS sharing over a non-localhost http:// URL.

**Driver login works but immediately logs out / "No profile found"**
The driver's Firebase Auth account exists but has no matching Firestore document. Drivers must be created via the admin's "Add driver" flow (which writes both the Auth user and the Firestore doc together) — not created directly in the Firebase Console's Authentication tab alone.

**CORS error in browser console ("blocked by CORS policy")**
`backend/src/server.js`'s CORS `origin` array must include your frontend's exact URL. Check `CLIENT_URL` in `backend/.env` matches where your frontend is actually running.

**`npm install` fails with 403 or network errors**
Check your internet connection and npm registry access. If you're behind a corporate proxy or firewall, configure `npm config set proxy` accordingly, or try a different network.
