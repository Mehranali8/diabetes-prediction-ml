import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import AppRoutes from './routes/AppRoutes';

function App() {
  // Simple path state to manage active route selection
  const [currentRoute, setCurrentRoute] = useState('/');

  return (
    <MainLayout currentRoute={currentRoute} onNavigate={setCurrentRoute}>
      <AppRoutes currentRoute={currentRoute} onNavigate={setCurrentRoute} />
    </MainLayout>
  );
}

export default App;
