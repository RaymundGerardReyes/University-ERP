import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';
import { Badge, Button, Card } from '@university-erp/ui-kit';
import React from 'react';

export const SecretaryIntakeView: React.FC = () => {
    const queryClient = useQueryClient();
    const { data: queue, isLoading } = useQuery({
        queryKey: ['admissionsQueue', 'SecretaryQueue'],
        queryFn: () => admissionsApi.getApplicationsByStage('SecretaryQueue')
    });

    const forwardMutation = useMutation({
        mutationFn: (id: string) => admissionsApi.verifyDocumentsAndForward(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admissionsQueue'] })
    });

    if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;

    return (
        <div className="fade-in-delay-1">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Intake & Document Verification Queue</h3>
            <div className="grid-auto">
                {queue?.map((app: any) => (
                    <Card key={app.id}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                            <Badge colorScheme="warning">Pending Verification</Badge>
                            <span className="text-muted">{app.submittedDate}</span>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-2)' }}>{app.applicantName}</h3>
                        <div className="data-row" style={{ borderBottom: 'none' }}>
                            <span className="data-label">Program</span>
                            <span className="data-value">{app.program}</span>
                        </div>
                        <div className="data-row" style={{ borderBottom: 'none' }}>
                            <span className="data-label">Documents</span>
                            <span className="data-value" style={{ color: 'var(--success-text)' }}>All Uploaded</span>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                            <Button variant="outline" style={{ flex: 1 }}>Request Docs</Button>
                            <Button
                                variant="primary"
                                style={{ flex: 1 }}
                                onClick={() => forwardMutation.mutate(app.id)}
                                disabled={forwardMutation.isPending}
                            >
                                Forward to Chair
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};