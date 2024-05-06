import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import IntroductionPage from './pages/IntroductionPage';
import DashboardPage from './pages/DashboardPage';
import MonitoringPage from './pages/MonitoringPage';
import UserManagementPage from './pages/UserManagementPage';
import CheckToken from './routes/CheckToken';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CheckToken />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/introduction" element={<ProtectedRoute><Layout><IntroductionPage /></Layout></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
        <Route path="/monitoring" element={<ProtectedRoute><Layout><MonitoringPage /></Layout></ProtectedRoute>} />
        <Route path="/user-management" element={<ProtectedRoute><Layout><UserManagementPage /></Layout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
