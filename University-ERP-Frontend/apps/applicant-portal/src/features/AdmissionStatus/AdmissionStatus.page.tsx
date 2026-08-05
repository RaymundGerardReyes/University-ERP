import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useAdmissionStatus } from './AdmissionStatus.hooks';

export const AdmissionStatusPage: React.FC = () => {
  const { data: statuses, isLoading, isError } = useAdmissionStatus();

  if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;
  if (isError || !statuses) return <div className="stub-page fade-in"><div className="stub-title">Status Unavailable</div></div>;

  if (statuses.length === 0) {
    return (
      <div className="stub-page fade-in">
        <div className="stub-icon">📁</div>
        <div className="stub-title">No Applications Found</div>
        <div className="stub-subtitle">You have not submitted any applications for the upcoming term.</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <PageHeader
        title="Admission Status"
        subtitle="Review the real-time status of your university applications."
      />

      <div className="grid-auto fade-in-delay-1">
        {statuses.map((app) => {
          let statusColor: 'info' | 'warning' | 'success' | 'danger' = 'info';
          if (app.status === 'Accepted' || app.status === 'Enrolled') statusColor = 'success';
          if (app.status === 'Rejected') statusColor = 'danger';
          if (app.status === 'Under Review') statusColor = 'warning';

          return (
            <Card key={app.id}>
              <div className="card-accent-top" style={{ background: `var(--${statusColor}-text)` }} />

              <div className="data-row" style={{ borderBottom: 'none', paddingTop: 0 }}>
                <span className="data-label">Application ID: {app.id}</span>
                <Badge colorScheme={statusColor}>{app.status}</Badge>
              </div>

              <h3 className="data-value" style={{ textAlign: 'left', fontSize: '1.25rem', marginTop: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                {app.programName}
              </h3>

              <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '0 var(--space-4)', border: '1px solid var(--border-subtle)' }}>
                <div className="data-row">
                  <span className="data-label">Submission Date</span>
                  <span className="data-value">{new Date(app.submittedDate).toLocaleDateString()}</span>
                </div>

                {app.missingDocuments && app.missingDocuments.length > 0 && (
                  <div className="data-row" style={{ borderBottom: 'none', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                    <span className="data-label" style={{ color: 'var(--danger-text)' }}>Missing Documents</span>
                    <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                      {app.missingDocuments.map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};