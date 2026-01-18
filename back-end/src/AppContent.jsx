import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import OrgSettings from './pages/OrgSettings';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/org-settings" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/org-settings" />} />
          <Route path="/org-settings" element={user ? <OrgSettings /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/org-settings" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppContent;
