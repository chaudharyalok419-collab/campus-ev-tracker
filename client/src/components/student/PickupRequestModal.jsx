// PickupRequestModal - lets a student send a pickup request to a specific driver

import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const PickupRequestModal = ({ driver, userLocation, onClose, apiBaseUrl }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: name || 'Anonymous',
          studentPhone: phone || null,
          pickupLocation: userLocation
            ? { lat: userLocation.lat, lng: userLocation.lng }
            : null,
          targetDriverUid: driver.uid,
          notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Pickup request sent! The driver has been notified.');
        onClose();
      } else {
        toast.error(data.error || 'Failed to send request');
      }
    } catch (error) {
      toast.error('Could not reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="glass-card bg-white dark:bg-dark-700 w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h3 className="mb-1">Request pickup</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Requesting {driver.vehicleNumber || driver.name}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
          <input
            type="tel"
            placeholder="Your phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Notes for the driver (e.g. 'Waiting near library entrance')"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field resize-none"
            rows={3}
          />
          <Button type="submit" variant="primary" loading={submitting} className="w-full justify-center">
            Send request
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PickupRequestModal;
