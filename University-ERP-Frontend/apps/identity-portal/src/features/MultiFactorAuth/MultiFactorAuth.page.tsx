import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const MultiFactorAuthPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Multi-Factor Authentication" 
        subtitle="Configure and verify multi-factor authentication security methods." 
      />
      <Card>
        <p>Multi-Factor Authentication is active and initialized.</p>
      </Card>
    </div>
  );
};

export default MultiFactorAuthPage;
