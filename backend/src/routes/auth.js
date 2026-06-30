// Authentication routes
// Handles: creating drivers, setting roles, getting current user info

import express from 'express';
import { adminAuth, adminDb } from '../config/firebase.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/create-driver', verifyToken, verifyAdmin, async (req, res) => {
  const { email, password, name, phone, vehicleNumber, licenseNumber } = req.body;

  if (!email || !password || !name || !phone) {
    throw createError(400, 'Email, password, name, and phone are required');
  }

  const userRecord = await adminAuth.createUser({
    email,
    password,
    displayName: name,
    phoneNumber: phone.startsWith('+') ? phone : `+91${phone}`,
  });

  await adminAuth.setCustomUserClaims(userRecord.uid, { driver: true });

  const driverData = {
    uid:           userRecord.uid,
    name,
    email,
    phone,
    vehicleNumber: vehicleNumber || null,
    licenseNumber: licenseNumber || null,
    status:        'offline',
    isActive:      true,
    createdAt:     new Date().toISOString(),
    updatedAt:     new Date().toISOString(),
    stats: {
      totalRides:    0,
      totalDistance: 0,
    },
  };

  await adminDb.collection('drivers').doc(userRecord.uid).set(driverData);

  res.status(201).json({
    success: true,
    message: 'Driver created successfully',
    data: {
      uid:   userRecord.uid,
      email: userRecord.email,
      name,
    },
  });
});

router.get('/me', verifyToken, async (req, res) => {
  const { uid } = req.user;

  const driverDoc = await adminDb.collection('drivers').doc(uid).get();

  if (driverDoc.exists) {
    return res.json({
      success: true,
      data: {
        ...driverDoc.data(),
        role: 'driver',
      },
    });
  }

  const adminDoc = await adminDb.collection('admins').doc(uid).get();

  if (adminDoc.exists) {
    return res.json({
      success: true,
      data: {
        ...adminDoc.data(),
        role: 'admin',
      },
    });
  }

  throw createError(404, 'User profile not found');
});

router.post('/set-admin', verifyToken, verifyAdmin, async (req, res) => {
  const { uid } = req.body;

  if (!uid) throw createError(400, 'User UID is required');

  await adminAuth.setCustomUserClaims(uid, { admin: true });

  await adminDb.collection('admins').doc(uid).set({
    uid,
    role:      'admin',
    createdAt: new Date().toISOString(),
    createdBy: req.user.uid,
  }, { merge: true });

  res.json({
    success: true,
    message: `User ${uid} is now an admin`,
  });
});

export default router;
