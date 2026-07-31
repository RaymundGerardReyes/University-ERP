import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { hostelApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Card, PageHeader } from '@university-erp/ui-kit';

export default function HostelAllocation() {
  const { user } = useAuth();
  
  const { data: allocation, isLoading, error } = useQuery({
    queryKey: ['hostelAllocation', user?.id],
    queryFn: () => hostelApi.getAllocation(user!.id),
    enabled: !!user?.id
  });

  if (isLoading) return <div style={{ color: '#aaa' }}>Loading allocation...</div>;
  if (error) return <div style={{ color: 'hsl(0, 70%, 60%)' }}>Error loading data.</div>;
  if (!allocation) return <div style={{ color: '#888' }}>No room allocation found.</div>;

  return (
    <div>
      <PageHeader title="Hostel Allocation" />
      
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <InfoField label="Hostel Name" value={allocation.hostelName} />
          <InfoField label="Room Number" value={allocation.roomNumber} highlight />
          <InfoField label="Room Type" value={allocation.roomType} />
          <InfoField label="Status" value={allocation.status} />
        </div>
        
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '1rem' }}>Roommates</h3>
          <ul style={{ paddingLeft: '1.5rem', color: 'white', margin: 0 }}>
            {allocation.roommates.map(rm => (
              <li key={rm} style={{ marginBottom: '0.5rem' }}>{rm}</li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}

function InfoField({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div>
      <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.4rem' }}>{label}</div>
      <div style={{ color: highlight ? 'hsl(220, 90%, 65%)' : 'white', fontSize: '1.2rem', fontWeight: highlight ? 600 : 400 }}>{value}</div>
    </div>
  );
}
