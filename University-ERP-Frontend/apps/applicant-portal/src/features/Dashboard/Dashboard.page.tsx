import { Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useApplicantJourney } from '../ApplicantJourney.hooks';

export const DashboardPage: React.FC = () => {
  const { data, isLoading } = useApplicantJourney();

  if (isLoading) return <div style={{ color: 'var(--text-secondary)' }}>Loading your journey...</div>;
  if (!data) return null;

  return (
    <div className="fade-in">
      <PageHeader title={`Welcome, ${data.applicantName}`} subtitle={`Applicant ID: ${data.applicantId}`} />
      
      <Card>
        <h3 style={{ margin: '0 0 var(--space-4) 0', color: 'var(--text-primary)' }}>Your Admissions Journey</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {data.milestones.map(m => {
            let color = 'var(--text-secondary)';
            let icon = '⏳';
            let bg = 'var(--bg-base)';
            
            if (m.status === 'Completed') {
              color = 'var(--success-text)';
              icon = '✔';
              bg = 'var(--success-bg)';
            } else if (m.status === 'Active') {
              color = 'var(--brand-primary)';
              icon = '▶';
              bg = 'var(--brand-primary-light, rgba(0, 112, 243, 0.1))'; // Assuming primary light exists
            } else if (m.status === 'Locked') {
              color = 'var(--text-muted)';
              icon = '🔒';
            }

            return (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: bg,
                border: '1px solid var(--border-subtle)',
                opacity: m.status === 'Locked' ? 0.6 : 1
              }}>
                <div style={{ fontSize: '1.25rem' }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 var(--space-1) 0', color: m.status === 'Completed' ? 'var(--text-primary)' : color }}>{m.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{m.description}</p>
                </div>
                {m.dateCompleted && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.dateCompleted}</div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
