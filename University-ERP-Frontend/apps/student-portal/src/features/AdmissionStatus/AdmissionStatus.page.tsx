import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useAdmissionStatus } from './AdmissionStatus.hooks';

export const AdmissionStatusPage: React.FC = () => {
  const { data: applications, isLoading, isError } = useAdmissionStatus();

  if (isLoading) return <div style={{ color: 'white' }}>Loading admission status...</div>;
  if (isError || !applications) return <div style={{ color: 'red' }}>Failed to load admission data.</div>;

  return (
    <div>
      <PageHeader title="Admission Status" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {applications.map((app) => (
          <Card key={app.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>{app.programName}</h3>
                <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Application ID: {app.id} • Submitted: {new Date(app.submittedDate).toLocaleDateString()}</span>
              </div>
              <Badge colorScheme={app.status === 'Enrolled' || app.status === 'Accepted' ? 'success' : 'warning'}>
                {app.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};