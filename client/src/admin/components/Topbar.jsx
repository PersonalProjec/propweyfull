import { FiMenu } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

export default function Topbar({ onToggleSidebar }) {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    if (!path || path === 'admin') return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  return (
    <div className="sticky top-0 z-30 bg-white shadow-md px-4 py-3 flex items-center justify-between border-b border-gray-200">
      {/* Sidebar Toggle */}
      <button
        onClick={onToggleSidebar}
        className="text-gray-700 md:hidden focus:outline-none"
      >
        <FiMenu className="text-2xl" />
      </button>

      <h1 className="text-xl font-semibold text-gray-800">
        {getPageTitle()}
      </h1>

      {/* Placeholder Avatar */}
      <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
        A
      </div>
    </div>
  );
}
