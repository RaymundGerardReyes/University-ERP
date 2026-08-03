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

    // 2. Authorization Check: We have an identity. Are they a Student?
    // MOCK: Simulate fetching the Student Profile from /api/student-information/me
    setTimeout(() => {
      // In a real scenario, an Applicant logging in would not have a Student profile yet.
      // We authorize Jane Doe's mock identity for local development
      const hasStudentProfile = identity?.id === 'ID-84920-ABCD'; 
      setIsAuthorized(hasStudentProfile);
    }, 500);
  }, [isAuthenticated, identity, login]);

  if (isRedirecting) {
    return <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Redirecting to Central Identity Server...</div>;
  }

  if (!isAuthenticated || isAuthorized === null) {
    return <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Verifying Student Authorization...</div>;
  }

  if (isAuthorized === false) {
    // 3. 403 Forbidden: Identity verified, but no authorization for this portal.
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-base)' }}>
        <Card style={{ maxWidth: '500px', textAlign: 'center', borderTop: '4px solid var(--danger-text)' }}>
          <h2 style={{ color: 'var(--danger-text)', margin: '0 0 var(--space-2) 0' }}>403 Forbidden</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Your identity (<strong>{identity?.email}</strong>) has been verified, but you do not have an active <strong>Student Profile</strong>. 
            If you are an applicant, please use the Applicant Portal.
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
