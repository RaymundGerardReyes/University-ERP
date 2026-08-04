import { Badge, Card, PageHeader, Button } from '@university-erp/ui-kit';
import React from 'react';
import { useAdmissionStatus } from './AdmissionStatus.hooks';
import { Link } from 'react-router-dom';

export const AdmissionStatusPage: React.FC = () => {
  const { data: applications, isLoading, isError } = useAdmissionStatus();

  if (isLoading) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ height: '80px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', animation: 'pulse 2s infinite' }} />
        <div style={{ height: '150px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', animation: 'pulse 2s infinite' }} />
      </div>
    );
  }
  
  if (isError || !applications) {
    return (
      <div className="fade-in">
        <PageHeader title="Admission Status" />
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>⚠️</div>
          <h3 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--danger-text)' }}>Failed to load admission data</h3>
          <p style={{ color: 'var(--text-secondary)' }}>We couldn't retrieve your applications at this time. Please try again later.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <PageHeader 
        title="Admission Status" 
        subtitle="Track the real-time progress of your university applications."
      />

      {applications.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎓</div>
          <h3 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-primary)' }}>No Applications Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>You haven't submitted any applications yet.</p>
          <Link to="/apply" style={{ textDecoration: 'none' }}>
            <Button variant="primary">Start New Application</Button>
          </Link>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {applications.map((app) => {
            let statusColor: 'success' | 'warning' | 'info' | 'danger' = 'warning';
            let statusIcon = '⏳';
            let statusDescription = 'Your application is currently under review by our admissions committee.';
            
            if (app.status === 'Accepted' || app.status === 'Enrolled') {
              statusColor = 'success';
              statusIcon = '🎉';
              statusDescription = 'Congratulations! You have been accepted to this program.';
            } else if (app.status === 'Rejected') {
              statusColor = 'danger';
              statusIcon = '❌';
              statusDescription = 'Unfortunately, we are unable to offer you admission at this time.';
            } else if (app.missingDocuments && app.missingDocuments.length > 0) {
              statusColor = 'info';
              statusIcon = '📝';
              statusDescription = 'Please submit all required documents to proceed with your application.';
            }

            return (
              <Card key={app.id} style={{ 
                position: 'relative', 
                overflow: 'hidden',
                borderTop: `4px solid var(--${statusColor}-border, var(--brand-primary))`
              }} className="hover-lift">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                  <div>
                    <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1.25rem', color: 'var(--text-primary)' }}>{app.programName}</h3>
                    <div style={{ display: 'flex', gap: 'var(--space-6)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <span><strong style={{ color: 'var(--text-primary)' }}>Application ID:</strong> {app.id}</span>
                      <span><strong style={{ color: 'var(--text-primary)' }}>Submitted:</strong> {new Date(app.submittedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <Badge colorScheme={statusColor} style={{ fontSize: '0.9rem', padding: 'var(--space-1) var(--space-3)' }}>
                    {statusIcon} {app.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div style={{ padding: 'var(--space-3)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.5rem' }}>ℹ️</div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{statusDescription}</p>
                </div>

                {(app.status === 'Accepted' || (app.missingDocuments && app.missingDocuments.length > 0)) && (
                  <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                    {app.status === 'Accepted' && (
                      <Button variant="primary">Accept Offer & Enroll</Button>
                    )}
                    {(app.missingDocuments && app.missingDocuments.length > 0) && (
                      <Link to="/documents" style={{ textDecoration: 'none' }}>
                        <Button variant="primary">Upload Documents</Button>
                      </Link>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};