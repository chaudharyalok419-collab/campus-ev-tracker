// EVCard - shows a single EV's summary in the student dashboard's list view
// (the sidebar list that accompanies the map)

import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { Phone, Navigation, Users } from 'lucide-react';
import { formatRelativeTime, isLocationStale } from '../../utils/formatTime';
import { formatDistance, calculateETA } from '../../utils/distance';

const EVCard = ({ driver, distance, onCall, onRequest, onClick }) => {
  const stale = isLocationStale(driver.lastUpdated);

  return (
    <Card onClick={onClick} className="hover:scale-[1.01] transition-transform">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold">{driver.vehicleNumber || 'EV'}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{driver.name}</p>
        </div>
        <StatusBadge status={stale ? 'offline' : driver.status} />
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
        <span className="flex items-center gap-1">
          <Users size={14} /> {driver.seatsAvailable ?? '—'} seats
        </span>
        {distance != null && (
          <span>{formatDistance(distance)} · ETA {calculateETA(distance)}</span>
        )}
      </div>

      <p className="text-xs text-gray-400 mb-3">Updated {formatRelativeTime(driver.lastUpdated)}</p>

      <div className="flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onCall?.(driver); }}
          className="flex-1 flex items-center justify-center gap-1.5 btn-primary py-1.5 text-sm"
        >
          <Phone size={14} /> Call
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onRequest?.(driver); }}
          className="flex-1 flex items-center justify-center gap-1.5 btn-secondary py-1.5 text-sm"
        >
          <Navigation size={14} /> Request
        </button>
      </div>
    </Card>
  );
};

export default EVCard;
