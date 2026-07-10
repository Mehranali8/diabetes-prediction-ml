import React from 'react';

const Header = ({ onMenuToggle }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 dark:bg-slate-900/90 dark:border-slate-800 z-40 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      {/* Brand area */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl md:hidden focus:outline-none transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Medical Cross Pulse Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-750 flex items-center justify-center text-white shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-200">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-800 dark:text-slate-100 hidden sm:inline-block">
            Gluco<span className="text-blue-600 font-extrabold">Predict</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/40 hidden xs:inline-block">
            Clinical SaaS
          </span>
        </div>
      </div>

      {/* Profile & Status widget */}
      <div className="flex items-center gap-4">
        {/* Clinician Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="relative cursor-pointer group">
            {/* Avatar placeholder SVG */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-slate-100 dark:ring-slate-800 group-hover:scale-105 transition-all duration-200">
              SJ
            </div>
            {/* Active Status indicator */}
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Dr. Mehran Ali</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider dark:text-slate-500">Endocrinologist</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
