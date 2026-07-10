import React from 'react';
import Dashboard from '../pages/Dashboard';
import Predict from '../pages/Predict';
import History from '../pages/History';
import NotFound from '../pages/NotFound';

// A lightweight route handler rendering views dynamically without package dependencies
const AppRoutes = ({ currentRoute = '/', onNavigate }) => {
  switch (currentRoute) {
    case '/':
    case '/dashboard':
      return <Dashboard onNavigate={onNavigate} />;
    case '/predict':
      return <Predict />;
    case '/history':
      return <History />;
    default:
      return <NotFound />;
  }
};

export default AppRoutes;
