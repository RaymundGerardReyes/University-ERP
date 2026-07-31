import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@university-erp/auth-sdk';

export default function AuthGuard() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
