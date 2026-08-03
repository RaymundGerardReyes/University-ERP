import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useJobPostings } from './CareerDashboard.hooks';

export const CareerDashboardPage: React.FC = () => {
  const { data: jobs, isLoading, isError } = useJobPostings();

  if (isLoading) return <div style={{ color: 'var(--text-secondary)' }}>Loading career opportunities...</div>;
  if (isError || !jobs) return <div style={{ color: 'red' }}>Failed to load job postings.</div>;

  return (
    <div className="fade-in">
      <PageHeader title="Career & Placement Dashboard" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
        {jobs.map(job => (
          <Card key={job.id}>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }}>{job.jobTitle}</h3>
            <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 var(--space-4) 0' }}>{job.companyName}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>📍 {job.location}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>📅 Apply by: {new Date(job.deadline).toLocaleDateString()}</p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
              {job.tags.map(tag => <Badge key={tag} colorScheme="info">{tag}</Badge>)}
            </div>
            <Button variant="outline" style={{ width: '100%' }}>Apply Now</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};