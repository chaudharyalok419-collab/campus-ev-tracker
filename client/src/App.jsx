// App.jsx - root component, sets up routing for all three dashboards

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

import StudentPage from './pages/StudentPage';
import DriverLoginPage from './pages/DriverLoginPage';
import DriverPage from './pages/DriverPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

// Import Leaflet icon patches once, globally, so every map on every page works
import './components/map/leafletIcons';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <MainLayout>
            <Routes>
              {/* Students land here directly - no login required */}
              <Route path="/" element={<StudentPage />} />

              {/* Driver routes */}
              <Route path="/driver/login" element={<DriverLoginPage />} />
              <Route
                path="/driver"
                element={
                  <ProtectedRoute requiredRole="driver">
                    <DriverPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MainLayout>

          {/* Global toast notification container */}
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
