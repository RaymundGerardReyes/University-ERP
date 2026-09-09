import React from 'react';
import { PageHeader, Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useGlobalSettings } from './GlobalSettings.hooks';

export const GlobalSettingsPage: React.FC = () => {
  const { data: settings, isLoading } = useGlobalSettings();

  return (
    <div className="fade-in">
      <PageHeader 
        title="Platform Global Settings" 
        subtitle="Manage global runtime parameters, security policies, and localization defaults." 
        action={<Button variant="primary">Save Changes</Button>}
      />

      <Card className="fade-in-delay-1" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Configuration Registry</h2>
        {isLoading ? (
          <div className="skeleton" style={{ height: '30vh' }} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Config Key</th>
                <th>Domain Category</th>
                <th>Current Value</th>
                <th>Description</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              {(settings || []).map((s) => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.key}</td>
                  <td><Badge colorScheme="default">{s.category}</Badge></td>
                  <td style={{ fontFamily: 'monospace' }}>{s.value}</td>
                  <td>{s.description}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{s.lastModified}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default GlobalSettingsPage;
