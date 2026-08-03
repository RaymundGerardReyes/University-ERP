import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useAdmissionStatus } from './AdmissionStatus.hooks';

export const AdmissionStatusPage: React.FC = () => {
  const { data: applications, isLoading, isError } = useAdmissionStatus();

  if (isLoading) return <div style={{ color: 'var(--text-secondary)' }}>Loading admission status...</div>;
  if (isError || !applications) return <div style={{ color: 'var(--danger-text)' }}>Failed to load admission data.</div>;

  return (
    <div className="fade-in">
      <PageHeader title="Admission Status" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {applications.map((app) => (
          <Card key={app.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1.1rem' }}>{app.programName}</h3>
                <div style={{ display: 'flex', gap: 'var(--space-6)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <span><strong style={{ color: 'var(--text-primary)' }}>ID:</strong> {app.id}</span>
                  <span><strong style={{ color: 'var(--text-primary)' }}>Submitted:</strong> {new Date(app.submittedDate).toLocaleDateString()}</span>
                </div>
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