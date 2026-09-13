import React, { useState } from 'react';
import { useAuth } from '@university-erp/auth-sdk';
import { PageHeader, Card, Table, Badge, Button, DocumentPreviewModal, EmptyState } from '@university-erp/ui-kit';
import { useApplicantDocuments, useUploadDocument } from './DocumentSubmission.hooks';
import { DocumentPreviewState } from './DocumentSubmission.types';

export const DocumentSubmissionPage: React.FC = () => {
  const { user, identity } = useAuth();
  const studentId = user?.id || identity?.id || 'usr-default';

  const [previewDoc, setPreviewDoc] = useState<DocumentPreviewState>({
    isOpen: false,
    name: '',
    url: '',
    mimeType: '',
  });

  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

  const { data: journey, isLoading, isError } = useApplicantDocuments(studentId);
  const uploadMutation = useUploadDocument(studentId);

  /**
   * Opens native OS file picker and initiates mutation upon file selection.
   */
  const handleUploadClick = (applicationId: string, docId: string, documentName: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      setUploadingDocId(docId);
      uploadMutation.mutate(
        {
          applicationId,
          documentName,
          filePath: file.name,
        },
        {
          onSettled: () => setUploadingDocId(null),
        }
      );
    };

    input.click();
  };

  /**
   * Opens the document preview modal pointing to the backend documents streaming endpoint.
   */
  const handlePreviewClick = (docName: string, filePath?: string | null) => {
    const targetFile = filePath || docName;
    setPreviewDoc({
      isOpen: true,
      name: docName,
      url: targetFile ? `/api/v1/admissions/documents/${encodeURIComponent(targetFile)}` : '',
      mimeType: targetFile?.endsWith('.pdf') ? 'application/pdf' : 'image/png',
    });
  };

  if (isLoading) {
    return <div className="skeleton" style={{ height: '300px' }} />;
  }

  if (!studentId) {
    return (
      <div className="fade-in">
        <PageHeader
          title="Document Submission"
          subtitle="Upload your required portfolio and academic documents."
        />
        <Card>
          <EmptyState
            title="Authentication Required"
            description="Please log in to view and manage your document submissions."
          />
        </Card>
      </div>
    );
  }

  if (isError || !journey || !journey.documents) {
    return (
      <div className="stub-page fade-in">
        <div className="stub-title">Submission Unavailable</div>
        <div className="stub-subtitle">We could not load your document requirements at this time.</div>
      </div>
    );
  }

  const getStatusColor = (status: string): 'success' | 'warning' | 'info' | 'danger' => {
    switch (status) {
      case 'Verified':
        return 'success';
      case 'Uploaded':
      case 'Under Review':
        return 'info';
      case 'Rejected':
        return 'danger';
      case 'Pending':
      default:
        return 'warning';
    }
  };

  return (
    <div className="fade-in">
      <PageHeader
        title="Document Submission"
        subtitle="Upload your required portfolio and academic documents."
      />

      <Card className="fade-in-delay-1" style={{ padding: '0' }}>
        <Table>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--text-primary)', fontWeight: 600 }}>Document Name</th>
              <th style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--text-primary)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--text-primary)', fontWeight: 600 }}>Upload Date</th>
              <th style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--text-primary)', fontWeight: 600 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {journey.documents.map((doc, index) => {
              const isUploaded = doc.status === 'Uploaded' || doc.status === 'Verified';
              const isThisUploading = uploadingDocId === doc.id;
              const statusColor = getStatusColor(doc.status);

              const targetAppId = journey.applicationId || journey.applicantId;

              return (
                <tr key={doc.id} style={{ borderBottom: index === journey.documents.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--text-primary)' }}>
                    <div style={{ fontWeight: 600 }}>{doc.name}</div>
                    {doc.filePath && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.85rem' }}>📄</span>
                        <span style={{ fontFamily: 'monospace', color: 'var(--text-muted, #94a3b8)' }}>{doc.filePath}</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                    <Badge colorScheme={statusColor}>
                      {isThisUploading ? 'Uploading…' : doc.status}
                    </Badge>
                  </td>
                  <td style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--text-secondary)' }}>
                    {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', gap: 'var(--space-2)' }}>
                    {isUploaded && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handlePreviewClick(doc.name, doc.filePath)}
                      >
                        View
                      </Button>
                    )}
                    {doc.status !== 'Verified' && (
                      <Button
                        variant={isUploaded ? 'ghost' : 'outline'}
                        size="small"
                        disabled={isThisUploading || uploadMutation.isPending}
                        onClick={() => handleUploadClick(targetAppId, doc.id, doc.name)}
                      >
                        {isThisUploading ? 'Uploading…' : isUploaded ? 'Replace' : 'Upload File'}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>

      <DocumentPreviewModal
        isOpen={previewDoc.isOpen}
        documentName={previewDoc.name}
        documentUrl={previewDoc.url}
        mimeType={previewDoc.mimeType}
        onClose={() => setPreviewDoc({ isOpen: false, name: '', url: '', mimeType: '' })}
      />
    </div>
  );
};