import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RefreshProvider } from './contexts/RefreshContext';
import { DataProvider } from './contexts/DataContext'; // Import the DataProvider
import LoginPage from './pages/LoginPage';
import OrcaIntroductionPage from './pages/OrcaIntroductionPage';
import DashboardPage from './pages/DashboardPage';
import MonitoringPage from './pages/MonitoringPage';
import UserManagementPage from './pages/UserManagementPage';
import CheckToken from './routes/CheckToken';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import Overview5gPage from './pages/Overview5gPage';
import LabGuidancePage from './pages/LabGuidancePage';
import BehindTheTechnologyPage from './pages/BehindTheTechnologyPage';
import MonitoringAndLoggingPage from './pages/MonitoringAndLoggingPage';

function App() {
  return (
    <RefreshProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<CheckToken />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/introduction/orca" element={<ProtectedRoute><Layout><OrcaIntroductionPage /></Layout></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
            <Route path="/monitoring" element={<ProtectedRoute><Layout><MonitoringPage /></Layout></ProtectedRoute>} />
            <Route path="/admin/user-management" element={<ProtectedRoute><Layout><UserManagementPage /></Layout></ProtectedRoute>} />
            <Route path='/introduction/5g-overview' element={<ProtectedRoute><Layout><Overview5gPage /></Layout></ProtectedRoute>} />
            <Route path='/introduction/lab-guidance' element={<ProtectedRoute><Layout><LabGuidancePage /></Layout></ProtectedRoute>} />
            <Route path='/introduction/behind-the-technology' element={<ProtectedRoute><Layout><BehindTheTechnologyPage /></Layout></ProtectedRoute>} />
            <Route path='/introduction/monitoring-and-logging' element={<ProtectedRoute><Layout><MonitoringAndLoggingPage /></Layout></ProtectedRoute>} />
          </Routes>
        </Router>
      </DataProvider>
    </RefreshProvider>
  );
}

export default App;
