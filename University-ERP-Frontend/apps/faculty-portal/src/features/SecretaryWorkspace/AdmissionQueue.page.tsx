import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { facultyAdmissionsApi } from '@university-erp/api-clients';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const AdmissionQueuePage: React.FC = () => {
    const queryClient = useQueryClient();

    // Fetch applicants currently in the Secretary's validation queue
    const { data: queue, isLoading } = useQuery({
        queryKey: ['secretaryQueue'],
        queryFn: () => facultyAdmissionsApi.getPendingApplications('SecretaryQueue')
    });

    const forwardMutation = useMutation({
        mutationFn: (id: string) => facultyAdmissionsApi.approveApplication(id, 'Verify'),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['secretaryQueue'] })
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="Admissions Intake Queue"
                subtitle="Validate requirements and coordinate applicant endorsements."
            />

            <div className="grid-auto fade-in-delay-1">
                {queue?.map((app) => (
                    <Card key={app.id}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                            <Badge colorScheme="warning">Pending Verification</Badge>
                            <span className="text-muted">{app.submittedDate}</span>
                        </div>

                        <h3 style={{ marginBottom: 'var(--space-4)' }}>{app.applicantName}</h3>

                        <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
                            <div className="data-row">
                                <span className="data-label">Program</span>
                                <span className="data-value">{app.program}</span>
                            </div>
                            <div className="data-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                                <span className="data-label">Documents</span>
                                <span className="data-value" style={{ color: 'var(--success-text)' }}>Complete</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <Button variant="outline" style={{ flex: 1 }}>Request Docs</Button>
                            <Button
                                variant="primary"
                                style={{ flex: 1 }}
                                onClick={() => forwardMutation.mutate(app.id)}
                                disabled={forwardMutation.isPending}
                            >
                                Endorse to Chair
                            </Button>
                        </div>
                    </Card>
                ))}

                {(!queue || queue.length === 0) && (
                    <div className="text-muted" style={{ padding: 'var(--space-4)' }}>No applications pending validation.</div>
                )}
            </div>
        </div>
    );
};