// Navbar - top bar shown on every page, includes dark mode toggle and nav links

import { Link, useLocation } from 'react-router-dom';
import { Zap, Sun, Moon, Car, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-dark-800/70 border-b border-gray-200 dark:border-dark-600">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Zap className="text-primary-500" /> Campus EV
        </Link>

        <div className="flex items-center gap-1">
          <Link to="/driver/login" className={`nav-link ${location.pathname.startsWith('/driver') ? 'active' : ''}`}>
            <Car size={16} /> <span className="hidden sm:inline">Driver</span>
          </Link>
          <Link to="/admin/login" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
            <Shield size={16} /> <span className="hidden sm:inline">Admin</span>
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 ml-1"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
