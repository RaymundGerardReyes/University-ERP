import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const PoliciesPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Institutional Policies" 
        subtitle="Review and publish university-wide governance policies." 
      />
      <Card>
        <p>Institutional Policies is active and initialized.</p>
      </Card>
    </div>
  );
};

export default PoliciesPage;
