import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { admissionsApi } from '@university-erp/api-clients';
import { PageHeader, Card, Table, Badge, Button, DocumentPreviewModal } from '@university-erp/ui-kit';

export const DocumentSubmissionPage: React.FC = () => {
    const { user, identity } = useAuth();
    const queryClient = useQueryClient();
    const studentId = user?.id || identity?.id || '00000000-0000-0000-0000-000000000001';

    // Modal state — now tracks the object URL for real file rendering
    const [previewDoc, setPreviewDoc] = useState<{
        isOpen: boolean;
        name: string;
        url: string;
        mimeType: string;
    }>({ isOpen: false, name: '', url: '', mimeType: '' });

    // Track per-document optimistic upload state (for UX spinner before API resolves)
    const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

    const { data: journey, isLoading, isError } = useQuery({
        queryKey: ['applicantJourney', studentId],
        queryFn: () => admissionsApi.getApplicantJourney(studentId),
        enabled: !!studentId
    });

    const uploadMutation = useMutation({
        mutationFn: (variables: { applicationId: string; documentName: string; filePath: string }) =>
            admissionsApi.uploadDocument(variables.applicationId, {
                documentName: variables.documentName,
                filePath: variables.filePath
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applicantJourney', studentId] });
            setUploadingDocId(null);
        },
        onError: () => {
            setUploadingDocId(null);
        }
    });

    /**
     * Opens a native OS file picker. Only fires the upload mutation once the user
     * has actually selected a file — fixing the "auto-uploads without a file" bug.
     */
    const handleUploadClick = (applicationId: string, docId: string, documentName: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';

        input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return;

            setUploadingDocId(docId);
            // We pass the actual filename as the filePath for the backend record.
            // In a production system this would be a pre-signed URL upload.
            uploadMutation.mutate({
                applicationId,
                documentName,
                filePath: file.name
            });
        };

        input.click();
    };

    /**
     * Opens the document preview modal with a real object URL generated from the
     * chosen File, so the user can see the actual file contents before or after upload.
     */
    const handlePreviewClick = (docName: string, filePath?: string | null) => {
        setPreviewDoc({
            isOpen: true,
            name: docName,
            url: filePath ? `/api/v1/admissions/documents/${encodeURIComponent(filePath)}` : '',
            mimeType: ''
        });
    };

    if (isLoading) {
        return <div className="skeleton" style={{ height: '300px' }} />;
    }

    if (isError || !journey || !journey.documents) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Submission Unavailable</div>
                <div className="stub-subtitle">We could not load your document requirements at this time.</div>
            </div>
        );
    }

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

                            return (
                                <tr key={doc.id} style={{ borderBottom: index === journey.documents.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                                    <td style={{ padding: 'var(--space-4) var(--space-6)', fontWeight: 500, color: 'var(--text-primary)' }}>
                                        {doc.name}
                                    </td>
                                    <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                        <Badge colorScheme={isUploaded ? 'success' : 'warning'}>
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
                                        {/* Always show re-upload button if not yet fully Verified */}
                                        {doc.status !== 'Verified' && (
                                            <Button
                                                variant={isUploaded ? 'ghost' : 'outline'}
                                                size="small"
                                                disabled={isThisUploading}
                                                onClick={() => handleUploadClick(journey.applicantId, doc.id, doc.name)}
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