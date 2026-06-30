// Admin-only routes - statistics, reports, management

import express from 'express';
import { adminAuth, adminDb, adminRtdb } from '../config/firebase.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
  const [
    driversSnapshot,
    vehiclesSnapshot,
    ridesSnapshot,
    requestsSnapshot,
  ] = await Promise.all([
    adminDb.collection('drivers').get(),
    adminDb.collection('vehicles').get(),
    adminDb.collection('rides').get(),
    adminDb.collection('pickupRequests').where('status', '==', 'pending').get(),
  ]);

  const liveDriversSnapshot = await adminRtdb.ref('/drivers').once('value');
  const liveDrivers         = liveDriversSnapshot.val() || {};
  const activeDriverCount   = Object.values(liveDrivers)
    .filter(d => d.status === 'on_ride')
    .length;

  res.json({
    success: true,
    data: {
      totalDrivers:    driversSnapshot.size,
      activeDrivers:   activeDriverCount,
      totalVehicles:   vehiclesSnapshot.size,
      totalRides:      ridesSnapshot.size,
      pendingRequests: requestsSnapshot.size,
    },
  });
});

router.get('/rides', verifyToken, verifyAdmin, async (req, res) => {
  const limit     = parseInt(req.query.limit) || 20;
  const startDate = req.query.startDate;

  let query = adminDb
    .collection('rides')
    .orderBy('startTime', 'desc')
    .limit(limit);

  if (startDate) {
    query = query.where('startTime', '>=', startDate);
  }

  const snapshot = await query.get();
  const rides    = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  res.json({ success: true, data: rides });
});

router.post('/setup', async (req, res) => {
  const { email, password, name, secretKey } = req.body;

  if (secretKey !== process.env.ADMIN_SETUP_KEY) {
    return res.status(403).json({
      success: false,
      error:   'Invalid setup key',
    });
  }

  const userRecord = await adminAuth.createUser({
    email,
    password,
    displayName: name,
  });

  await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true });

  await adminDb.collection('admins').doc(userRecord.uid).set({
    uid:       userRecord.uid,
    name,
    email,
    role:      'admin',
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    message: 'Admin account created successfully',
    uid:     userRecord.uid,
  });
});

export default router;
