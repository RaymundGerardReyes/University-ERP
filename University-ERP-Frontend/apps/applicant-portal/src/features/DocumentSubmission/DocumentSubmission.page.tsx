import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useDocumentUpload } from './DocumentSubmission.hooks';
import { RequiredDocument } from './DocumentSubmission.types';

export const DocumentSubmissionPage: React.FC = () => {
  const { mutateAsync: uploadDoc, isPending } = useDocumentUpload();

  // Start with empty, this should ideally be populated by a query to application status
  const [documents, setDocuments] = useState<RequiredDocument[]>([]);

  const handleSimulatedUpload = async (docId: string) => {
    try {
      await uploadDoc({ appId: 'APP-9921', data: { documentName: docId, filePath: '/mock/path.pdf' } });
      setDocuments(docs => docs.map(d => d.id === docId ? { ...d, status: 'Uploaded' } : d));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in">
      <PageHeader
        title="Document Submission"
        subtitle="Securely upload required files to complete your application portfolio."
      />

      <div className="grid-2 fade-in-delay-1">
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-accent-top" style={{ background: 'var(--brand-gradient)' }} />
          <h2 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>Upload Portal</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
            Supported formats: PDF, JPG, PNG. Maximum file size: 10MB.
          </p>

          <div style={{
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-10) var(--space-6)',
            textAlign: 'center',
            background: 'var(--bg-elevated)',
            marginBottom: 'var(--space-6)',
            cursor: 'pointer'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📄</div>
            <h3 style={{ fontSize: '1rem', color: 'var(--brand-primary)', margin: '0 0 var(--space-1) 0' }}>Click to browse</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>or drag and drop files here</p>
          </div>

          <Button variant="outline" style={{ marginTop: 'auto', width: '100%' }}>View Upload History</Button>
        </Card>

        <Card>
          <h2 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Required Portfolio</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {documents.map((doc) => {
              let badgeColor: 'success' | 'warning' | 'danger' = 'warning';
              if (doc.status === 'Uploaded') badgeColor = 'success';
              if (doc.status === 'Rejected') badgeColor = 'danger';

              return (
                <div key={doc.id} style={{ padding: 'var(--space-3)', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{doc.name}</span>
                    <Badge colorScheme={badgeColor}>{doc.status}</Badge>
                  </div>
                  <p style={{ margin: '0 0 var(--space-3) 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{doc.description}</p>

                  {doc.status !== 'Uploaded' && (
                    <Button
                      variant="secondary"
                      disabled={isPending}
                      onClick={() => handleSimulatedUpload(doc.id)}
                      style={{ fontSize: '0.75rem', padding: 'var(--space-1) var(--space-3)' }}
                    >
                      {isPending ? 'Uploading...' : 'Attach File'}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};