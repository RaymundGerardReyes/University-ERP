import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const PasswordRecoveryPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Password Recovery" 
        subtitle="Recover and verify your account credentials securely." 
      />
      <Card>
        <p>Password Recovery is active and initialized.</p>
      </Card>
    </div>
  );
};

export default PasswordRecoveryPage;
