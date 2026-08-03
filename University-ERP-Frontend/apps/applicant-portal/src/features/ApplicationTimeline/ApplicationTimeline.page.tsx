import { Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useApplicantJourney } from '../ApplicantJourney.hooks';

export const ApplicationTimelinePage: React.FC = () => {
  const { data, isLoading } = useApplicantJourney();

  if (isLoading) return <div style={{ color: 'var(--text-secondary)' }}>Loading audit trail...</div>;
  if (!data) return null;

  return (
    <div className="fade-in">
      <PageHeader title="Application Timeline" subtitle="Detailed audit history of your admission journey." />
      
      <Card style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 'var(--space-6)', top: 'var(--space-6)', bottom: 'var(--space-6)', width: '2px', backgroundColor: 'var(--border-subtle)' }} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {data.timeline.map((event, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 'var(--space-5)', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '16px', height: '16px', borderRadius: '50%', 
                backgroundColor: idx === 0 ? 'var(--brand-primary)' : 'var(--bg-base)',
                border: `2px solid ${idx === 0 ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                marginTop: 'var(--space-1)'
              }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>{event.date}</div>
                <h4 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--text-primary)' }}>{event.event}</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{event.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
