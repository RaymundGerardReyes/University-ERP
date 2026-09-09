import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const CommunicationPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader
        title="Enterprise Communication Hub"
        subtitle="Manage direct messaging, broadcasts, and collaboration channels."
      />
      <Card>
        <p>Enterprise Communication Hub is active and operating.</p>
      </Card>
    </div>
  );
};

export default CommunicationPage;
