import React from 'react';
import { useAuth } from '@university-erp/auth-sdk';
import { Card, PageHeader, Button } from '@university-erp/ui-kit';
import { useGuidanceSessions } from './GuidanceSessions.hooks';

export default function GuidanceSessions() {
  const { user } = useAuth();
  const { data: sessions, isLoading, error } = useGuidanceSessions(user?.id);

  if (isLoading) return <div style={{ color: '#aaa' }}>Loading guidance sessions...</div>;
  if (error) return <div style={{ color: 'hsl(0, 70%, 60%)' }}>Error loading data.</div>;

  return (
    <div>
      <PageHeader 
        title="Counseling & Guidance" 
        action={<Button variant="secondary">Request Session</Button>}
      />

      {!sessions || sessions.length === 0 ? (
        <div style={{ color: '#888' }}>No counseling sessions found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sessions.map(session => (
            <Card key={session.id} gradient>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 600 }}>{session.counselorName}</div>
                <div style={{ color: '#aaa', fontSize: '0.9rem' }}>{session.date} - {session.time}</div>
              </div>
              <div style={{ color: 'hsl(280, 70%, 75%)', fontSize: '0.9rem', marginBottom: '1rem' }}>{session.sessionType} Counseling</div>
              {session.meetingLink && (
                <a href={session.meetingLink} target="_blank" rel="noreferrer" style={{
                  display: 'inline-block', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem'
                }}>Join Virtual Meeting</a>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
