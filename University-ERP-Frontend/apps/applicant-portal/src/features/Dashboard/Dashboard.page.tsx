import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useApplicantDashboard } from './Dashboard.hooks';

export const DashboardPage: React.FC = () => {
  const { identity } = useAuth();
  const { data, isLoading, isError } = useApplicantDashboard();

  if (isLoading) return <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }} />;
  if (isError || !data) return <div className="stub-page fade-in"><div className="stub-title">Dashboard Unavailable</div></div>;

  const activeApp = data.status[0];
  const journeySteps = data.journey?.milestones || [];

  return (
    <div className="fade-in">
      <PageHeader
        title={`Welcome, ${identity?.name.split(' ')[0] || 'Applicant'}`}
        subtitle="Track your university application progress and pending tasks."
      />

      {/* Premium Stats Grid */}
      <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
        <Card className="stat-card">
          <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
          <span className="stat-label">Active Applications</span>
          <span className="stat-value">{data.status.length}</span>
          <span className="stat-trend" style={{ color: 'var(--text-muted)' }}>Fall 2026 Term</span>
        </Card>
        <Card className="stat-card">
          <div className="card-accent-top" style={{ background: 'var(--warning-text)' }} />
          <span className="stat-label">Missing Documents</span>
          <span className="stat-value" style={{ color: 'var(--warning-text)' }}>
            {activeApp?.missingDocuments?.length || 0}
          </span>
          <span className="stat-trend">Action Required</span>
        </Card>
      </div>

      <div className="grid-2 fade-in-delay-2">
        <Card>
          <div className="card-accent-top" style={{ background: 'var(--success-text)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>Application Timeline</h2>
            {activeApp && <Badge colorScheme="info">{activeApp.status}</Badge>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {journeySteps.map((step: any, idx: number) => {
              const isCompleted = step.status === 'Completed';
              return (
                <div key={step.id ?? idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: isCompleted ? 'var(--success-text)' : 'var(--bg-elevated)',
                    border: isCompleted ? 'none' : '2px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--bg-base)', fontSize: '0.7rem', fontWeight: 'bold'
                  }}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx === journeySteps.length - 1 ? 'none' : '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
                    <span style={{ color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: isCompleted ? 600 : 500 }}>
                      {step.title ?? step.stepName}
                    </span>
                    {step.dateCompleted && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(step.dateCompleted).toLocaleDateString()}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Button variant="secondary" style={{ justifyContent: 'flex-start' }}>Upload Missing Documents</Button>
            <Button variant="secondary" style={{ justifyContent: 'flex-start' }}>Update Personal Profile</Button>
            <Button variant="secondary" style={{ justifyContent: 'flex-start' }}>Contact Admissions Office</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};