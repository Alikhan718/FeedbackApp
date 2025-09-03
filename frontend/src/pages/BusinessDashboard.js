import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { API_BASE, getImageUrl } from '../config/api';

const menuItems = [
  { 
    name: 'Dashboard', 
    path: '/business',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    name: 'Analytics', 
    path: '/business/analytics',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  { 
    name: 'Reviews', 
    path: '/business/reviews',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    )
  },
  { 
    name: 'Bonuses', 
    path: '/business/bonuses',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    )
  },
  { 
    name: 'Settings', 
    path: '/business/settings',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
];

const BusinessDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Clear auth state if implemented
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Helmet>
        <title>Business Dashboard | Feedback App</title>
      </Helmet>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-w-[16rem] bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {/* Logo/Brand */}
          <div className="flex items-center h-20 flex-shrink-0 px-4 border-b border-gray-200">
            {/* Logo Placeholder / Image (fetched client-side via localStorage mapping) */}
            <BusinessLogo className="w-14 h-14 mr-3" />
            <span className="text-xl font-semibold text-gray-800">Business Panel</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-lg font-semibold text-gray-800">Business Panel</span>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={() => {
              // TODO: Implement mobile menu
              alert('Mobile menu coming soon!');
            }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
        <div className="py-6 px-4 sm:px-6 md:px-8">
          {/* Page header - can be customized per route */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                {menuItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
          </div>

          {/* Page content */}
          <div className="bg-white rounded-lg shadow">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard; 

// Small inline component to render the business logo in the sidebar

function BusinessLogo({ className = '' }) {
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const businessEmail = localStorage.getItem('businessEmail');
        if (!businessEmail) throw new Error('No business email');
        const userRes = await fetch(`${API_BASE}/users/email/${encodeURIComponent(businessEmail)}`);
        if (!userRes.ok) throw new Error('Owner not found');
        const user = await userRes.json();
        const bizRes = await fetch(`${API_BASE}/business`);
        if (!bizRes.ok) throw new Error('Businesses fetch failed');
        const businesses = await bizRes.json();
        const myBiz = businesses.find((b) => b.owner_id === user.id);
        if (!myBiz) throw new Error('Business not found');
        setLogoUrl(getImageUrl(myBiz.logo_url));
      } catch (_) {
        setLogoUrl(null);
      }
    };
    fetchLogo();
  }, []);

  return (
    <div className={`rounded-full bg-gray-200 flex items-center justify-center ${className}`} title="Business Logo">
      {logoUrl ? (
        <img src={logoUrl} alt="Business logo" className="w-full h-full rounded-full object-contain object-center" />
      ) : (
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11a4 4 0 108 0 4 4 0 00-8 0z" />
        </svg>
      )}
    </div>
  );
}