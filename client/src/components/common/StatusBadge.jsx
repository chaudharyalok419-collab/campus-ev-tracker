// Shows a colored badge for EV/driver status

import { Circle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const config = {
    available: { label: 'Available', className: 'badge-green',  dotColor: 'text-primary-500' },
    occupied:  { label: 'Occupied',  className: 'badge-yellow', dotColor: 'text-yellow-500' },
    offline:   { label: 'Offline',   className: 'badge-gray',   dotColor: 'text-gray-400' },
    on_ride:   { label: 'On a ride', className: 'badge-yellow', dotColor: 'text-yellow-500' },
  };

  const { label, className, dotColor } = config[status] || config.offline;

  return (
    <span className={className}>
      <Circle className={`w-2 h-2 fill-current ${dotColor}`} />
      {label}
    </span>
  );
};

export default StatusBadge;
