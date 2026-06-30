// AddDriverModal - form for admin to create a new driver account.
// Calls the backend's protected /api/v1/auth/create-driver endpoint.

import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { isValidEmail, isValidPhone } from '../../utils/validators';

const AddDriverModal = ({ onClose, onCreated, apiBaseUrl, idToken }) => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', vehicleNumber: '', licenseNumber: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(form.email)) {
      toast.error('Please enter a valid email');
      return;
    }
    if (!isValidPhone(form.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/auth/create-driver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Driver created successfully');
        onCreated();
        onClose();
      } else {
        toast.error(data.error || 'Failed to create driver');
      }
    } catch {
      toast.error('Could not reach the server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="glass-card bg-white dark:bg-dark-700 w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h3 className="mb-4">Add new driver</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="input-field" placeholder="Full name" required value={form.name} onChange={update('name')} />
          <input className="input-field" type="email" placeholder="Email" required value={form.email} onChange={update('email')} />
          <input className="input-field" type="password" placeholder="Temporary password" required value={form.password} onChange={update('password')} />
          <input className="input-field" type="tel" placeholder="Phone (10 digits)" required value={form.phone} onChange={update('phone')} />
          <input className="input-field" placeholder="Vehicle number" value={form.vehicleNumber} onChange={update('vehicleNumber')} />
          <input className="input-field" placeholder="License number (optional)" value={form.licenseNumber} onChange={update('licenseNumber')} />
          <Button type="submit" variant="primary" loading={submitting} className="w-full justify-center mt-2">
            Create driver
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddDriverModal;
