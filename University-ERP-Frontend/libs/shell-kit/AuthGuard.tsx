import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@university-erp/auth-sdk';
import { portalRegistry } from './portalRegistry';

export const AuthGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the Identity Portal (the dedicated auth app), NOT to a local /login route.
    const identityUrl = portalRegistry.identity.url;

    const returnTo = encodeURIComponent(window.location.origin + location.pathname);
    window.location.href = `${identityUrl}/login?redirect_uri=${returnTo}`;
    return null; // Halt rendering while the browser navigates
  }

  // Cross-portal Role Enforcement
  const currentOrigin = window.location.origin;
  const hostname = window.location.hostname;
  
  let expectedRole = '';

  if (currentOrigin === portalRegistry.admin.url || hostname.startsWith('admin')) expectedRole = 'Admin';
  else if (currentOrigin === portalRegistry.faculty.url || hostname.startsWith('faculty')) expectedRole = 'Faculty';
  else if (currentOrigin === portalRegistry.admissions.url || hostname.startsWith('admissions')) expectedRole = 'Admissions';
  else if (currentOrigin === portalRegistry.finance.url || hostname.startsWith('finance')) expectedRole = 'Finance';
  else if (currentOrigin === portalRegistry.registrar.url || hostname.startsWith('registrar')) expectedRole = 'Registrar';
  else if (currentOrigin === portalRegistry.applicant.url || hostname.startsWith('applicant')) expectedRole = 'Applicant';

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
                        
                        const identityUrl = portalRegistry.identity.url;
                        
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
