import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import PathConstants from '../routes/pathConstants.js';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-gray-500" size={24} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={PathConstants.LOGIN} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={PathConstants.ACCOUNT} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;