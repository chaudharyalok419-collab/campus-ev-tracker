// LiveMap - the core map component shared by the student dashboard.
// Renders OpenStreetMap tiles via React Leaflet, plots every online EV,
// the student's own location, and updates smoothly as Firebase pushes new data.
// No page refresh needed - React Leaflet re-renders markers whenever the `drivers` prop changes.

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { createEVIcon, createUserIcon } from './leafletIcons';
import StatusBadge from '../common/StatusBadge';
import { formatRelativeTime, isLocationStale } from '../../utils/formatTime';
import { calculateDistance, formatDistance, calculateETA } from '../../utils/distance';
import { Phone, Navigation } from 'lucide-react';

// Small internal component that re-centers the map when the user's location
// is first obtained, without forcing a re-center on every single re-render
const RecenterOnFirstFix = ({ userLocation }) => {
  const map = useMap();
  const hasCentered = useRef(false);

  useEffect(() => {
    // Force Leaflet to recalculate map size
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    if (userLocation && !hasCentered.current) {
      map.setView([userLocation.lat, userLocation.lng], 16);
      hasCentered.current = true;
    }
  }, [userLocation, map]);

  return null;
};

const LiveMap = ({
  drivers = [],
  userLocation,
  campusCenter,
  onSelectDriver,
  onCallDriver,
  onRequestPickup,
}) => {
  return (
    <div className="map-container">
      <MapContainer
        center={[campusCenter.lat, campusCenter.lng]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        {/* OpenStreetMap tiles - free, no API key required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterOnFirstFix userLocation={userLocation} />

        {/* Student's own location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserIcon()}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* One marker per online EV */}
        {drivers.map((driver) => {
          const stale = isLocationStale(driver.lastUpdated);

          const distance = userLocation
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                driver.location.lat,
                driver.location.lng
              )
            : null;

          return (
            <Marker
              key={driver.uid}
              position={[driver.location.lat, driver.location.lng]}
              icon={createEVIcon(driver.status, driver.location.heading)}
              eventHandlers={{
                click: () => onSelectDriver?.(driver),
              }}
            >
              <Popup minWidth={220}>
                <div className="space-y-2 font-sans">
                  <div className="flex items-center justify-between">
                    <strong className="text-base">
                      {driver.vehicleNumber || driver.name}
                    </strong>
                    <StatusBadge
                      status={stale ? 'offline' : driver.status}
                    />
                  </div>

                  <p className="text-sm text-gray-600 m-0">
                    Driver: {driver.name}
                  </p>

                  <p className="text-sm text-gray-600 m-0">
                    Seats available: {driver.seatsAvailable ?? '—'}
                  </p>

                  {distance !== null && (
                    <p className="text-sm text-gray-600 m-0">
                      {formatDistance(distance)} away · ETA{' '}
                      {calculateETA(distance)}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 m-0">
                    Updated {formatRelativeTime(driver.lastUpdated)}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => onCallDriver?.(driver)}
                      className="flex-1 flex items-center justify-center gap-1 bg-primary-500 text-white text-sm py-1.5 rounded-lg"
                    >
                      <Phone size={14} />
                      Call
                    </button>

                    <button
                      onClick={() => onRequestPickup?.(driver)}
                      className="flex-1 flex items-center justify-center gap-1 bg-gray-700 text-white text-sm py-1.5 rounded-lg"
                    >
                      <Navigation size={14} />
                      Request
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LiveMap;