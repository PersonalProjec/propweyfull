import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function AdminRoute({ children }) {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();
    const isAdmin = decoded.role === 'admin';

    if (isExpired || !isAdmin) {
      localStorage.removeItem('adminToken');
      return <Navigate to="/admin/login" replace />;
    }

    // ✅ If used as element wrapper
    if (children) return children;

    // ✅ If used as route layout
    return <Outlet />;
  } catch (err) {
    console.error('Invalid token', err);
    localStorage.removeItem('adminToken');
    return <Navigate to="/admin/login" replace />;
  }
}
