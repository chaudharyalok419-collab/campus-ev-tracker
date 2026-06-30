// Functions for STUDENTS to read live EV data
// Students never write to Firebase - only read

import { ref, onValue, off } from 'firebase/database';
import { rtdb } from './config';

export const subscribeToAllDrivers = (callback) => {
  const driversRef = ref(rtdb, 'drivers');

  const handleSnapshot = (snapshot) => {
    const data = snapshot.val() || {};

    const drivers = Object.values(data).filter(
      driver => driver.isOnline && driver.location
    );

    callback(drivers);
  };

  onValue(driversRef, handleSnapshot);

  return () => off(driversRef, 'value', handleSnapshot);
};

export const subscribeToDriver = (driverUid, callback) => {
  const driverRef = ref(rtdb, `drivers/${driverUid}`);

  const handleSnapshot = (snapshot) => {
    callback(snapshot.val());
  };

  onValue(driverRef, handleSnapshot);

  return () => off(driverRef, 'value', handleSnapshot);
};
