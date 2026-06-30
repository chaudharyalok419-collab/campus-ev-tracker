// PickupRequestList - shows incoming pickup requests to the driver in real time

import { Check, X, MapPin } from 'lucide-react';
import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import { formatRelativeTime } from '../../utils/formatTime';
import { Bell } from 'lucide-react';

const PickupRequestList = ({ requests, onRespond }) => {
  if (requests.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No pending requests"
        description="New pickup requests from students will appear here instantly."
      />
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <Card key={req.id}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold">{req.studentName}</h4>
              {req.studentPhone && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{req.studentPhone}</p>
              )}
            </div>
            <span className="text-xs text-gray-400">{formatRelativeTime(req.createdAt)}</span>
          </div>

          {req.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">"{req.notes}"</p>
          )}

          {req.pickupLocation && (
            <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
              <MapPin size={12} />
              {req.pickupLocation.lat.toFixed(4)}, {req.pickupLocation.lng.toFixed(4)}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onRespond(req.id, 'accepted')}
              className="flex-1 flex items-center justify-center gap-1.5 btn-primary py-1.5 text-sm"
            >
              <Check size={14} /> Accept
            </button>
            <button
              onClick={() => onRespond(req.id, 'declined')}
              className="flex-1 flex items-center justify-center gap-1.5 btn-danger py-1.5 text-sm"
            >
              <X size={14} /> Decline
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PickupRequestList;
