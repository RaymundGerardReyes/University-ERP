import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { careerApi } from '@university-erp/api-clients';
import { Card, PageHeader, Button } from '@university-erp/ui-kit';

export default function CareerDashboard() {
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['careerJobs'],
    queryFn: () => careerApi.getJobPostings()
  });

  if (isLoading) return <div style={{ color: '#aaa' }}>Loading job postings...</div>;
  if (error) return <div style={{ color: 'hsl(0, 70%, 60%)' }}>Error loading data.</div>;

  return (
    <div>
      <PageHeader title="Career & Placement Dashboard" />

      {!jobs || jobs.length === 0 ? (
        <div style={{ color: '#888' }}>No job postings available at this time.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {jobs.map(job => (
            <Card key={job.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', color: 'white' }}>{job.jobTitle}</h3>
                <div style={{ color: 'hsl(220, 90%, 75%)', fontWeight: 500, marginBottom: '1rem' }}>{job.companyName}</div>
                <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>📍 {job.location}</div>
                <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>⏳ Deadline: {new Date(job.deadline).toLocaleDateString()}</div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {job.tags.map(tag => (
                    <span key={tag} style={{
                      background: 'rgba(255, 255, 255, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: '#ccc'
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
              <Button variant="outline" style={{ width: '100%' }}>Apply Now</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
