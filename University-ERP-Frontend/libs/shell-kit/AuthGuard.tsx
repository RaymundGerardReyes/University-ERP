import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@university-erp/auth-sdk';

export const AuthGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the Identity Portal (the dedicated auth app), NOT to a local /login route.
    let identityUrl = (import.meta as any).env?.VITE_IDENTITY_PORTAL_URL || 'http://localhost:3001';
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const port = window.location.port;
        if (port === '8086' || port === '8080') identityUrl = 'http://localhost:8081';
        else if (parseInt(port) >= 5173 && parseInt(port) <= 5183) identityUrl = 'http://localhost:3001';
    }

    const returnTo = encodeURIComponent(window.location.origin + location.pathname);
    window.location.href = `${identityUrl}/login?redirect_uri=${returnTo}`;
    return null; // Halt rendering while the browser navigates
  }

  // Cross-portal Role Enforcement
  const port = window.location.port;
  const hostname = window.location.hostname;
  
  let expectedRole = '';

  if (port === '5178' || hostname.startsWith('admin')) expectedRole = 'Admin';
  else if (port === '5175' || hostname.startsWith('faculty')) expectedRole = 'Faculty';
  else if (port === '5183' || hostname.startsWith('admissions')) expectedRole = 'Admissions';
  else if (port === '5176' || hostname.startsWith('finance')) expectedRole = 'Finance';
  else if (port === '5181' || hostname.startsWith('registrar')) expectedRole = 'Registrar';
  else if (port === '5174' || hostname.startsWith('applicant')) expectedRole = 'Applicant';

  if (expectedRole && user?.roles) {
      // Allow access if they have the exact role, or if they are System Admin (except for Applicant portal)
      const hasDirectAccess = user.roles.includes(expectedRole);
      const isAdminOverride = user.roles.includes('Admin') && expectedRole !== 'Applicant';

      if (!hasDirectAccess && !isAdminOverride) {
          return (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
                 <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>403 Forbidden</h1>
                 <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '2rem' }}>
                    Your current role ({user.roles.join(', ')}) does not have permission to access the {expectedRole} Portal.
                 </p>
                 <button 
                     onClick={() => {
                        localStorage.removeItem('global_identity_token');
                        
                        let identityUrl = (import.meta as any).env?.VITE_IDENTITY_PORTAL_URL || 'http://localhost:3001';
                        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                            const port = window.location.port;
                            if (port === '8086' || port === '8080') identityUrl = 'http://localhost:8081';
                            else if (parseInt(port) >= 5173 && parseInt(port) <= 5183) identityUrl = 'http://localhost:3001';
                        }
                        
                        window.location.href = `${identityUrl}/login`;
                     }}
                     style={{ padding: '0.75rem 1.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}
                 >
                     Sign in with a different account
                 </button>
             </div>
          );
      }
  }

  return children ? <>{children}</> : <Outlet />;
};
