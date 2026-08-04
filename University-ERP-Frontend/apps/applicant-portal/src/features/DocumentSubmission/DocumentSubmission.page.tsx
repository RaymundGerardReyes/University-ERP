import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useApplicantJourney } from '../ApplicantJourney.hooks';

export const DocumentSubmissionPage: React.FC = () => {
  const { data, isLoading } = useApplicantJourney();
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ height: '80px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', animation: 'pulse 2s infinite' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ height: '100px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', animation: 'pulse 2s infinite' }} />
          <div style={{ height: '100px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', animation: 'pulse 2s infinite' }} />
        </div>
      </div>
    );
  }
  
  if (!data) return null;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <PageHeader 
        title="Required Documents" 
        subtitle="Upload and manage your admission requirements. Ensure files are clear and legible." 
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-4)' }}>
        {data.documents.map(doc => {
          let badgeColor: 'success' | 'warning' | 'danger' | 'info' | 'default' = 'default';
          let borderColor = 'var(--border-subtle)';
          let bgColor = 'rgba(255, 255, 255, 0.02)';
          let icon = '📄';

          if (doc.status === 'Verified') {
            badgeColor = 'success';
            borderColor = 'rgba(16, 185, 129, 0.3)';
            bgColor = 'rgba(16, 185, 129, 0.05)';
            icon = '✅';
          } else if (doc.status === 'Uploaded') {
            badgeColor = 'info';
            borderColor = 'rgba(14, 165, 233, 0.3)';
            bgColor = 'rgba(14, 165, 233, 0.05)';
            icon = '⏳';
          } else if (doc.status === 'Needs Resubmission' || doc.status === 'Rejected') {
            badgeColor = 'danger';
            borderColor = 'rgba(239, 68, 68, 0.5)';
            bgColor = 'rgba(239, 68, 68, 0.05)';
            icon = '⚠️';
          } else if (doc.status === 'Pending') {
            badgeColor = 'warning';
            borderColor = 'rgba(245, 158, 11, 0.3)';
            icon = '📤';
          }

          const isHovered = hoveredDoc === doc.id;
          const isUploadable = doc.status === 'Pending' || doc.status === 'Needs Resubmission' || doc.status === 'Rejected';

          return (
            <Card 
              key={doc.id} 
              onMouseEnter={() => setHoveredDoc(doc.id)}
              onMouseLeave={() => setHoveredDoc(null)}
              style={{ 
                display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', 
                border: `1px solid ${isHovered && isUploadable ? 'var(--brand-primary)' : borderColor}`,
                backgroundColor: bgColor,
                transition: 'all 0.2s ease',
                cursor: isUploadable ? 'pointer' : 'default',
                position: 'relative', overflow: 'hidden'
              }}
              className={isUploadable ? 'hover-lift' : ''}
            >
              {isHovered && isUploadable && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(59, 130, 246, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
                  <div style={{ border: '2px dashed var(--brand-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)', textAlign: 'center', width: '90%', height: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>☁️</div>
                    <div style={{ color: 'white', fontWeight: 600 }}>Click to browse or drag file here</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 'var(--space-1)' }}>PDF, JPG, or PNG (Max 5MB)</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <div style={{ fontSize: '2rem', opacity: 0.8 }}>{icon}</div>
                  <div>
                    <h4 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{doc.name}</h4>
                    {doc.uploadedAt ? (
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                    ) : (
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Not yet uploaded</p>
                    )}
                  </div>
                </div>
                <Badge colorScheme={badgeColor}>{doc.status}</Badge>
              </div>
              
              {doc.feedback && (
                <div style={{ 
                  marginTop: 'var(--space-2)', padding: 'var(--space-3)', 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger-border)',
                  borderRadius: '4px', position: 'relative', zIndex: 1
                }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--danger-text)' }}>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>Reviewer Feedback:</strong> 
                    {doc.feedback}
                  </p>
                </div>
              )}
              
              {isUploadable && !isHovered && (
                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px dashed var(--border-subtle)', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
                  <Button variant="outline" style={{ width: '100%', borderStyle: 'dashed' }}>
                    Select File
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6)', background: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(59, 130, 246, 0.2)', textAlign: 'center' }}>
        <h4 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--brand-primary)' }}>Need help with your documents?</h4>
        <p style={{ margin: '0 0 var(--space-4) 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Contact our admissions office if you're having trouble uploading or obtaining required documents.
        </p>
        <Button variant="outline">Contact Support</Button>
      </div>
    </div>
  );
};
