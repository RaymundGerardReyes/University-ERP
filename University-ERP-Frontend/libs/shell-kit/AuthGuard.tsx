import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@university-erp/auth-sdk';

export const AuthGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the Identity Portal (the dedicated auth app), NOT to a local /login route.
    // Using window.location.pathname only (not full href) as the return destination to prevent
    // the redirect_uri from accumulating previously-encoded redirect_uri params (infinite loop).
    const identityUrl = (import.meta as any).env?.VITE_IDENTITY_PORTAL_URL || 'http://localhost:8081';
    const returnTo = encodeURIComponent(window.location.origin + location.pathname);
    window.location.href = `${identityUrl}/login?redirect_uri=${returnTo}`;
    return null; // Halt rendering while the browser navigates
  }

  return children ? <>{children}</> : <Outlet />;
};
