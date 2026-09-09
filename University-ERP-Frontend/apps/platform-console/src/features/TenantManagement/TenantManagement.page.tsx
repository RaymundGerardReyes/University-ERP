import React from 'react';
import { PageHeader, Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useCampusTenants } from './TenantManagement.hooks';

export const TenantManagementPage: React.FC = () => {
  const { data: tenants, isLoading } = useCampusTenants();

  return (
    <div className="fade-in">
      <PageHeader 
        title="Multi-Campus Tenant Management" 
        subtitle="Govern distributed multi-campus tenants, regional compute allocations, and storage quotas." 
        action={<Button variant="primary">Provision Campus Tenant</Button>}
      />

      <Card className="fade-in-delay-1" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Active Multi-Campus Partitions</h2>
        {isLoading ? (
          <div className="skeleton" style={{ height: '30vh' }} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Campus Name</th>
                <th>Tenant Code</th>
                <th>Geographic Region</th>
                <th>Active Students and Staff</th>
                <th>Storage Quota</th>
                <th>Tenant Status</th>
              </tr>
            </thead>
            <tbody>
              {(tenants || []).map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td style={{ fontFamily: 'monospace' }}>{t.code}</td>
                  <td><Badge colorScheme="default">{t.region}</Badge></td>
                  <td>{t.activeUsers.toLocaleString()}</td>
                  <td>{t.allocatedStorageGb} GB</td>
                  <td><Badge colorScheme="success">{t.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default TenantManagementPage;
