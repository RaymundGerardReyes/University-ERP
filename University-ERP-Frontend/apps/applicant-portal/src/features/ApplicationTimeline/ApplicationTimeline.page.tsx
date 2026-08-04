import { Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useApplicantJourney } from '../ApplicantJourney.hooks';

export const ApplicationTimelinePage: React.FC = () => {
  const { data, isLoading } = useApplicantJourney();

  if (isLoading) return <div className="skeleton fade-in" style={{ height: '500px' }} />;
  if (!data) return null;

  return (
    <div className="fade-in">
      <PageHeader title="Application Timeline" subtitle="Detailed audit history of your admission journey." />

      <Card className="fade-in-delay-1" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '2rem', top: 'var(--space-6)', bottom: 'var(--space-6)', width: '2px', background: 'var(--border-color)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {data.timeline.map((event, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 'var(--space-6)', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: idx === 0 ? 'var(--brand-primary)' : 'var(--bg-elevated)', border: `2px solid ${idx === 0 ? 'var(--bg-base)' : 'var(--border-color)'}`, marginTop: '4px', marginLeft: '-7px' }} />
              <div style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                  <h4 style={{ margin: 0, color: idx === 0 ? 'var(--brand-primary)' : 'var(--text-primary)', fontSize: '1rem' }}>{event.event}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{event.date}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{event.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};