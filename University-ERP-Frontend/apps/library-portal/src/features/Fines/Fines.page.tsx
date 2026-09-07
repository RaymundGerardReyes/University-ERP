import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const FinesPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Library Fines & Overdues" 
        subtitle="Manage overdue item fees and payment receipts." 
      />
      <Card>
        <p>Library Fines & Overdues is active and initialized.</p>
      </Card>
    </div>
  );
};

export default FinesPage;
