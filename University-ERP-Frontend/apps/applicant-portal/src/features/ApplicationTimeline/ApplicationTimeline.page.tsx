import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useApplicationTimeline } from './ApplicationTimeline.hooks';
import { JourneyStep } from './ApplicationTimeline.types';

export const ApplicationTimelinePage: React.FC = () => {
  const { data: timelineData, isLoading, isError } = useApplicationTimeline();

  if (isLoading) return <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }} />;
  if (isError) return (
    <div className="stub-page fade-in">
      <div className="stub-icon">⏳</div>
      <div className="stub-title">Failed to Load Timeline</div>
      <div className="stub-subtitle">Unable to fetch your application journey.</div>
    </div>
  );

  // Fallback mock data if the API returns empty/undefined for the journey
  const steps: JourneyStep[] = timelineData?.steps || [];

  return (
    <div className="fade-in">
      <PageHeader
        title="Application Journey"
        subtitle="Track the real-time status of your university enrollment process."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '800px' }}>
        {steps.map((step, idx) => {
          let statusColor: 'success' | 'warning' | 'default' = 'default';
          if (step.status === 'Completed') statusColor = 'success';
          if (step.status === 'Current') statusColor = 'warning';

          return (
            <Card key={step.id} className={`fade-in-delay-${(idx % 3) + 1}`} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', padding: 'var(--space-5)' }}>
              {step.status === 'Current' && <div className="card-accent-top" style={{ background: 'var(--warning-text)' }} />}

              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                background: step.status === 'Completed' ? 'var(--success-bg)' : step.status === 'Current' ? 'var(--brand-primary)' : 'var(--bg-hover)',
                color: step.status === 'Completed' ? 'var(--success-text)' : step.status === 'Current' ? '#fff' : 'var(--text-muted)'
              }}>
                {step.status === 'Completed' ? '✓' : step.id}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: step.status === 'Pending' ? 'var(--text-muted)' : 'var(--text-bright)' }}>
                    {step.stepName}
                  </h3>
                  <Badge colorScheme={statusColor}>{step.status}</Badge>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {step.description}
                </p>
                {step.completedDate && (
                  <p style={{ margin: 'var(--space-1) 0 0 0', fontSize: '0.75rem', color: 'var(--success-text)', fontFamily: "'JetBrains Mono', monospace" }}>
                    Completed on {step.completedDate}
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};