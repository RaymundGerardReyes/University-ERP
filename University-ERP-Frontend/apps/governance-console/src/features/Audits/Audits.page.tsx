import React from 'react';
import { PageHeader, Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useAudits } from './Audits.hooks';

export const AuditsPage: React.FC = () => {
  const { data: audits, isLoading } = useAudits();

  return (
    <div className="fade-in">
      <PageHeader 
        title="Internal and External Audits" 
        subtitle="Coordinate institutional audits, compliance checks, and external evaluations." 
        action={<Button variant="primary">Schedule New Audit</Button>}
      />

      <Card className="fade-in-delay-1" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Scheduled Audits and Inspections</h2>
        {isLoading ? (
          <div className="skeleton" style={{ height: '30vh' }} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Audit Code</th>
                <th>Scope</th>
                <th>Lead Auditor</th>
                <th>Status</th>
                <th>Findings Recorded</th>
                <th>Audit Date</th>
              </tr>
            </thead>
            <tbody>
              {(audits || []).map((a) => (
                <tr key={a.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{a.auditCode}</td>
                  <td><Badge colorScheme="default">{a.scope}</Badge></td>
                  <td>{a.leadAuditor}</td>
                  <td>
                    <Badge colorScheme={a.status === 'Completed' ? 'success' : a.status === 'InProgress' ? 'warning' : 'info'}>
                      {a.status}
                    </Badge>
                  </td>
                  <td>{a.findingsCount} action item(s)</td>
                  <td style={{ color: 'var(--text-muted)' }}>{a.scheduledDate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default AuditsPage;
