import React from 'react';
import ReactDOM from 'react-dom/client';
import AppContent from './AppContent.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; 
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </React.StrictMode>
);
