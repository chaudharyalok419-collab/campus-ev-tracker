// Vehicle management routes

import express from 'express';
import { adminDb } from '../config/firebase.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const snapshot = await adminDb
    .collection('vehicles')
    .orderBy('vehicleNumber')
    .get();

  const vehicles = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  res.json({ success: true, data: vehicles });
});

router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { vehicleNumber, model, capacity, color, assignedDriverUid } = req.body;

  if (!vehicleNumber || !model || !capacity) {
    throw createError(400, 'Vehicle number, model, and capacity are required');
  }

  const existing = await adminDb
    .collection('vehicles')
    .where('vehicleNumber', '==', vehicleNumber)
    .get();

  if (!existing.empty) {
    throw createError(409, 'Vehicle with this number already exists');
  }

  const vehicleData = {
    vehicleNumber,
    model,
    capacity:          parseInt(capacity),
    color:             color || '#22c55e',
    assignedDriverUid: assignedDriverUid || null,
    status:            'inactive',
    batteryLevel:      null,
    createdAt:         new Date().toISOString(),
    updatedAt:         new Date().toISOString(),
  };

  const docRef = await adminDb.collection('vehicles').add(vehicleData);

  res.status(201).json({
    success: true,
    message: 'Vehicle added successfully',
    data:    { id: docRef.id, ...vehicleData },
  });
});

router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id }  = req.params;
  const updates = req.body;

  delete updates.createdAt;

  const docRef = adminDb.collection('vehicles').doc(id);
  const doc    = await docRef.get();

  if (!doc.exists) throw createError(404, 'Vehicle not found');

  await docRef.update({
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  res.json({ success: true, message: 'Vehicle updated' });
});

router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  const doc = await adminDb.collection('vehicles').doc(id).get();
  if (!doc.exists) throw createError(404, 'Vehicle not found');

  await adminDb.collection('vehicles').doc(id).delete();

  res.json({ success: true, message: 'Vehicle deleted' });
});

export default router;
