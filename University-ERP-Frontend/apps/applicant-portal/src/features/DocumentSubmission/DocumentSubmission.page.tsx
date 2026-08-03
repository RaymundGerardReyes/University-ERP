import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useApplicantJourney } from '../ApplicantJourney.hooks';

export const DocumentSubmissionPage: React.FC = () => {
  const { data, isLoading } = useApplicantJourney();

  if (isLoading) return <div style={{ color: 'var(--text-secondary)' }}>Loading document requirements...</div>;
  if (!data) return null;

  return (
    <div className="fade-in">
      <PageHeader title="Required Documents" subtitle="Upload and manage your admission requirements." />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {data.documents.map(doc => {
          let badgeColor: 'success' | 'warning' | 'danger' | 'info' | 'default' = 'default';
          if (doc.status === 'Verified') badgeColor = 'success';
          if (doc.status === 'Uploaded') badgeColor = 'info';
          if (doc.status === 'Needs Resubmission' || doc.status === 'Rejected') badgeColor = 'danger';
          if (doc.status === 'Pending') badgeColor = 'warning';

          return (
            <Card key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <h4 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--text-primary)' }}>{doc.name}</h4>
                {doc.uploadedAt && <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}</p>}
                {doc.feedback && <p style={{ margin: 'var(--space-2) 0 0 0', fontSize: '0.85rem', color: 'var(--danger-text)' }}><strong>Feedback:</strong> {doc.feedback}</p>}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <Badge colorScheme={badgeColor}>{doc.status}</Badge>
                {(doc.status === 'Pending' || doc.status === 'Needs Resubmission' || doc.status === 'Rejected') && (
                  <Button variant="outline">Upload</Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
