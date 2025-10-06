import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: 'ADMIN' | 'USER';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
    
  // Role-based access control
  if (role) {
    // If route requires USER role and user is ADMIN, allow access
    if (role === 'USER' && user.role === 'ADMIN') {
      // Redirect admin to admin dashboard when accessing user dashboard
      return <Navigate to="/admin" replace />;
    }
    
    // If route requires ADMIN role and user is not ADMIN, deny access
    if (role === 'ADMIN' && user.role !== 'ADMIN') {
      return <Navigate to="/dashboard" replace />;
    }
    
    // If route requires USER role and user is not USER or ADMIN, deny access
    if (role === 'USER' && user.role !== 'USER' && user.role !== 'ADMIN') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;