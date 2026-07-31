import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useGuidanceSessions } from './GuidanceSessions.hooks';

export const GuidanceSessionsPage: React.FC = () => {
  const { data: sessions, isLoading, isError } = useGuidanceSessions();

  if (isLoading) return <div style={{ color: 'white' }}>Loading guidance sessions...</div>;
  if (isError || !sessions) return <div style={{ color: 'red' }}>Failed to load sessions.</div>;

  return (
    <div>
      <PageHeader title="Guidance & Counseling" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sessions.map(session => (
          <Card key={session.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>{session.counselorName}</h3>
                <p style={{ color: '#aaa', margin: 0 }}>Type: {session.sessionType} • {session.date} at {session.time}</p>
              </div>
              {session.meetingLink && (
                <Button onClick={() => window.open(session.meetingLink!, '_blank')}>Join Meeting</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};