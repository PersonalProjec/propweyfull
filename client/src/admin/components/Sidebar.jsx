import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiUpload,
  FiEdit,
  FiUser,
  FiLock,
  FiLogOut,
  FiX,
  FiCalendar,
} from 'react-icons/fi';
import { useState } from 'react';

const links = [
  { name: 'Dashboard', path: '/admin', icon: <FiHome /> },
  { name: 'Upload Property', path: '/admin/upload', icon: <FiUpload /> },
  { name: 'Manage Properties', path: '/admin/manage', icon: <FiEdit /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <FiCalendar /> }, 
  { name: 'Profile', path: '/admin/profile', icon: <FiUser /> },
  { name: 'Change Password', path: '/admin/password', icon: <FiLock /> },
];

export default function Sidebar({ showSidebar, setShowSidebar }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <aside
        className={`
    top-0 left-0 z-50 h-screen bg-gray-900 text-white shadow-lg
    transition-all duration-300 ease-in-out
    ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:relative
    ${collapsed ? 'md:w-16' : 'md:w-64'} w-64 fixed md:fixed
  `}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <span className="text-lg font-bold">
            {collapsed ? 'P' : 'Property Wey'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-white hidden md:block"
            >
              ☰
            </button>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-gray-400 hover:text-white md:hidden"
            >
              <FiX />
            </button>
          </div>
        </div>

        <nav className="mt-6 space-y-2">
          {links.map((link) => (
            <NavLink
              to={link.path}
              key={link.name}
              end={link.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center ${
                  collapsed ? 'justify-center px-2' : 'px-4'
                } py-2 rounded hover:bg-gray-800 transition ${
                  isActive ? 'bg-gray-800' : ''
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {!collapsed && <span className="ml-3">{link.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 w-full px-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 text-red-400 hover:text-white hover:bg-red-500 px-4 py-2 rounded"
          >
            <FiLogOut />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
