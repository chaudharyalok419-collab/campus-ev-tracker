// AdminPage - the main admin dashboard: stats overview, driver management.

import { useState, useEffect, useCallback } from 'react';
import { LogOut, Shield, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatsCards from '../components/admin/StatsCards';
import DriverTable from '../components/admin/DriverTable';
import AddDriverModal from '../components/admin/AddDriverModal';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const AdminPage = () => {
  const { currentUser, userProfile, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const getToken = useCallback(async () => currentUser.getIdToken(), [currentUser]);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch {
      toast.error('Could not load statistics');
    } finally {
      setLoadingStats(false);
    }
  }, [getToken]);

  const fetchDrivers = useCallback(async () => {
    setLoadingDrivers(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/drivers`);
      const data = await res.json();
      if (data.success) setDrivers(data.data);
    } catch {
      toast.error('Could not load drivers');
    } finally {
      setLoadingDrivers(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchDrivers();
  }, [fetchStats, fetchDrivers]);

  const handleToggleActive = async (uid, isActive) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/drivers/${uid}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchDrivers();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error('Could not update driver');
    }
  };

  const handleDelete = async (uid) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/drivers/${uid}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Driver deleted');
        fetchDrivers();
        fetchStats();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error('Could not delete driver');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="text-primary-500" />
          <div>
            <h2 className="leading-tight">Admin dashboard</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{userProfile?.name}</p>
          </div>
        </div>
        <button onClick={logout} className="nav-link">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="mb-6">
        <StatsCards stats={stats} loading={loadingStats} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3>Drivers</h3>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add driver
        </Button>
      </div>

      <DriverTable
        drivers={drivers}
        loading={loadingDrivers}
        onToggleActive={handleToggleActive}
        onDelete={handleDelete}
        onEdit={() => toast('Edit form coming soon — use Firestore console for now')}
      />

      {showAddModal && (
        <AddDriverModalWrapper
          onClose={() => setShowAddModal(false)}
          onCreated={() => { fetchDrivers(); fetchStats(); }}
          getToken={getToken}
        />
      )}
    </div>
  );
};

// Small wrapper so AddDriverModal (which expects a plain idToken string)
// can resolve the async token before mounting
const AddDriverModalWrapper = ({ onClose, onCreated, getToken }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    getToken().then(setToken);
  }, [getToken]);

  if (!token) return null;

  return (
    <AddDriverModal
      onClose={onClose}
      onCreated={onCreated}
      apiBaseUrl={API_BASE_URL}
      idToken={token}
    />
  );
};

export default AdminPage;
