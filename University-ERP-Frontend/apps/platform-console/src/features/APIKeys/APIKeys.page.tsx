import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const APIKeysPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="API Key Management" 
        subtitle="Generate and revoke API keys for platform integration." 
      />
      <Card>
        <p>API Key Management is active and initialized.</p>
      </Card>
    </div>
  );
};

export default APIKeysPage;
