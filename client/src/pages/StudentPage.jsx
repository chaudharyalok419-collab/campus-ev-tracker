// StudentPage - the main page students land on. No login required.
// Shows the live map, a searchable list of EVs, nearest EV highlight, call/request actions.

import { useState, useMemo } from 'react';
import { Search, MapPin, Zap } from 'lucide-react';
import LiveMap from '../components/map/LiveMap';
import EVCard from '../components/student/EVCard';
import PickupRequestModal from '../components/student/PickupRequestModal';
import EmptyState from '../components/common/EmptyState';
import { MapSkeleton, ListSkeleton } from '../components/common/LoadingSkeleton';
import { useDrivers } from '../hooks/useDrivers';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDistance, findNearestEV } from '../utils/distance';
import { formatPhoneForCall } from '../utils/validators';
import toast from 'react-hot-toast';

const CAMPUS_CENTER = {
  lat: parseFloat(import.meta.env.VITE_CAMPUS_LAT) || 28.6139,
  lng: parseFloat(import.meta.env.VITE_CAMPUS_LNG) || 77.2090,
};
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const StudentPage = () => {
  const { drivers, loading } = useDrivers();
  const { location: userLocation } = useGeolocation();
  const [search, setSearch] = useState('');
  const [requestModalDriver, setRequestModalDriver] = useState(null);

  // Filter EVs by vehicle number or driver name
  const filteredDrivers = useMemo(() => {
    if (!search.trim()) return drivers;
    const q = search.toLowerCase();
    return drivers.filter(
      d => d.vehicleNumber?.toLowerCase().includes(q) || d.name?.toLowerCase().includes(q)
    );
  }, [drivers, search]);

  // Sort by distance from student when we know their location
  const sortedDrivers = useMemo(() => {
    if (!userLocation) return filteredDrivers;
    return [...filteredDrivers]
      .map(d => ({
        ...d,
        _distance: calculateDistance(userLocation.lat, userLocation.lng, d.location.lat, d.location.lng),
      }))
      .sort((a, b) => a._distance - b._distance);
  }, [filteredDrivers, userLocation]);

  const nearestEV = useMemo(() => {
    if (!userLocation || drivers.length === 0) return null;
    return findNearestEV(userLocation.lat, userLocation.lng, drivers);
  }, [userLocation, drivers]);

  const handleCall = (driver) => {
    if (!driver.phone) {
      toast.error('Driver phone number not available');
      return;
    }
    window.location.href = `tel:${formatPhoneForCall(driver.phone)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="flex items-center gap-2">
            <Zap className="text-primary-500" /> Campus EV Tracker
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {drivers.length} EV{drivers.length !== 1 ? 's' : ''} online right now
          </p>
        </div>
      </div>

      {nearestEV && (
        <div className="glass-card p-4 mb-6 flex items-center gap-3 border-l-4 border-primary-500">
          <MapPin className="text-primary-500 shrink-0" />
          <p className="text-sm">
            Nearest EV: <strong>{nearestEV.vehicleNumber || nearestEV.name}</strong> is about{' '}
            <strong>{Math.round(nearestEV.distance * 1000)}m</strong> away.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <MapSkeleton />
          ) : (
            <LiveMap
              drivers={sortedDrivers}
              userLocation={userLocation}
              campusCenter={CAMPUS_CENTER}
              onCallDriver={handleCall}
              onRequestPickup={setRequestModalDriver}
            />
          )}
        </div>

        <div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by vehicle number or driver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {loading ? (
            <ListSkeleton count={3} />
          ) : sortedDrivers.length === 0 ? (
            <EmptyState
              icon={Zap}
              title="No EVs online"
              description="Check back soon — drivers haven't started sharing their location yet."
            />
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
              {sortedDrivers.map((driver) => (
                <EVCard
                  key={driver.uid}
                  driver={driver}
                  distance={driver._distance}
                  onCall={handleCall}
                  onRequest={setRequestModalDriver}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {requestModalDriver && (
        <PickupRequestModal
          driver={requestModalDriver}
          userLocation={userLocation}
          apiBaseUrl={API_BASE_URL}
          onClose={() => setRequestModalDriver(null)}
        />
      )}
    </div>
  );
};

export default StudentPage;
