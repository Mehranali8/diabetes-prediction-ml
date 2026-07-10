import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-slate-800 dark:text-slate-100 font-sans">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-8 text-center shadow-md space-y-4 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 flex items-center justify-center text-red-500 mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Something went wrong</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              An unexpected runtime error occurred within the GlucoPredict system. Please reload the client application.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-md shadow-blue-500/10 cursor-pointer active:scale-[0.98] transition-all duration-200"
            >
              Reload System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
