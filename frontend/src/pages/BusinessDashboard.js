import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', path: '/business' },
  { name: 'Analytics', path: '/business/analytics' },
  { name: 'Reviews', path: '/business/reviews' },
  { name: 'Bonuses', path: '/business/bonuses' },
  { name: 'Settings', path: '/business/settings' },
];

const BusinessDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Clear auth state if implemented
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <div className="mb-8 text-2xl font-bold">Business Panel</div>
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 py-2 rounded hover:bg-gray-700 transition-colors ${location.pathname === item.path ? 'bg-gray-700' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-8 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default BusinessDashboard; 