import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useAlumniStatus } from './AlumniNetwork.hooks';

export const AlumniNetworkPage: React.FC = () => {
  const { data: alumni, isLoading, isError } = useAlumniStatus();

  if (isLoading) return <div style={{ color: 'white' }}>Loading alumni profile...</div>;
  if (isError || !alumni) return <div style={{ color: 'red' }}>Failed to load alumni data.</div>;

  return (
    <div>
      <PageHeader title="Alumni Network" />
      <Card gradient>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ color: 'white', marginTop: 0 }}>Class of {alumni.graduationYear}</h2>
            <p style={{ color: '#aaa' }}>Regional Chapter: <strong>{alumni.regionalChapter || 'Unassigned'}</strong></p>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Active Benefits:</h4>
            <ul style={{ color: '#aaa', margin: 0, paddingLeft: '1.2rem' }}>
              {alumni.activeBenefits.map(b => <li key={b}>{b}</li>)}
            </ul>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Badge colorScheme={alumni.isRegisteredAlumni ? 'success' : 'warning'}>
              {alumni.isRegisteredAlumni ? 'Active Alumni' : 'Pending Registration'}
            </Badge>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '1rem' }}>
              Clearance: {alumni.graduationClearanceStatus}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};