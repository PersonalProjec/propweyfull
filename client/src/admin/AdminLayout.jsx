import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Topbar onToggleSidebar={() => setShowSidebar(!showSidebar)} />
        <main className="flex-1 p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
