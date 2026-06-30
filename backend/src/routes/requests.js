// Pickup request routes

import express from 'express';
import { adminDb, adminRtdb } from '../config/firebase.js';
import { verifyToken, verifyDriver } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    studentName,
    studentPhone,
    pickupLocation,
    targetDriverUid,
    notes,
  } = req.body;

  const requestData = {
    studentName:    studentName || 'Anonymous',
    studentPhone:   studentPhone || null,
    pickupLocation,
    targetDriverUid,
    notes:          notes || '',
    status:         'pending',
    createdAt:      new Date().toISOString(),
    updatedAt:      new Date().toISOString(),
  };

  const docRef = await adminDb.collection('pickupRequests').add(requestData);

  await adminRtdb
    .ref(`/pickupRequests/${targetDriverUid}/${docRef.id}`)
    .set({
      ...requestData,
      id: docRef.id,
    });

  res.status(201).json({
    success: true,
    message: 'Pickup request sent',
    data:    { id: docRef.id },
  });
});

router.patch('/:id/status', verifyToken, verifyDriver, async (req, res) => {
  const { id }     = req.params;
  const { status } = req.body;

  const validStatuses = ['accepted', 'declined', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error:   'Status must be accepted, declined, or completed',
    });
  }

  await adminDb.collection('pickupRequests').doc(id).update({
    status,
    updatedAt:  new Date().toISOString(),
    respondedBy: req.user.uid,
  });

  const driverUid = req.user.uid;
  await adminRtdb
    .ref(`/pickupRequests/${driverUid}/${id}/status`)
    .set(status);

  res.json({ success: true, message: `Request ${status}` });
});

router.get('/driver/:uid', verifyToken, verifyDriver, async (req, res) => {
  const { uid } = req.params;

  const snapshot = await adminDb
    .collection('pickupRequests')
    .where('targetDriverUid', '==', uid)
    .where('status', '==', 'pending')
    .orderBy('createdAt', 'desc')
    .get();

  const requests = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  res.json({ success: true, data: requests });
});

export default router;
