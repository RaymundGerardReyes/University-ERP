import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useHostelAllocation } from './HostelAllocation.hooks';

export const HostelAllocationPage: React.FC = () => {
  const { data: allocation, isLoading, isError } = useHostelAllocation();

  if (isLoading) return <div style={{ color: 'var(--text-secondary)' }}>Loading hostel details...</div>;
  if (isError || !allocation) return <div style={{ color: 'red' }}>Failed to load hostel allocation.</div>;

  return (
    <div className="fade-in">
      <PageHeader title="Hostel Allocation" />
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h2 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }}>{allocation.hostelName}</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 var(--space-4) 0' }}>Room: <strong>{allocation.roomNumber}</strong> ({allocation.roomType})</p>
            <h4 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-2) 0' }}>Roommates:</h4>
            <ul style={{ color: 'var(--text-secondary)', margin: 0, paddingLeft: 'var(--space-4)' }}>
              {allocation.roommates.map(rm => <li key={rm} style={{ marginBottom: 'var(--space-1)' }}>{rm}</li>)}
            </ul>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Badge colorScheme="success">{allocation.status}</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};