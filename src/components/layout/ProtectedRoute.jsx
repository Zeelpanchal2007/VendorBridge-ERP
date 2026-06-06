import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-base">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasPermission(allowedRoles)) {
    // Redirect to 403 page if they try to access an unauthorized route
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
