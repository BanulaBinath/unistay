import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [], allowedVendorTypes = [] }) => {
  const { isAuthenticated, getUserRole, getVendorType, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = getUserRole();
  const vendorType = getVendorType();

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'student_sliit' || userRole === 'student_external') {
      return <Navigate to="/student/dashboard" replace />;
    } else if (userRole === 'vendor') {
      return <Navigate to={`/vendor/${vendorType}/dashboard`} replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Check vendor type access
  if (allowedVendorTypes.length > 0 && !allowedVendorTypes.includes(vendorType)) {
    return <Navigate to={`/vendor/${vendorType}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
