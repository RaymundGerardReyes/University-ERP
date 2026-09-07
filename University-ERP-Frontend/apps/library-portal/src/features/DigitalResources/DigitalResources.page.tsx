import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const DigitalResourcesPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Digital Resources" 
        subtitle="Access electronic journals, databases, and e-books." 
      />
      <Card>
        <p>Digital Resources is active and initialized.</p>
      </Card>
    </div>
  );
};

export default DigitalResourcesPage;
