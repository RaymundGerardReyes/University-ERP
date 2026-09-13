import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admissionsApi, PendingApplicationDto } from '@university-erp/api-clients';
import { Badge, Button, Card, PageHeader, DocumentPreviewModal, EmptyState } from '@university-erp/ui-kit';

export const ApplicationVerificationPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<{ name: string; url?: string } | null>(null);

    const { data: applications = [], isLoading, isError } = useQuery<PendingApplicationDto[]>({
        queryKey: ['pendingApplications'],
        queryFn: () => admissionsApi.getPendingApplications()
    });

    const verifyMutation = useMutation({
        mutationFn: (id: string) => admissionsApi.verifyDocumentsAndForward(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
            queryClient.invalidateQueries({ queryKey: ['admissions'] });
            setSelectedAppId(null);
        }
    });

    const rejectMutation = useMutation({
        mutationFn: (id: string) => admissionsApi.submitAcademicEvaluation(id, 'Reject', 'Document Verification Failed'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
            queryClient.invalidateQueries({ queryKey: ['admissions'] });
            setSelectedAppId(null);
        }
    });

    const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

    const getPreviewUrl = (filePath?: string | null, name?: string) => {
        const fileTarget = filePath || name;
        if (!fileTarget) return undefined;
        if (fileTarget.startsWith('http://') || fileTarget.startsWith('https://') || fileTarget.startsWith('/api/')) {
            return fileTarget;
        }
        return `/api/v1/admissions/documents/${encodeURIComponent(fileTarget)}`;
    };

    if (isLoading) return <div className="skeleton" style={{ height: '500px' }} />;

    if (isError) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Verification Service Unavailable</div>
                <div className="stub-subtitle">Unable to load pending applications from the backend.</div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <PageHeader
                title="Document Verification"
                subtitle="Review and authenticate applicant submitted documents."
            />

            <div className="grid-2">
                {/* Left Pane: Applications Queue */}
                <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '600px', overflowY: 'auto' }}>
                    <div style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Pending Verification ({applications.length})
                    </div>
                    {applications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            No pending applications in queue.
                        </div>
                    ) : (
                        applications.map((app) => (
                            <div
                                key={app.id}
                                onClick={() => setSelectedAppId(app.id)}
                                style={{
                                    padding: '1rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    background: app.id === selectedApp?.id ? 'var(--bg-hover)' : 'var(--bg-base)',
                                    cursor: 'pointer',
                                    borderLeft: app.id === selectedApp?.id ? '3px solid var(--brand-primary)' : '1px solid var(--border-color)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 600 }}>{app.applicantName}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {app.submittedDate ? new Date(app.submittedDate).toLocaleDateString() : '—'}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    {app.program} • <span style={{ fontFamily: 'monospace' }}>{app.id}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Badge colorScheme={app.status === 'Verified' ? 'success' : 'warning'}>
                                        {app.status || 'Under Review'}
                                    </Badge>
                                    <Badge colorScheme={app.applicationFeeStatus === 'Paid' ? 'success' : 'warning'}>
                                        Fee: {app.applicationFeeStatus || 'Pending'}
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </Card>

                {/* Right Pane: Document Viewer Workspace */}
                <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minHeight: '500px' }}>
                    <div className="card-accent-top" style={{ background: 'var(--info-text)' }} />
                    {!selectedApp ? (
                        <EmptyState
                            title="No Application Selected"
                            description="Select an applicant from the queue to inspect their submitted documents."
                        />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{selectedApp.applicantName}</h2>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedApp.program}</div>
                                </div>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{selectedApp.id}</span>
                            </div>

                            <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-secondary)' }}>Submitted Documents</h4>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                {(!selectedApp.documents || selectedApp.documents.length === 0) ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                                        No documents attached to this application.
                                    </div>
                                ) : (
                                    selectedApp.documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '0.75rem 1rem',
                                                background: 'var(--bg-base)',
                                                border: '1px solid var(--border-subtle)',
                                                borderRadius: 'var(--radius-md)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{ fontSize: '1.25rem' }}>{doc.name.endsWith('.pdf') ? '📄' : '🖼️'}</span>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{doc.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                        Status: <Badge colorScheme={doc.status === 'Verified' ? 'success' : doc.status === 'Uploaded' ? 'info' : 'warning'}>{doc.status}</Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            {doc.status !== 'Missing' && doc.status !== 'Pending' && (
                                                <Button
                                                    variant="outline"
                                                    size="small"
                                                    onClick={() => setPreviewDoc({ name: doc.name, url: getPreviewUrl(doc.filePath, doc.name) })}
                                                >
                                                    Preview
                                                </Button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                                <Button
                                    variant="danger"
                                    style={{ flex: 1 }}
                                    disabled={rejectMutation.isPending}
                                    onClick={() => rejectMutation.mutate(selectedApp.id)}
                                >
                                    {rejectMutation.isPending ? 'Rejecting...' : 'Reject Application'}
                                </Button>
                                <Button
                                    variant="success"
                                    style={{ flex: 2 }}
                                    disabled={verifyMutation.isPending}
                                    onClick={() => verifyMutation.mutate(selectedApp.id)}
                                >
                                    {verifyMutation.isPending ? 'Verifying...' : 'Verify & Approve Documents'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            <DocumentPreviewModal
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
                documentName={previewDoc?.name || ''}
                documentUrl={previewDoc?.url}
            />
        </div>
    );
};
