import { Badge, Button, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useJobPostings } from './CareerDashboard.hooks';

export const CareerDashboardPage: React.FC = () => {
  const { data: jobs, isLoading, isError } = useJobPostings();

  if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;
  if (isError || !jobs) return <div className="stub-page fade-in"><div className="stub-title">Failed to load job postings.</div></div>;

  return (
    <div className="fade-in">
      <PageHeader title="Career & Placement" subtitle="Discover exclusive opportunities for university students and alumni." />

      <div className="grid-auto fade-in-delay-1">
        {jobs.map((job, idx) => (
          <div className={`card fade-in-delay-${(idx % 3) + 1}`} key={job.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-accent-top" />
            <div style={{ flex: 1 }}>
              <h3 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0', fontSize: '1.25rem', lineHeight: 1.3 }}>{job.jobTitle}</h3>
              <h4 style={{ color: 'var(--brand-primary)', margin: '0 0 var(--space-4) 0', fontSize: '0.95rem', fontWeight: 600 }}>{job.companyName}</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Location</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500 }}>{job.location}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Deadline</span>
                  <span style={{ color: 'var(--danger-text)', fontSize: '0.85rem', fontWeight: 600 }}>{new Date(job.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
                {job.tags.map(tag => <Badge key={tag} colorScheme="info" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>{tag}</Badge>)}
              </div>
            </div>

            <Button variant="primary" style={{ width: '100%' }}>Apply via University Portal</Button>
          </div>
        ))}
      </div>
    </div>
  );
};