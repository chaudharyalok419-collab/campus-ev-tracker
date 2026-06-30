// AdminLoginPage - login form for admins (reuses the same Firebase auth as drivers,
// the AuthContext figures out the role from Firestore after login)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const profile = await login(email, password);
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/driver');
      }
    } catch {
      // toast already shown
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-dark-700 dark:bg-primary-500 rounded-2xl flex items-center justify-center mb-3">
            <Shield className="text-white" size={28} />
          </div>
          <h2>Admin login</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage drivers, vehicles, and rides</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Button type="submit" variant="primary" loading={loading} className="w-full justify-center mt-2">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
