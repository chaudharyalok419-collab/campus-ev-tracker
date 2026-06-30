// RideControls - the main control panel on the driver dashboard.
// Lets the driver start/stop sharing GPS, toggle available/occupied, and set seat count.

import { Play, Square, Users, Minus, Plus } from 'lucide-react';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';

const RideControls = ({
  isSharing,
  status,
  seatsAvailable,
  gpsError,
  onStart,
  onStop,
  onToggleStatus,
  onChangeSeats,
}) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3>Ride controls</h3>
        <StatusBadge status={isSharing ? status : 'offline'} />
      </div>

      {gpsError && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm p-3 rounded-xl mb-4">
          GPS error: {gpsError}. Make sure location permission is enabled for this site.
        </div>
      )}

      {!isSharing ? (
        <Button variant="primary" onClick={onStart} className="w-full justify-center py-3">
          <Play size={18} /> Start ride
        </Button>
      ) : (
        <div className="space-y-4">
          <Button variant="danger" onClick={onStop} className="w-full justify-center py-3">
            <Square size={18} /> Stop ride
          </Button>

          <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-600 rounded-xl p-3">
            <span className="text-sm font-medium">Status</span>
            <div className="flex gap-2">
              <button
                onClick={() => onToggleStatus('available')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  status === 'available'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-dark-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => onToggleStatus('occupied')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  status === 'occupied'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white dark:bg-dark-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                Occupied
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-600 rounded-xl p-3">
            <span className="text-sm font-medium flex items-center gap-1.5">
              <Users size={16} /> Seats available
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onChangeSeats(Math.max(0, seatsAvailable - 1))}
                className="w-8 h-8 rounded-lg bg-white dark:bg-dark-700 flex items-center justify-center"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center font-semibold">{seatsAvailable}</span>
              <button
                onClick={() => onChangeSeats(Math.min(8, seatsAvailable + 1))}
                className="w-8 h-8 rounded-lg bg-white dark:bg-dark-700 flex items-center justify-center"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideControls;
