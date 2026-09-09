import React from 'react';
import { PageHeader, Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { usePolicies } from './Policies.hooks';

export const PoliciesPage: React.FC = () => {
  const { data: policies, isLoading } = usePolicies();

  return (
    <div className="fade-in">
      <PageHeader 
        title="Institutional Policies" 
        subtitle="Centralized repository of university charters, academic regulations, and codes of conduct." 
        action={<Button variant="primary">Draft New Policy</Button>}
      />

      <Card className="fade-in-delay-1" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Policy Codification Repository</h2>
        {isLoading ? (
          <div className="skeleton" style={{ height: '30vh' }} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Policy Code</th>
                <th>Title</th>
                <th>Category</th>
                <th>Version</th>
                <th>Effective Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(policies || []).map((p) => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.policyCode}</td>
                  <td style={{ fontWeight: 600 }}>{p.title}</td>
                  <td><Badge colorScheme="default">{p.category}</Badge></td>
                  <td>{p.version}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.effectiveDate}</td>
                  <td><Badge colorScheme={p.status === 'Active' ? 'success' : 'warning'}>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default PoliciesPage;
