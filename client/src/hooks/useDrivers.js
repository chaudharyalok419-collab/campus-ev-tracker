// Custom hook for the student dashboard - subscribes to all live drivers

import { useState, useEffect } from 'react';
import { subscribeToAllDrivers } from '../firebase/studentService';

export const useDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAllDrivers((data) => {
      setDrivers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { drivers, loading };
};
