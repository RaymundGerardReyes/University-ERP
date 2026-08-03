import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useAlumniStatus } from './AlumniNetwork.hooks';

export const AlumniNetworkPage: React.FC = () => {
  const { data: alumni, isLoading, isError } = useAlumniStatus();

  if (isLoading) return <div style={{ color: 'var(--text-secondary)' }}>Loading alumni profile...</div>;
  if (isError || !alumni) return <div style={{ color: 'red' }}>Failed to load alumni data.</div>;

  return (
    <div className="fade-in">
      <PageHeader title="Alumni Network" />
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h2 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }}>Class of {alumni.graduationYear}</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 var(--space-4) 0' }}>Regional Chapter: <strong>{alumni.chapter || 'Unassigned'}</strong></p>
            <h4 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-2) 0' }}>Active Benefits:</h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              {alumni.benefitsActive ? 'Benefits are active' : 'No active benefits'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Badge colorScheme={alumni.alumniStatus === 'Active Member' || alumni.alumniStatus === 'Registered' ? 'success' : 'warning'}>
              {alumni.alumniStatus === 'Active Member' || alumni.alumniStatus === 'Registered' ? 'Active Alumni' : 'Pending Registration'}
            </Badge>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 'var(--space-4)' }}>
              Clearance: {alumni.alumniStatus}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};