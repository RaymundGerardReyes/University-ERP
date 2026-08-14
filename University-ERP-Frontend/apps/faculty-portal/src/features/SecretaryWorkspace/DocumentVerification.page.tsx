import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissionsApi, PendingApplicationDto } from '@university-erp/api-clients';
import { AdmissionWorkflow } from '@university-erp/workflow-sdk';
import { Badge, Button, Card, PageHeader, DocumentPreviewModal } from '@university-erp/ui-kit';
import { createLogger } from '@university-erp/core-logger';

const logger = createLogger('faculty-portal', 'DocumentVerification');

export const DocumentVerificationPage: React.FC = () => {
    const queryClient = useQueryClient();
    
    // 1. Workspace State
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<{ name: string, url?: string } | null>(null);

    // 2. Fetch the Secretary's Intake Queue
    const { data: queue = [], isLoading } = useQuery<PendingApplicationDto[]>({
        queryKey: ['admissions', 'secretaryQueue'],
        queryFn: () => admissionsApi.getApplicationsByStage('SecretaryQueue'),
        // Fallback mock data for UI development
        initialData: [
            { 
                id: 'APP-2026-901', 
                applicantName: 'James Wilson', 
                program: 'BS Architecture', 
                status: 'Pending Verification',
                documents: [
                    { id: 'DOC-1', name: 'High School Transcript.pdf', status: 'Uploaded', filePath: '/mock/transcript.pdf' },
                    { id: 'DOC-2', name: 'Birth Certificate.png', status: 'Uploaded', filePath: '/mock/birth_cert.png' }
                ]
            },
            { 
                id: 'APP-2026-902', 
                applicantName: 'Maria Garcia', 
                program: 'BS Computer Science', 
                status: 'Pending Verification',
                documents: [
                    { id: 'DOC-3', name: 'High School Transcript.pdf', status: 'Uploaded', filePath: '/mock/transcript2.pdf' },
                    { id: 'DOC-4', name: 'Recommendation Letter.pdf', status: 'Missing', filePath: null }
                ]
            }
        ] as any
    });

    // 3. Workflow Mutation (Advances to Interview or Chairperson)
    const verifyMutation = useMutation({
        mutationFn: (id: string) => AdmissionWorkflow.advance(id, 'DocumentVerification'),
        onSuccess: (_, id) => {
            logger.info(`Successfully verified documents for ${id}`);
            queryClient.invalidateQueries({ queryKey: ['admissions', 'secretaryQueue'] });
            setSelectedAppId(null); // Clear selection on success
        },
        onError: (err) => {
            logger.error('Failed to verify documents', err);
            alert('An error occurred while forwarding the application.');
        }
    });

    const selectedApp = queue.find(app => app.id === selectedAppId);

    if (isLoading) return <div className="skeleton" style={{ height: '600px' }} />;

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <PageHeader 
                title="Document Verification" 
                subtitle="Review and validate submitted applicant requirements." 
            />

            {/* MASTER-DETAIL LAYOUT */}
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
                
                {/* LEFT PANE: Applicant Queue */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Pending Review</h3>
                    {queue.map((app) => (
                        <Card 
                            key={app.id} 
                            onClick={() => setSelectedAppId(app.id)}
                            style={{ 
                                cursor: 'pointer',
                                borderColor: selectedAppId === app.id ? 'var(--brand-primary)' : 'var(--border-color)',
                                background: selectedAppId === app.id ? 'var(--bg-active)' : 'var(--bg-surface)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{app.applicantName}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                                {app.program}
                            </div>
                            <Badge colorScheme="warning" style={{ fontSize: '0.65rem' }}>
                                {app.documents?.length || 0} Documents
                            </Badge>
                        </Card>
                    ))}
                    {queue.length === 0 && (
                        <div className="text-muted" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                            No applications pending verification.
                        </div>
                    )}
                </div>

                {/* RIGHT PANE: Document Review Workspace */}
                <Card style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                    {!selectedApp ? (
                        <div className="stub-page">
                            <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: 'var(--space-4)' }}>📋</div>
                            <div className="stub-title">Select an Applicant</div>
                            <div className="stub-subtitle">Choose an application from the queue to review their submitted documents.</div>
                        </div>
                    ) : (
                        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {/* Header */}
                            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-bright)' }}>
                                        {selectedApp.applicantName}
                                    </h2>
                                    <div style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{selectedApp.program}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 'var(--space-1)', fontFamily: 'monospace' }}>{selectedApp.id}</div>
                                </div>
                                <Button 
                                    variant="success" 
                                    onClick={() => verifyMutation.mutate(selectedApp.id)}
                                    disabled={verifyMutation.isPending}
                                >
                                    {verifyMutation.isPending ? 'Processing...' : 'Verify & Forward'}
                                </Button>
                            </div>

                            {/* Document Checklist */}
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Submitted Requirements</h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {selectedApp.documents?.map((doc: any) => (
                                    <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                            <div style={{ fontSize: '1.5rem' }}>
                                                {doc.name.endsWith('.pdf') ? '📄' : '🖼️'}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{doc.name}</span>
                                                <span style={{ fontSize: '0.8rem', color: doc.status === 'Missing' ? 'var(--danger-text)' : 'var(--success-text)' }}>
                                                    {doc.status}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {doc.status !== 'Missing' && (
                                            <Button 
                                                variant="outline" 
                                                size="small" 
                                                onClick={() => setPreviewDoc({ name: doc.name, url: doc.filePath })}
                                            >
                                                Preview
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Document Preview Modal */}
            <DocumentPreviewModal 
                isOpen={!!previewDoc} 
                onClose={() => setPreviewDoc(null)} 
                documentName={previewDoc?.name || ''} 
                documentUrl={previewDoc?.url} 
            />
        </div>
    );
};
