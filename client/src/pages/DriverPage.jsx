// DriverPage - the main dashboard a driver sees after logging in.
// Controls GPS sharing (start/stop ride), status, seat count, and shows incoming pickup requests.

import { useState, useEffect, useCallback } from 'react';
import { LogOut, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RideControls from '../components/driver/RideControls';
import PickupRequestList from '../components/driver/PickupRequestList';
import {
  startLocationSharing,
  stopLocationSharing,
  updateDriverStatus,
  listenToPickupRequests,
} from '../firebase/driverService';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const DriverPage = () => {
  const { currentUser, userProfile, logout } = useAuth();

  const [isSharing, setIsSharing] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [status, setStatus] = useState('available');
  const [seatsAvailable, setSeatsAvailable] = useState(4);
  const [gpsError, setGpsError] = useState(null);
  const [requests, setRequests] = useState([]);

  // Subscribe to incoming pickup requests for this driver as soon as the page loads
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = listenToPickupRequests(currentUser.uid, (data) => {
      // Show a toast for newly arrived requests beyond the first load
      setRequests((prev) => {
        if (data.length > prev.length) {
          toast.success('New pickup request received!');
        }
        return data;
      });
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Clean up the GPS watch if the component unmounts while sharing
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const handleStart = useCallback(() => {
    setGpsError(null);
    const id = startLocationSharing(
      currentUser.uid,
      {
        name: userProfile.name,
        phone: userProfile.phone,
        vehicleNumber: userProfile.vehicleNumber,
        status,
        seatsAvailable,
      },
      (error) => {
        setGpsError(error.message);
        toast.error('GPS error: ' + error.message);
      }
    );
    if (id !== null) {
      setWatchId(id);
      setIsSharing(true);
      toast.success('Ride started — sharing your live location');
    }
  }, [currentUser, userProfile, status, seatsAvailable]);

  const handleStop = useCallback(async () => {
    await stopLocationSharing(currentUser.uid, watchId);
    setWatchId(null);
    setIsSharing(false);
    toast.success('Ride stopped');
  }, [currentUser, watchId]);

  const handleToggleStatus = useCallback(async (newStatus) => {
    setStatus(newStatus);
    if (isSharing) {
      await updateDriverStatus(currentUser.uid, newStatus, seatsAvailable);
    }
  }, [currentUser, isSharing, seatsAvailable]);

  const handleChangeSeats = useCallback(async (newCount) => {
    setSeatsAvailable(newCount);
    if (isSharing) {
      await updateDriverStatus(currentUser.uid, status, newCount);
    }
  }, [currentUser, isSharing, status]);

  const handleRespond = async (requestId, action) => {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Request ${action}`);
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
      } else {
        toast.error(data.error || 'Failed to update request');
      }
    } catch {
      toast.error('Could not reach the server');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="text-primary-500" />
          <div>
            <h2 className="leading-tight">Driver dashboard</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{userProfile?.name}</p>
          </div>
        </div>
        <button onClick={logout} className="nav-link">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RideControls
          isSharing={isSharing}
          status={status}
          seatsAvailable={seatsAvailable}
          gpsError={gpsError}
          onStart={handleStart}
          onStop={handleStop}
          onToggleStatus={handleToggleStatus}
          onChangeSeats={handleChangeSeats}
        />

        <div>
          <h3 className="mb-3">Pickup requests</h3>
          <PickupRequestList requests={requests} onRespond={handleRespond} />
        </div>
      </div>
    </div>
  );
};

export default DriverPage;
