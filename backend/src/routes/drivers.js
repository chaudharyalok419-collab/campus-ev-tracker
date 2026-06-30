// Driver routes - CRUD operations for drivers

import express from 'express';
import { adminAuth, adminDb, adminRtdb } from '../config/firebase.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const snapshot = await adminDb
    .collection('drivers')
    .where('isActive', '==', true)
    .orderBy('name')
    .get();

  const drivers = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      uid:           data.uid,
      name:          data.name,
      phone:         data.phone,
      vehicleNumber: data.vehicleNumber,
      status:        data.status,
    };
  });

  res.json({ success: true, data: drivers });
});

router.get('/:uid', verifyToken, verifyAdmin, async (req, res) => {
  const { uid } = req.params;

  const doc = await adminDb.collection('drivers').doc(uid).get();

  if (!doc.exists) throw createError(404, 'Driver not found');

  res.json({ success: true, data: doc.data() });
});

router.put('/:uid', verifyToken, verifyAdmin, async (req, res) => {
  const { uid } = req.params;
  const updates  = req.body;

  delete updates.uid;
  delete updates.createdAt;

  if (updates.name) {
    await adminAuth.updateUser(uid, { displayName: updates.name });
  }

  await adminDb.collection('drivers').doc(uid).update({
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  const updatedDoc = await adminDb.collection('drivers').doc(uid).get();

  res.json({
    success: true,
    message: 'Driver updated successfully',
    data:    updatedDoc.data(),
  });
});

router.patch('/:uid/status', verifyToken, verifyAdmin, async (req, res) => {
  const { uid }      = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    throw createError(400, 'isActive must be a boolean');
  }

  await adminAuth.updateUser(uid, { disabled: !isActive });

  await adminDb.collection('drivers').doc(uid).update({
    isActive,
    updatedAt: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: `Driver ${isActive ? 'enabled' : 'disabled'} successfully`,
  });
});

router.delete('/:uid', verifyToken, verifyAdmin, async (req, res) => {
  const { uid } = req.params;

  await adminAuth.deleteUser(uid);
  await adminDb.collection('drivers').doc(uid).delete();
  await adminRtdb.ref(`/drivers/${uid}`).remove();

  res.json({
    success: true,
    message: 'Driver deleted successfully',
  });
});

router.get('/:uid/rides', verifyToken, async (req, res) => {
  const { uid }       = req.params;
  const requestingUid = req.user.uid;

  const userRecord = await adminAuth.getUser(requestingUid);
  const isAdmin    = userRecord.customClaims?.admin;
  const isSelf     = requestingUid === uid;

  if (!isAdmin && !isSelf) {
    throw createError(403, 'Access denied');
  }

  const snapshot = await adminDb
    .collection('rides')
    .where('driverUid', '==', uid)
    .orderBy('startTime', 'desc')
    .limit(50)
    .get();

  const rides = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  res.json({ success: true, data: rides });
});

export default router;
