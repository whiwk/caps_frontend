import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  // Assuming a simple presence check for the token. You might need to extend this to verify token validity.
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};
export default ProtectedRoute;