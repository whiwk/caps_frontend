import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RefreshProvider } from './contexts/RefreshContext';
import { DataProvider } from './contexts/DataContext'; // Import the DataProvider
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
import BehindPage from './pages/BehindPage';
import LoggingPage from './pages/LoggingPage';
import TableMisc from './components/Table';
import GraphWithContext from './components/Graph';

function App() {
  return (
    <RefreshProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<CheckToken />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/introduction" element={<ProtectedRoute><Layout><IntroductionPage /></Layout></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
            <Route path="/monitoring" element={<ProtectedRoute><Layout><MonitoringPage /></Layout></ProtectedRoute>} />
            <Route path="/user-management" element={<ProtectedRoute><Layout><UserManagementPage /></Layout></ProtectedRoute>} />
            <Route path='/5g-implementation-overview' element={<ProtectedRoute><Layout><ImplementationPage /></Layout></ProtectedRoute>} />
            <Route path='/lab-one-guidance' element={<ProtectedRoute><Layout><LabonePage /></Layout></ProtectedRoute>} />
            <Route path='/behind-the-technology' element={<ProtectedRoute><Layout><BehindPage /></Layout></ProtectedRoute>} />
            <Route path='/monitoring-and-logging' element={<ProtectedRoute><Layout><LoggingPage /></Layout></ProtectedRoute>} />
            <Route path="/table-misc" element={<ProtectedRoute><Layout><TableMisc /></Layout></ProtectedRoute>} />
            <Route path="/graph" element={<ProtectedRoute><Layout><GraphWithContext /></Layout></ProtectedRoute>} />
          </Routes>
        </Router>
      </DataProvider>
    </RefreshProvider>
  );
}

export default App;
