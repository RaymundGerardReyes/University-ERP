import { Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useApplicantJourney } from '../ApplicantJourney.hooks';

export const ApplicationTimelinePage: React.FC = () => {
  const { data, isLoading } = useApplicantJourney();

  if (isLoading) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ height: '80px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', animation: 'pulse 2s infinite' }} />
        <div style={{ height: '300px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', animation: 'pulse 2s infinite' }} />
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <PageHeader 
        title="Application Timeline" 
        subtitle="Detailed audit history of your admission journey." 
      />
      
      <Card style={{ position: 'relative', overflow: 'hidden', padding: 'var(--space-6) var(--space-8)' }}>
        {/* Decorative background glow */}
        <div style={{ position: 'absolute', top: 0, left: '30px', width: '2px', height: '100%', background: 'linear-gradient(to bottom, var(--brand-primary), rgba(255,255,255,0.05))', opacity: 0.5 }} />

        <div style={{ position: 'absolute', left: '30px', top: 'var(--space-8)', bottom: 'var(--space-8)', width: '2px', backgroundColor: 'var(--border-subtle)', zIndex: 0 }} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', position: 'relative', zIndex: 1 }}>
          {data.timeline.map((event, idx) => {
            const isLatest = idx === 0;
            return (
              <div key={idx} style={{ display: 'flex', gap: 'var(--space-6)', position: 'relative' }}>
                <div style={{ 
                  width: '20px', height: '20px', borderRadius: '50%', 
                  backgroundColor: isLatest ? 'var(--brand-primary)' : 'var(--bg-surface)',
                  border: `3px solid ${isLatest ? 'var(--bg-base)' : 'var(--border-color)'}`,
                  boxShadow: isLatest ? '0 0 0 4px rgba(59, 130, 246, 0.3)' : 'none',
                  marginTop: 'var(--space-1)',
                  marginLeft: '-9px', // center over the 2px line (which is at left:30, padding-left is handled by the flex gap)
                  position: 'relative',
                  zIndex: 2,
                  transition: 'all 0.3s ease'
                }} />
                
                <div style={{ 
                  flex: 1, 
                  background: isLatest ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isLatest ? 'rgba(59, 130, 246, 0.2)' : 'var(--border-subtle)'}`,
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }} className="hover-lift">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <h4 style={{ margin: 0, color: isLatest ? 'var(--brand-primary)' : 'var(--text-primary)', fontSize: '1.1rem' }}>
                      {event.event}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, background: 'var(--bg-base)', padding: '2px 8px', borderRadius: '12px' }}>
                      {event.date}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {event.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
