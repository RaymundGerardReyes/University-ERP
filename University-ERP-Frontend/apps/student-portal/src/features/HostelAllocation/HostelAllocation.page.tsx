import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useHostelAllocation } from './HostelAllocation.hooks';

export const HostelAllocationPage: React.FC = () => {
  const { data: allocation, isLoading, isError } = useHostelAllocation();

  if (isLoading) return <div style={{ color: 'white' }}>Loading hostel details...</div>;
  if (isError || !allocation) return <div style={{ color: 'red' }}>Failed to load hostel allocation.</div>;

  return (
    <div>
      <PageHeader title="My Hostel & Housing" />
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ color: 'white', marginTop: 0 }}>{allocation.hostelName}</h2>
            <p style={{ color: '#aaa' }}>Room: <strong>{allocation.roomNumber}</strong> ({allocation.roomType})</p>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Roommates:</h4>
            <ul style={{ color: '#aaa', margin: 0, paddingLeft: '1.2rem' }}>
              {allocation.roommates.map(rm => <li key={rm}>{rm}</li>)}
            </ul>
          </div>
          <Badge colorScheme="success">{allocation.status}</Badge>
        </div>
      </Card>
    </div>
  );
};