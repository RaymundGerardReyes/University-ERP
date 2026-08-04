import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useApplicantJourney } from '../ApplicantJourney.hooks';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
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

  const activeMilestone = data.milestones.find(m => m.status === 'Active');
  const completedCount = data.milestones.filter(m => m.status === 'Completed').length;
  const progressPercent = Math.round((completedCount / data.milestones.length) * 100) || 0;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <PageHeader 
        title={`Welcome back, ${data.applicantName.split(' ')[0]}`}
        subtitle={`Applicant ID: ${data.applicantId} • Let's get you enrolled.`} 
      />
      
      {/* Top Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
        
        {/* Progress Card */}
        <Card style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '200px', height: '200px', background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(40px)' }} />
          <h3 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Application Progress</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{progressPercent}%</span>
            <span style={{ color: 'var(--text-muted)' }}>completed</span>
          </div>
          
          <div style={{ height: '8px', background: 'var(--bg-base)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${progressPercent}%`, 
              background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))',
              borderRadius: '99px',
              transition: 'width 1s ease-out'
            }} />
          </div>
        </Card>

        {/* Next Action Card */}
        <Card style={{ border: '1px solid var(--brand-primary-light, rgba(59, 130, 246, 0.3))', background: 'rgba(59, 130, 246, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--brand-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Next Required Action</h3>
            <Badge colorScheme="info">Action Required</Badge>
          </div>
          
          {activeMilestone ? (
            <>
              <h2 style={{ fontSize: '1.25rem', margin: 'var(--space-2) 0', color: 'var(--text-primary)' }}>{activeMilestone.title}</h2>
              <p style={{ margin: '0 0 var(--space-4) 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{activeMilestone.description}</p>
              <Link to="/apply" style={{ textDecoration: 'none' }}>
                <Button variant="primary" style={{ width: '100%' }}>Continue Application →</Button>
              </Link>
            </>
          ) : (
            <div style={{ padding: 'var(--space-4) 0', textAlign: 'center', color: 'var(--success-text)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🎉</div>
              <p style={{ margin: 0 }}>You're all caught up! Wait for admission decision.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Main Journey Timeline Overview */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem' }}>Journey Overview</h3>
          <Link to="/timeline" style={{ color: 'var(--brand-primary)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>View Full Timeline</Link>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {data.milestones.map(m => {
            let color = 'var(--text-secondary)';
            let icon = '⏳';
            let bg = 'rgba(255,255,255,0.02)';
            let borderColor = 'var(--border-subtle)';
            
            if (m.status === 'Completed') {
              color = 'var(--success-text)';
              icon = '✓';
              bg = 'rgba(16, 185, 129, 0.05)';
              borderColor = 'rgba(16, 185, 129, 0.2)';
            } else if (m.status === 'Active') {
              color = 'var(--brand-primary)';
              icon = '→';
              bg = 'rgba(59, 130, 246, 0.05)';
              borderColor = 'rgba(59, 130, 246, 0.3)';
            } else if (m.status === 'Locked') {
              color = 'var(--text-muted)';
              icon = '🔒';
            }

            return (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: bg,
                border: `1px solid ${borderColor}`,
                opacity: m.status === 'Locked' ? 0.5 : 1,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: m.status === 'Active' ? 'pointer' : 'default',
              }}
              className={m.status === 'Active' ? 'hover-lift' : ''}
              >
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: m.status === 'Completed' ? 'var(--success-bg)' : m.status === 'Active' ? 'var(--brand-primary)' : 'var(--bg-base)',
                  color: m.status === 'Active' ? 'white' : color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: 'bold'
                }}>
                  {icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 2px 0', color: m.status === 'Completed' ? 'var(--text-primary)' : color, fontSize: '0.95rem' }}>{m.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.description}</p>
                </div>
                {m.dateCompleted && (
                  <Badge colorScheme="success">Completed</Badge>
                )}
                {m.status === 'Active' && (
                  <Badge colorScheme="info">In Progress</Badge>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
        <Link to="/programs" style={{ textDecoration: 'none' }}>
          <Card style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', transition: 'background 0.2s', cursor: 'pointer' }} className="hover-bg-subtle">
            <div style={{ fontSize: '1.5rem' }}>📚</div>
            <div>
              <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Explore Programs</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Find your perfect degree</span>
            </div>
          </Card>
        </Link>
        <Link to="/documents" style={{ textDecoration: 'none' }}>
          <Card style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', transition: 'background 0.2s', cursor: 'pointer' }} className="hover-bg-subtle">
            <div style={{ fontSize: '1.5rem' }}>📄</div>
            <div>
              <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>My Documents</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upload transcripts & ID</span>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};
