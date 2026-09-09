import React from 'react';
import { PageHeader, Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useDatabaseClusters } from './DatabaseManagement.hooks';

export const DatabaseManagementPage: React.FC = () => {
  const { data: nodes, isLoading } = useDatabaseClusters();

  return (
    <div className="fade-in">
      <PageHeader 
        title="Database and Storage Management" 
        subtitle="Monitor PostgreSQL cluster instances, connection pools, and cross-region replication health." 
        action={<Button variant="outline">Trigger Schema Migration</Button>}
      />

      <Card className="fade-in-delay-1" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>High-Availability Cluster Topology</h2>
        {isLoading ? (
          <div className="skeleton" style={{ height: '30vh' }} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Cluster Node</th>
                <th>Cluster Role</th>
                <th>Active Connections</th>
                <th>Disk Utilization</th>
                <th>Replication Lag</th>
                <th>Node Status</th>
              </tr>
            </thead>
            <tbody>
              {(nodes || []).map((n) => (
                <tr key={n.nodeId}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{n.nodeId}</td>
                  <td><Badge colorScheme={n.role === 'Primary' ? 'info' : 'default'}>{n.role}</Badge></td>
                  <td>{n.connections} / {n.maxConnections}</td>
                  <td>{n.diskUsagePercent}%</td>
                  <td>{n.replicationLagMs} ms</td>
                  <td><Badge colorScheme="success">{n.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default DatabaseManagementPage;
