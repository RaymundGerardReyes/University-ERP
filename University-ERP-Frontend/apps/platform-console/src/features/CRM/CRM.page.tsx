import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const CRMPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader
        title="Constituent Relationship Management"
        subtitle="Manage donor relations, prospective students, and partner networks."
      />
      <Card>
        <p>Constituent Relationship Management is active and operating.</p>
      </Card>
    </div>
  );
};

export default CRMPage;
