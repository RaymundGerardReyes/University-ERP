import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const GlobalSettingsPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Global Platform Settings" 
        subtitle="Configure system-wide configurations and platform feature flags." 
      />
      <Card>
        <p>Global Platform Settings is active and initialized.</p>
      </Card>
    </div>
  );
};

export default GlobalSettingsPage;
