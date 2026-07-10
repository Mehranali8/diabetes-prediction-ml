import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children, currentRoute = '/', onNavigate }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const handleNavClick = (route) => {
    onNavigate(route);
    setMobileSidebarOpen(false); // Close mobile drawer on selection
  };

  // Sidebar link definition
  const navigationItems = [
    {
      label: 'Dashboard',
      route: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      label: 'Predict Risk',
      route: '/predict',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: 'Prediction History',
      route: '/history',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-800 dark:text-slate-100 font-sans">
      {/* Header bar */}
      <Header onMenuToggle={toggleMobileSidebar} />

      {/* Main Content Layout Wrapper */}
      <div className="flex flex-1 pt-16 relative">
        
        {/* 1. Backdrop for mobile sidebar drawer */}
        {mobileSidebarOpen && (
          <div
            onClick={toggleMobileSidebar}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          />
        )}

        {/* 2. Responsive Left Sidebar */}
        <aside
          className={`fixed top-0 bottom-0 left-0 pt-20 w-64 bg-slate-900 text-slate-300 z-30 border-r border-slate-800/40 transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) transform md:translate-x-0 flex flex-col justify-between ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Navigation Links Group */}
          <div className="px-4 py-2 flex-1">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500/80 mb-4 px-3">
              Clinical Portal
            </p>
            <nav className="space-y-1.5">
              {navigationItems.map((item) => {
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => handleNavClick(item.route)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/15'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Details */}
          <div className="p-4 border-t border-slate-800/40 text-slate-500 text-[11px] leading-relaxed">
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-semibold text-slate-400">Clinical Server Online</span>
            </div>
            <p>API Version v1.0.4-LTS</p>
          </div>
        </aside>

        {/* 3. Main content body (adjusted margin-left on desktop screen sizes) */}
        <div className="flex-1 flex flex-col min-w-0 md:pl-64">
          <main className="flex-grow p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>

          {/* Sticky/Bottom footer wrapper */}
          <Footer />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;
