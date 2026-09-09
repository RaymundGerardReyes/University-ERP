import React from 'react';
import { PageHeader, Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useApiKeys } from './APIKeys.hooks';

export const APIKeysPage: React.FC = () => {
  const { data: keys, isLoading } = useApiKeys();

  return (
    <div className="fade-in">
      <PageHeader 
        title="API Keys and External Integrations" 
        subtitle="Manage cryptographic API tokens, OAuth scopes, and webhook integration credentials." 
        action={<Button variant="primary">Generate API Key</Button>}
      />

      <Card className="fade-in-delay-1" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Active Service Tokens</h2>
        {isLoading ? (
          <div className="skeleton" style={{ height: '30vh' }} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Integration Name</th>
                <th>Token Key Prefix</th>
                <th>Authorized Scopes</th>
                <th>Created</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(keys || []).map((k) => (
                <tr key={k.id}>
                  <td style={{ fontWeight: 600 }}>{k.name}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{k.prefix}••••••••</td>
                  <td>{k.scopes.join(', ')}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{k.createdAt}</td>
                  <td>
                    <Badge colorScheme={k.status === 'Active' ? 'success' : 'danger'}>
                      {k.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default APIKeysPage;
