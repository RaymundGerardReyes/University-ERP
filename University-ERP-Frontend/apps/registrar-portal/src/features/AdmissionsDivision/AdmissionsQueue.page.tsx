import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admissionsApi, PendingApplicationDto } from '@university-erp/api-clients';
import { Card, Table, Badge, Button, PageHeader, Modal, DocumentPreviewModal, EmptyState } from '@university-erp/ui-kit';

export const AdmissionsQueuePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedApplicant, setSelectedApplicant] = useState<PendingApplicationDto | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ name: string; url?: string } | null>(null);

  // Fetch dynamic admissions queue
  const { data: queue = [], isLoading, isError } = useQuery<PendingApplicationDto[]>({
    queryKey: ['registrar', 'admissionsQueue'],
    queryFn: () => admissionsApi.getPendingApplications(),
  });

  const endorseMutation = useMutation({
    mutationFn: (id: string) => admissionsApi.endorseApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrar', 'admissionsQueue'] });
      queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
      setSelectedApplicant(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) =>
      admissionsApi.submitAcademicEvaluation(id, 'Reject', 'Rejected by Registrar Admissions Division'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrar', 'admissionsQueue'] });
      queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
      setSelectedApplicant(null);
    },
  });

  const getPreviewUrl = (filePath?: string | null, name?: string) => {
    const fileTarget = filePath || name;
    if (!fileTarget) return undefined;
    if (fileTarget.startsWith('http://') || fileTarget.startsWith('https://') || fileTarget.startsWith('/api/')) {
      return fileTarget;
    }
    return `/api/v1/admissions/documents/${encodeURIComponent(fileTarget)}`;
  };

  return (
    <div className="fade-in">
      <PageHeader
        title="Admissions Queue"
        subtitle="Evaluate incoming applications, verify documents, and endorse to faculty."
      />

      {isLoading ? (
        <div className="skeleton" style={{ height: '500px' }} />
      ) : isError ? (
        <Card>
          <EmptyState
            title="Admissions Queue Unavailable"
            description="Unable to load pending admissions cases from the backend."
          />
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Table>
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Applicant Details</th>
                <th>Target Program</th>
                <th>Submission Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No applications pending in the admissions queue.
                  </td>
                </tr>
              ) : (
                queue.map((app) => {
                  const isPriority = (app.gpa || 0) >= 3.8;
                  return (
                    <tr key={app.id}>
                      <td style={{ fontFamily: 'monospace' }}>
                        {app.id}
                        {isPriority && (
                          <Badge colorScheme="danger" style={{ marginLeft: '8px' }}>
                            Priority
                          </Badge>
                        )}
                      </td>
                      <td>
                        <strong style={{ color: 'var(--text-bright, var(--text-primary))' }}>
                          {app.applicantName}
                        </strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          GPA: {app.gpa ? app.gpa.toFixed(2) : '—'}
                        </div>
                      </td>
                      <td>{app.program}</td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {app.submittedDate ? new Date(app.submittedDate).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <Badge colorScheme={app.status === 'Verified' ? 'success' : 'warning'}>
                          {app.status || 'Pending Review'}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="outline" size="small" onClick={() => setSelectedApplicant(app)}>
                          Review File
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Application Evaluation Modal */}
      {selectedApplicant && (
        <Modal isOpen={!!selectedApplicant} onClose={() => setSelectedApplicant(null)}>
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright, var(--text-primary))' }}>
              Applicant Review
            </h2>
            <div style={{ color: 'var(--text-secondary)' }}>
              Application: <span style={{ fontFamily: 'monospace' }}>{selectedApplicant.id}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Applicant Profile
              </div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                {selectedApplicant.applicantName}
              </div>
              <div style={{ fontSize: '0.85rem', color: selectedApplicant.status === 'Verified' ? 'var(--success-text)' : 'var(--warning-text)' }}>
                Status: {selectedApplicant.status}
              </div>
            </div>
            <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--brand-primary)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Target Program
              </div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{selectedApplicant.program}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Evaluated GPA: {selectedApplicant.gpa ? selectedApplicant.gpa.toFixed(2) : 'N/A'}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Submitted Requirements</h4>
            {(!selectedApplicant.documents || selectedApplicant.documents.length === 0) ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: '4px' }}>
                No documents uploaded yet.
              </div>
            ) : (
              selectedApplicant.documents.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-elevated, var(--bg-surface))',
                    padding: '0.75rem 1rem',
                    borderRadius: '4px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                    {doc.name.endsWith('.pdf') ? '📄' : '🖼️'} {doc.name}
                  </span>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setPreviewDoc({ name: doc.name, url: getPreviewUrl(doc.filePath, doc.name) })}
                  >
                    Preview File
                  </Button>
                </div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <Button
              variant="danger"
              disabled={rejectMutation.isPending}
              onClick={() => rejectMutation.mutate(selectedApplicant.id)}
            >
              {rejectMutation.isPending ? 'Rejecting...' : 'Reject Application'}
            </Button>
            <Button
              variant="primary"
              disabled={endorseMutation.isPending}
              onClick={() => endorseMutation.mutate(selectedApplicant.id)}
            >
              {endorseMutation.isPending ? 'Endorsing...' : 'Endorse to Faculty'}
            </Button>
          </div>
        </Modal>
      )}

      {/* Live Document Preview */}
      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        documentName={previewDoc?.name || ''}
        documentUrl={previewDoc?.url}
      />
    </div>
  );
};
