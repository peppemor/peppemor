import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import PathConstants from '../routes/pathConstants.js';
import { Loader2 } from 'lucide-react';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-gray-500" size={24} />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to={PathConstants.LOGIN} />;
};

export default PrivateRoute;