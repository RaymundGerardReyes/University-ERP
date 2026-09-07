import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const RiskManagementPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Risk Assessment & Management" 
        subtitle="Identify and mitigate institutional operational risks." 
      />
      <Card>
        <p>Risk Assessment & Management is active and initialized.</p>
      </Card>
    </div>
  );
};

export default RiskManagementPage;
