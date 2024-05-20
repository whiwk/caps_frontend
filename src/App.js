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
import ImplementationPage from './pages/ImplementationPage';
import LabonePage from './pages/LabonePage';
import LabtwoPage from './pages/LabtwoPage';
import LabthreePage from './pages/LabthreePage';
import BehindPage from './pages/BehindPage';

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
        <Route path='/5g-implementation-overview' element={<ProtectedRoute><Layout><ImplementationPage /></Layout></ProtectedRoute>} />
        <Route path='/lab-one-guidance-part-one' element={<ProtectedRoute><Layout><LabonePage /></Layout></ProtectedRoute>} />
        <Route path='/lab-two-guidance' element={<ProtectedRoute><Layout><LabtwoPage /></Layout></ProtectedRoute>} />
        <Route path='/lab-three-guidance' element={<ProtectedRoute><Layout><LabthreePage /></Layout></ProtectedRoute>} />
        <Route path='/behind-the-technology' element={<ProtectedRoute><Layout><BehindPage /></Layout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
