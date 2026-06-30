// Firebase Admin SDK initialization for the backend
// The Admin SDK has special privileges:
// - Can bypass Security Rules
// - Can create/delete users
// - Can read/write any data
// This is why we keep it ONLY on the server, never on the frontend

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

// __dirname is not available in ES modules, so we recreate it
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// Load the service account key JSON file
// This file is downloaded from Firebase Console -> Project Settings -> Service accounts
const serviceAccountPath = join(__dirname, '../../src/firebase/serviceAccountKey.json');
const serviceAccount     = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Initialize the admin app (only do this once)
// We check if it's already initialized to prevent errors during hot reload
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

// Export the services we'll use in the backend
export const adminAuth = admin.auth();       // Manage users (create, delete, disable)
export const adminDb   = admin.firestore();  // Read/write Firestore with admin privileges
export const adminRtdb = admin.database();   // Read/write Realtime Database

export default admin;
