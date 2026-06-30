import { adminAuth } from './src/config/firebase.js';

console.log("Script started");

const uid = 'SnIhXGulHmZRQcr6R11szXvTjU23';

try {
  await adminAuth.setCustomUserClaims(uid, {
    admin: true,
  });

  console.log("Admin claim added successfully!");
} catch (error) {
  console.error("Error:", error);
}