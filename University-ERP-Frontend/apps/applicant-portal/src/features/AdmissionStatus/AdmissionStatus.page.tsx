import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmissionStatus } from './AdmissionStatus.hooks';

export const AdmissionStatusPage: React.FC = () => {
  const { data: applications, isLoading, isError } = useAdmissionStatus();

  if (isLoading) return <div className="skeleton fade-in" style={{ height: '300px' }} />;
  if (isError || !applications) return <div className="stub-page fade-in"><div className="stub-title">Failed to load admission data</div></div>;

  return (
    <div className="fade-in">
      <PageHeader title="Admission Status" subtitle="Track the real-time progress of your applications." />

      {applications.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }} className="fade-in-delay-1">
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>No Applications Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>You haven't submitted any applications yet.</p>
          <Link to="/apply" style={{ textDecoration: 'none' }}><Button variant="primary">Start New Application</Button></Link>
        </Card>
      ) : (
        <div className="grid-auto fade-in-delay-1">
          {applications.map((app) => {
            const statusColor = app.status === 'Accepted' || app.status === 'Enrolled' ? 'success' : app.status === 'Rejected' ? 'danger' : 'warning';

            return (
              <Card key={app.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-accent-top" style={{ background: `var(--${statusColor}-text)` }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                  <Badge colorScheme={statusColor}>{app.status.toUpperCase()}</Badge>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.id}</span>
                </div>

                <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: '1.25rem', color: 'var(--text-primary)' }}>{app.programName}</h3>

                <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
                  <div className="data-row">
                    <span className="data-label">Submitted On</span>
                    <span className="data-value">{new Date(app.submittedDate).toLocaleDateString()}</span>
                  </div>
                  {app.missingDocuments?.length > 0 && (
                    <div className="data-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                      <span className="data-label">Missing Items</span>
                      <span className="data-value" style={{ color: 'var(--danger-text)' }}>{app.missingDocuments.length} Documents</span>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  {app.status === 'Accepted' && <Button variant="primary" style={{ width: '100%' }}>Accept Offer & Enroll</Button>}
                  {app.missingDocuments?.length > 0 && (
                    <Link to="/documents" style={{ textDecoration: 'none' }}><Button variant="outline" style={{ width: '100%' }}>Upload Documents</Button></Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};