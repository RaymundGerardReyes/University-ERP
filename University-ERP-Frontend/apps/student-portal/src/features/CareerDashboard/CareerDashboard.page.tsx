import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useJobPostings } from './CareerDashboard.hooks';

export const CareerDashboardPage: React.FC = () => {
  const { data: jobs, isLoading, isError } = useJobPostings();

  if (isLoading) return <div style={{ color: 'white' }}>Loading career opportunities...</div>;
  if (isError || !jobs) return <div style={{ color: 'red' }}>Failed to load job postings.</div>;

  return (
    <div>
      <PageHeader title="Career & Placement Dashboard" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {jobs.map(job => (
          <Card key={job.id}>
            <h3 style={{ color: 'white', marginTop: 0 }}>{job.jobTitle}</h3>
            <h4 style={{ color: '#ccc', margin: '0 0 1rem 0' }}>{job.companyName}</h4>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>📍 {job.location}</p>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>📅 Apply by: {new Date(job.deadline).toLocaleDateString()}</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
              {job.tags.map(tag => <Badge key={tag} colorScheme="info">{tag}</Badge>)}
            </div>
            <Button variant="outline" style={{ width: '100%' }}>Apply Now</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};