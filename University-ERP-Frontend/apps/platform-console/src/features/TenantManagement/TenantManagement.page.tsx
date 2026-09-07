import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const TenantManagementPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Tenant & Campus Management" 
        subtitle="Manage institutional tenants and campus partitions." 
      />
      <Card>
        <p>Tenant & Campus Management is active and initialized.</p>
      </Card>
    </div>
  );
};

export default TenantManagementPage;
