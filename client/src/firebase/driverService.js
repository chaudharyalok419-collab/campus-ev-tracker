// Functions for the DRIVER to update their own live location and status

import { ref, set, onValue, off, onDisconnect, update } from 'firebase/database';
import { rtdb } from './config';

export const startLocationSharing = (driverUid, vehicleInfo, onError) => {
  if (!navigator.geolocation) {
    onError?.(new Error('Geolocation is not supported by your browser'));
    return null;
  }

  const driverRef = ref(rtdb, `drivers/${driverUid}`);

  onDisconnect(driverRef).update({
    status: 'offline',
    isOnline: false,
  });

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, speed, heading, accuracy } = position.coords;

      set(driverRef, {
        uid: driverUid,
        name: vehicleInfo.name,
        phone: vehicleInfo.phone,
        vehicleNumber: vehicleInfo.vehicleNumber,
        location: {
          lat: latitude,
          lng: longitude,
          accuracy,
          speed: speed || 0,
          heading: heading || 0,
        },
        status: vehicleInfo.status || 'available',
        seatsAvailable: vehicleInfo.seatsAvailable ?? 4,
        isOnline: true,
        lastUpdated: Date.now(),
      });
    },
    (error) => {
      onError?.(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 3000,
      timeout: 10000,
    }
  );

  return watchId;
};

export const stopLocationSharing = async (driverUid, watchId) => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }

  const driverRef = ref(rtdb, `drivers/${driverUid}`);
  await set(driverRef, {
    uid: driverUid,
    isOnline: false,
    status: 'offline',
    lastUpdated: Date.now(),
  });
};

export const updateDriverStatus = async (driverUid, status, seatsAvailable) => {
  const updates = { status, lastUpdated: Date.now() };
  if (seatsAvailable !== undefined) {
    updates.seatsAvailable = seatsAvailable;
  }

  await update(ref(rtdb, `drivers/${driverUid}`), updates);
};

export const listenToPickupRequests = (driverUid, callback) => {
  const requestsRef = ref(rtdb, `pickupRequests/${driverUid}`);

  const handleSnapshot = (snapshot) => {
    const data = snapshot.val() || {};
    const requests = Object.entries(data)
      .map(([id, req]) => ({ id, ...req }))
      .filter(req => req.status === 'pending')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    callback(requests);
  };

  onValue(requestsRef, handleSnapshot);

  return () => off(requestsRef, 'value', handleSnapshot);
};
