import React from 'react';
import { PageHeader, Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useSystemLogs } from './SystemLogs.hooks';

export const SystemLogsPage: React.FC = () => {
  const { data: logs, isLoading } = useSystemLogs();

  return (
    <div className="fade-in">
      <PageHeader 
        title="System and Application Logs" 
        subtitle="Centralized Loki and OpenTelemetry distributed trace log ingestion stream." 
        action={<Button variant="outline">Live Tail Stream</Button>}
      />

      <Card className="fade-in-delay-1" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Distributed Monolith Log Feed</h2>
        {isLoading ? (
          <div className="skeleton" style={{ height: '30vh' }} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Originating Service</th>
                <th>Log Level</th>
                <th>Payload Message</th>
                <th>Trace ID</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {(logs || []).map((l) => (
                <tr key={l.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{l.service}</td>
                  <td>
                    <Badge colorScheme={l.level === 'ERROR' ? 'danger' : l.level === 'WARN' ? 'warning' : 'info'}>
                      {l.level}
                    </Badge>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{l.message}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--brand-primary)' }}>{l.traceId}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{l.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default SystemLogsPage;
