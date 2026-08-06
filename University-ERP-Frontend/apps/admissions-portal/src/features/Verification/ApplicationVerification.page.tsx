import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { useQuery, useMutation } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients/student-lifecycle/admissionsApi';
import React, { useState } from 'react';

export const ApplicationVerificationPage: React.FC = () => {
    const { data: applications, isLoading } = useQuery({
        queryKey: ['pendingApplications'],
        queryFn: () => admissionsApi.getPendingApplications()
    });

    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

    const verifyMutation = useMutation({
        mutationFn: () => {
            const idToSubmit = selectedAppId || applications?.[0]?.id;
            return admissionsApi.verifyDocumentsAndForward(idToSubmit!);
        },
        onSuccess: () => alert('Documents verified and application forwarded!')
    });

    const rejectMutation = useMutation({
        mutationFn: () => {
            const idToSubmit = selectedAppId || applications?.[0]?.id;
            return admissionsApi.submitAcademicEvaluation(idToSubmit!, 'Reject', 'Document Verification Failed');
        },
        onSuccess: () => alert('Application rejected due to invalid documents.')
    });

    const selectedApp = applications?.find((a: any) => a.id === selectedAppId) || applications?.[0];
    return (
        <div className="fade-in">
            <PageHeader
                title="Document Verification"
                subtitle="Review and authenticate applicant submitted documents."
            />

            <div className="grid-2">
                {/* Left Pane: Queue */}
                <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '100%', overflowY: 'auto' }}>
                    <div style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Pending Verification</div>
                    {isLoading ? <div>Loading...</div> : applications?.map((app: any, idx: number) => (
                        <div key={idx} 
                             onClick={() => setSelectedAppId(app.id)}
                             style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: app.id === selectedApp?.id ? 'var(--bg-hover)' : 'var(--bg-base)', cursor: 'pointer', borderLeft: app.id === selectedApp?.id ? '3px solid var(--brand-primary)' : '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <span style={{ fontWeight: 600 }}>{app.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(app.submittedAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{app.id}</div>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <Badge colorScheme="warning">{app.stage || 'Pending'}</Badge>
                            </div>
                        </div>
                    ))}
                </Card>

                <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="card-accent-top" style={{ background: 'var(--info-text)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h2 style={{ fontSize: '1.1rem' }}>Document Viewer</h2>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{selectedApp?.id || 'N/A'}</span>
                    </div>

                    <div style={{ flex: 1, minHeight: '300px', background: 'var(--bg-base)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                            <p>Official_Transcript_MChang.pdf</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <Button style={{ flex: 1, background: 'var(--danger-text)', color: 'white', border: 'none' }} onClick={() => rejectMutation.mutate()}>Reject</Button>
                        <Button style={{ flex: 2, background: 'var(--success-text)', color: 'white', border: 'none' }} onClick={() => verifyMutation.mutate()}>Verify & Approve</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
