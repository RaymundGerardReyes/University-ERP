import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const AuditsPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Governance Audits" 
        subtitle="Review internal and external audit logs and reports." 
      />
      <Card>
        <p>Governance Audits is active and initialized.</p>
      </Card>
    </div>
  );
};

export default AuditsPage;
