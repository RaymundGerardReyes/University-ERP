import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { Link } from 'react-router-dom';
import { useApplicantJourney } from '../ApplicantJourney.hooks';

export const DashboardPage: React.FC = () => {
  const { data, isLoading } = useApplicantJourney();

  if (isLoading) return (
    <div className="fade-in">
      <div className="skeleton" style={{ height: '80px', marginBottom: 'var(--space-6)' }} />
      <div className="grid-2"><div className="skeleton" style={{ height: '200px' }} /><div className="skeleton" style={{ height: '200px' }} /></div>
    </div>
  );
  if (!data) return <div className="stub-page fade-in"><div className="stub-title">No Journey Data Found</div></div>;

  const activeMilestone = data.milestones.find(m => m.status === 'Active');
  const completedCount = data.milestones.filter(m => m.status === 'Completed').length;
  const progressPercent = Math.round((completedCount / data.milestones.length) * 100) || 0;

  return (
    <div className="fade-in">
      <PageHeader
        title={`Welcome back, ${data.applicantName.split(' ')[0]}`}
        subtitle={`Applicant ID: ${data.applicantId} • Let's get you enrolled.`}
      />

      <div className="grid-2 fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Progress Card */}
        <Card style={{ background: 'var(--bg-elevated)', position: 'relative' }}>
          <div className="card-accent-top" />
          <h3 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Application Progress
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-bright)', letterSpacing: '-0.03em' }}>{progressPercent}%</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>completed</span>
          </div>

          <div style={{ height: '6px', background: 'var(--bg-base)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progressPercent}%`,
              background: 'var(--brand-gradient)', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </Card>

        {/* Next Action Card */}
        <Card style={{ borderColor: 'var(--brand-primary)', background: 'rgba(59, 130, 246, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--brand-primary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Next Required Action
            </h3>
            <Badge colorScheme="info">Action Required</Badge>
          </div>

          {activeMilestone ? (
            <div style={{ marginTop: 'var(--space-3)' }}>
              <h2 style={{ fontSize: '1.4rem', margin: '0 0 var(--space-2) 0', color: 'var(--text-primary)' }}>{activeMilestone.title}</h2>
              <p style={{ margin: '0 0 var(--space-5) 0', color: 'var(--text-secondary)' }}>{activeMilestone.description}</p>
              <Link to="/apply" style={{ textDecoration: 'none' }}>
                <Button variant="primary" style={{ width: '100%' }}>Continue Application →</Button>
              </Link>
            </div>
          ) : (
            <div style={{ padding: 'var(--space-4) 0', textAlign: 'center', color: 'var(--success-text)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>✓</div>
              <p style={{ margin: 0, fontWeight: 500 }}>You're all caught up! Wait for admission decision.</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="fade-in-delay-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem' }}>Journey Overview</h3>
          <Link to="/timeline" style={{ color: 'var(--text-accent)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>View Full Timeline</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {data.milestones.map(m => {
            const isCompleted = m.status === 'Completed';
            const isActive = m.status === 'Active';

            return (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
                backgroundColor: isCompleted ? 'var(--success-bg)' : isActive ? 'var(--info-bg)' : 'var(--bg-elevated)',
                border: `1px solid ${isCompleted ? 'var(--success-border)' : isActive ? 'var(--info-border)' : 'var(--border-subtle)'}`,
                opacity: m.status === 'Locked' ? 0.5 : 1
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: isCompleted ? 'var(--success-text)' : isActive ? 'var(--brand-primary)' : 'var(--bg-base)',
                  color: isActive || isCompleted ? 'white' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                  {isCompleted ? '✓' : isActive ? '●' : '🔒'}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{m.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{m.description}</p>
                </div>
                {isCompleted && <Badge colorScheme="success">Completed</Badge>}
                {isActive && <Badge colorScheme="info">In Progress</Badge>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};