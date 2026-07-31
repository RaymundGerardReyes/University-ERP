import React from 'react';
import { useAuth } from '@university-erp/auth-sdk';
import { Card, PageHeader, Badge } from '@university-erp/ui-kit';
import { useAdmissionStatus } from './AdmissionStatus.hooks';

export default function AdmissionStatus() {
  const { user } = useAuth();
  const { data: applications, isLoading, error } = useAdmissionStatus(user?.id);

  if (isLoading) return <div style={{ color: '#aaa' }}>Loading applications...</div>;
  if (error) return <div style={{ color: 'hsl(0, 70%, 60%)' }}>Error loading data.</div>;
  if (!applications || applications.length === 0) return <div style={{ color: '#888' }}>No applications found.</div>;

  return (
    <div>
      <PageHeader title="Admission Status" />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {applications.map(app => (
          <Card key={app.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Application ID: {app.id}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white' }}>{app.programName}</div>
              </div>
              <Badge colorScheme={app.status === 'Enrolled' ? 'success' : 'warning'}>
                {app.status}
              </Badge>
            </div>
            
            <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
              Submitted: {new Date(app.submittedDate).toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
