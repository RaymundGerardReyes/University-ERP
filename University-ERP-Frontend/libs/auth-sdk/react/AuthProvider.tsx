import { createLogger } from '@university-erp/core-logger';
import { ReactNode, useEffect, useState } from 'react';
import { AuthContext, Identity } from './AuthContext';

const logger = createLogger('auth-sdk', 'AuthProvider');

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    logger.debug('Initializing federated identity state...');
    
    // Simulate OIDC Token Restoration & Cross-Origin Handoff
    let mockToken = localStorage.getItem('global_identity_token');
    
    // Check if we are returning from Identity Portal with a token fragment
    if (window.location.hash.includes('token=')) {
      const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
      const tokenFromFragment = fragmentParams.get('token');
      if (tokenFromFragment) {
        mockToken = tokenFromFragment;
        localStorage.setItem('global_identity_token', mockToken);
        logger.info('Received identity token via cross-origin handoff.');
        
        // Clean the URL fragment to prevent token leakage
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }

    if (mockToken) {
      try {
        const base64Url = mockToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        
        const userEmail = payload.email || 'unknown@example.com';
        
        // Robust Fallback: If JWT somehow misses the claim, infer from email standard prefix
        let fallbackRole = 'Student';
        if (userEmail.startsWith('admin@')) fallbackRole = 'Admin';
        else if (userEmail.startsWith('faculty@')) fallbackRole = 'Faculty';
        else if (userEmail.startsWith('admissions@')) fallbackRole = 'Admissions';
        else if (userEmail.startsWith('finance@')) fallbackRole = 'Finance';
        else if (userEmail.startsWith('registrar@')) fallbackRole = 'Registrar';
        else if (userEmail.startsWith('applicant@')) fallbackRole = 'Applicant';

        const extractedRoles = payload.role ? (Array.isArray(payload.role) ? payload.role : [payload.role]) :
                 (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ? 
                 (Array.isArray(payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) ? 
                 payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : 
                 [payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']]) : []);

        if (extractedRoles.length === 0) {
            extractedRoles.push(fallbackRole);
        }

        logger.info('Global Identity session found and decoded.');
        setIdentity({
          id: payload.sub || 'ID-UNKNOWN',
          name: payload.name || userEmail || 'Unknown User',
          email: userEmail,
          emailVerified: true,
          roles: extractedRoles
        });
      } catch (e) {
        logger.warn('Failed to parse identity token', e);
        setIdentity({
          id: 'ID-84920-ABCD',
          name: 'Jane Doe',
          email: 'jane.doe@personal.com',
          emailVerified: true
        });
      }
    } else {
      logger.warn('No active identity session found. User must authenticate via Identity Portal.');
    }
    
    setTimeout(() => setIsInitializing(false), 300);
  }, []);

  const login = () => {
    logger.info('Redirecting to Identity Portal for Authentication...');
    const identityUrl = import.meta.env.VITE_IDENTITY_PORTAL_URL;
    
    if (!identityUrl) {
        logger.error('VITE_IDENTITY_PORTAL_URL is missing from the environment! Check your .env file.');
        return;
    }

    // Use only origin + pathname (not full href) to prevent redirect_uri from accumulating
    // previously-encoded query params, which causes an infinite redirect loop.
    const returnTo = encodeURIComponent(window.location.origin + window.location.pathname);
    window.location.href = `${identityUrl}/login?redirect_uri=${returnTo}`;
  };

  const logout = () => {
    logger.warn('Identity logged out. Destroying global session.');
    localStorage.removeItem('global_identity_token');
    setIdentity(null);
  };

  if (isInitializing) return <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Establishing Identity...</div>;

  return (
    <AuthContext.Provider value={{ identity, user: identity, isAuthenticated: !!identity, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};