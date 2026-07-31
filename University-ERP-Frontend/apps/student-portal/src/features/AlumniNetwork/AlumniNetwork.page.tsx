import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { alumniApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Card, PageHeader, Badge, Button } from '@university-erp/ui-kit';

export default function AlumniNetwork() {
  const { user } = useAuth();
  
  const { data: alumniInfo, isLoading, error } = useQuery({
    queryKey: ['alumniStatus', user?.id],
    queryFn: () => alumniApi.getAlumniStatus(user!.id),
    enabled: !!user?.id
  });

  if (isLoading) return <div style={{ color: '#aaa' }}>Loading alumni data...</div>;
  if (error) return <div style={{ color: 'hsl(0, 70%, 60%)' }}>Error loading data.</div>;
  if (!alumniInfo) return <div style={{ color: '#888' }}>No alumni record found.</div>;

  return (
    <div>
      <PageHeader title="Alumni Network & Clearance" />

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Graduating Class of {alumniInfo.graduationYear}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white' }}>Alumni Registration</div>
          </div>
          <Badge colorScheme={alumniInfo.alumniStatus === 'Pending Clearance' ? 'warning' : 'success'}>
            {alumniInfo.alumniStatus}
          </Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Regional Chapter</div>
            <div style={{ color: 'white', fontSize: '1.1rem' }}>{alumniInfo.chapter || 'Not Assigned'}</div>
          </div>
          <div>
            <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Alumni Benefits</div>
            <div style={{ color: alumniInfo.benefitsActive ? 'hsl(160, 70%, 55%)' : '#aaa', fontSize: '1.1rem' }}>
              {alumniInfo.benefitsActive ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>

        {alumniInfo.alumniStatus === 'Pending Clearance' && (
          <div style={{ background: 'rgba(255, 152, 0, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid hsl(36, 100%, 50%)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'hsl(36, 100%, 50%)' }}>Clearance Required</h4>
            <p style={{ margin: '0 0 1rem 0', color: '#ccc', fontSize: '0.9rem' }}>
              You must complete your departmental and library clearance before your alumni status can be fully registered.
            </p>
            <Button variant="primary">Start Clearance Workflow</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
