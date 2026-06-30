// DriverTable - lists all drivers with enable/disable/edit/delete actions

import { useState } from 'react';
import { Power, PowerOff, Trash2, Edit2 } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import { Users } from 'lucide-react';

const DriverTable = ({ drivers, loading, onToggleActive, onDelete, onEdit }) => {
  const [confirmDeleteUid, setConfirmDeleteUid] = useState(null);

  if (loading) {
    return <div className="skeleton h-64 w-full" />;
  }

  if (drivers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No drivers yet"
        description="Add your first driver to get started."
      />
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-dark-500 text-left text-gray-500 dark:text-gray-400">
            <th className="p-4 font-medium">Name</th>
            <th className="p-4 font-medium">Vehicle</th>
            <th className="p-4 font-medium">Phone</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium">Active</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.uid} className="border-b border-gray-100 dark:border-dark-600 last:border-0">
              <td className="p-4 font-medium">{driver.name}</td>
              <td className="p-4">{driver.vehicleNumber || '—'}</td>
              <td className="p-4 text-gray-500 dark:text-gray-400">{driver.phone}</td>
              <td className="p-4"><StatusBadge status={driver.status} /></td>
              <td className="p-4">
                <span className={driver.isActive ? 'badge-green' : 'badge-gray'}>
                  {driver.isActive ? 'Active' : 'Disabled'}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(driver)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-500"
                    title="Edit driver"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onToggleActive(driver.uid, !driver.isActive)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-500"
                    title={driver.isActive ? 'Disable driver' : 'Enable driver'}
                  >
                    {driver.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                  </button>
                  {confirmDeleteUid === driver.uid ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { onDelete(driver.uid); setConfirmDeleteUid(null); }}
                        className="text-xs px-2 py-1 rounded-lg bg-red-500 text-white"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDeleteUid(null)}
                        className="text-xs px-2 py-1 rounded-lg bg-gray-200 dark:bg-dark-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteUid(driver.uid)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                      title="Delete driver"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverTable;
