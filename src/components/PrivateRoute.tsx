import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PathConstants from '../routes/pathConstants';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('PrivateRoute - user:', user);
  console.log('PrivateRoute - loading:', loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to={PathConstants.LOGIN} />;
};

export default PrivateRoute;