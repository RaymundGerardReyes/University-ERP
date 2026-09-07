import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const CompliancePage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Regulatory Compliance" 
        subtitle="Track and ensure regulatory policy compliance." 
      />
      <Card>
        <p>Regulatory Compliance is active and initialized.</p>
      </Card>
    </div>
  );
};

export default CompliancePage;
