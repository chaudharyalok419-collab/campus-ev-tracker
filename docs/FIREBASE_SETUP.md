# Firebase setup guide

## 1. Create the project

1. Go to https://console.firebase.google.com
2. Click "Add project", name it (e.g. `campus-ev-tracker`)
3. Disable Google Analytics (not needed for this project)
4. Click Create project

## 2. Enable Realtime Database

Build → Realtime Database → Create Database → choose a nearby location → Start in **test mode**.

Test mode allows all reads/writes for 30 days. Before going to production, replace the rules with something like:

```json
{
  "rules": {
    "drivers": {
      ".read": true,
      "$uid": {
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "pickupRequests": {
      "$driverUid": {
        ".read": "auth != null && auth.uid == $driverUid",
        ".write": true
      }
    }
  }
}
```

This lets anyone read driver locations (students need this without logging in), but only the driver themselves can write to their own location, and pickup requests can be written by anyone (students) but only read by the target driver.

## 3. Enable Firestore

Build → Firestore Database → Create database → Start in **test mode** → choose a location.

Suggested production rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /drivers/{driverId} {
      allow read: if true;
      allow write: if false; // only backend (Admin SDK) writes here
    }
    match /vehicles/{vehicleId} {
      allow read: if true;
      allow write: if false;
    }
    match /admins/{adminId} {
      allow read, write: if false;
    }
    match /pickupRequests/{requestId} {
      allow read, write: if false;
    }
    match /rides/{rideId} {
      allow read, write: if false;
    }
  }
}
```

All writes go through the backend (using the Admin SDK, which bypasses these rules entirely), so locking client writes to `false` is safe and recommended.

## 4. Enable Authentication

Build → Authentication → Get started → Sign-in method → Email/Password → Enable.

## 5. Get your web app config (for the frontend)

Project Settings (gear icon) → scroll to "Your apps" → click the `</>` icon → register an app (any nickname) → copy the `firebaseConfig` values into `client/.env`.

## 6. Get your service account key (for the backend)

Project Settings → Service accounts tab → Generate new private key → confirm. A JSON file downloads.

Move/rename it to:

```
backend/src/firebase/serviceAccountKey.json
```

This file grants full admin access to your Firebase project. Never commit it, never share it, never put it in a public repo. It's already listed in `.gitignore`.

## 7. Fill in your database URL

In the Realtime Database section of the console, copy the URL shown at the top (looks like `https://your-project-default-rtdb.firebaseio.com`) into both:
- `client/.env` as `VITE_FIREBASE_DATABASE_URL`
- `backend/.env` as `FIREBASE_DATABASE_URL`
