import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useGuidanceSessions } from './GuidanceSessions.hooks';

export const GuidanceSessionsPage: React.FC = () => {
  const { data: sessions, isLoading, isError } = useGuidanceSessions();

  if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;
  if (isError || !sessions) return <div className="stub-page fade-in"><div className="stub-title">Failed to load sessions.</div></div>;

  return (
    <div className="fade-in">
      <PageHeader title="Guidance & Counseling" subtitle="Manage your academic, career, and psychological counseling sessions." />

      <div className="grid-auto fade-in-delay-1">
        {sessions.map((session, idx) => (
          <Card key={session.id} className={`fade-in-delay-${(idx % 3) + 1}`} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-accent-top" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <Badge colorScheme="warning">{session.sessionType} Counseling</Badge>
              <span style={{ fontSize: '0.85rem', color: session.status === 'Scheduled' ? 'var(--info-text)' : 'var(--text-muted)', fontWeight: 600 }}>{session.status}</span>
            </div>

            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-4) 0', fontSize: '1.25rem' }}>{session.counselorName}</h3>

            <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
              <div className="data-row">
                <span className="data-label">Date</span>
                <span className="data-value">{session.date}</span>
              </div>
              <div className="data-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <span className="data-label">Time</span>
                <span className="data-value">{session.time}</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              {session.meetingLink ? (
                <Button variant="primary" style={{ width: '100%' }} onClick={() => window.open(session.meetingLink!, '_blank')}>
                  Join Virtual Meeting
                </Button>
              ) : (
                <Button variant="outline" style={{ width: '100%' }} disabled>
                  In-Person Session
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};