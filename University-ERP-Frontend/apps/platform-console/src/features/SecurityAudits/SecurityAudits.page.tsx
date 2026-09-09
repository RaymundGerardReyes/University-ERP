import React from 'react';
import { PageHeader, Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useSecurityAudits } from './SecurityAudits.hooks';

export const SecurityAuditsPage: React.FC = () => {
  const { data: events, isLoading } = useSecurityAudits();

  return (
    <div className="fade-in">
      <PageHeader 
        title="Security and Access Audits" 
        subtitle="Real-time security telemetry, authentication anomalies, and role elevation trails." 
        action={<Button variant="outline">Export Audit Trail</Button>}
      />

      <Card className="fade-in-delay-1" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Zero Trust Access Log Stream</h2>
        {isLoading ? (
          <div className="skeleton" style={{ height: '30vh' }} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Event Signature</th>
                <th>Principal ID</th>
                <th>Source IP</th>
                <th>Threat Severity</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {(events || []).map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600 }}>{e.eventType}</td>
                  <td style={{ fontFamily: 'monospace' }}>{e.principalId}</td>
                  <td style={{ fontFamily: 'monospace' }}>{e.ipAddress}</td>
                  <td>
                    <Badge colorScheme={e.severity === 'Critical' ? 'danger' : e.severity === 'Warning' ? 'warning' : 'info'}>
                      {e.severity}
                    </Badge>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{e.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default SecurityAuditsPage;
