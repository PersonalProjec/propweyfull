import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTopButton from './components/BacktoTop';
import Home from './features/Home';
import PropertyDetails from './pages/PropertyDetails';
import AdminLayout from './admin/AdminLayout';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import UploadProperty from './admin/pages/UploadProperty';
import ManageProperties from './admin/pages/ManageProperties';
import Profile from './admin/pages/Profile';
import ChangePassword from './admin/pages/ChangePassword';
import AdminRoute from './admin/AdminRoute';
import NotFound from './admin/pages/NotFound';
import Bookings from './admin/pages/Bookings';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Auto-scroll to section
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      {!isAdmin && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/property/:id" element={<PropertyDetails />} />

        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<UploadProperty />} />
            <Route path="manage" element={<ManageProperties />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="password" element={<ChangePassword />} />
          </Route>
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdmin && (
        <>
          <Footer />
          <BackToTopButton />
        </>
      )}
    </>
  );
}
