import { useAuth } from '@university-erp/auth-sdk';
import { Card } from '@university-erp/ui-kit';
import React, { useEffect, useState } from 'react';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, identity, login } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsRedirecting(true);
      login();
      return;
    }

    // 2. Authorization Check: We have an identity. Are they allowed in Applicant Portal?
    // Usually, ANY verified identity can start an application. 
    // We mock authorization success here.
    setTimeout(() => {
      setIsAuthorized(true);
    }, 300);
  }, [isAuthenticated, identity, login]);

  if (isRedirecting) {
    return <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Redirecting to Central Identity Server...</div>;
  }

  if (!isAuthenticated || isAuthorized === null) {
    return <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Verifying Applicant Authorization...</div>;
  }

  if (isAuthorized === false) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-base)' }}>
        <Card style={{ maxWidth: '500px', textAlign: 'center', borderTop: '4px solid var(--danger-text)' }}>
          <h2 style={{ color: 'var(--danger-text)', margin: '0 0 var(--space-2) 0' }}>403 Forbidden</h2>
          <p style={{ color: 'var(--text-secondary)' }}>You do not have permission to access the Applicant Portal.</p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
