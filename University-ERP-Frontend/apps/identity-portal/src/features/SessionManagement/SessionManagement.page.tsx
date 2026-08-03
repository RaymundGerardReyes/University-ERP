import React from 'react';
import { Card, PageHeader, Badge, Button } from '@university-erp/ui-kit';
import { UserSessionViewModel } from '@university-erp/domain-viewmodels';
import { useSessionManagement } from './SessionManagement.hooks';

export default function SessionManagement() {
  const { data: sessions, isLoading, error } = useSessionManagement();

  if (isLoading) return <div>Loading active sessions...</div>;
  if (error) return <div>Failed to load session data.</div>;

  return (
    <div>
      <PageHeader title="Active Sessions" />
      
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {sessions?.map((session: UserSessionViewModel) => (
          <Card key={session.sessionId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>{session.device}</h3>
              <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>
                Location: {session.location} | Last Active: {new Date(session.lastActive).toLocaleString()}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Badge colorScheme="info">Active</Badge>
              <Button variant="primary">Revoke</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
