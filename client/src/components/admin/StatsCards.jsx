// StatsCards - the row of summary metrics at the top of the admin dashboard

import { Users, Car, History, Bell } from 'lucide-react';

const StatsCards = ({ stats, loading }) => {
  const items = [
    { label: 'Total drivers',    value: stats?.totalDrivers,    icon: Users,  color: 'bg-primary-100 text-primary-600' },
    { label: 'Active now',       value: stats?.activeDrivers,   icon: Car,    color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Total rides',      value: stats?.totalRides,      icon: History,color: 'bg-blue-100 text-blue-600' },
    { label: 'Pending requests', value: stats?.pendingRequests, icon: Bell,   color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="stat-card">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold">{loading ? '—' : value ?? 0}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
