import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { facultyAdmissionsApi } from '@university-erp/api-clients';
import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const EvaluationQueuePage: React.FC = () => {
    const queryClient = useQueryClient();

    // Fetch applicants forwarded by the Secretary
    const { data: queue, isLoading } = useQuery({
        queryKey: ['chairpersonQueue'],
        queryFn: () => facultyAdmissionsApi.getPendingApplications('ChairpersonQueue')
    });

    const evaluateMutation = useMutation({
        mutationFn: ({ id, decision }: { id: string, decision: 'Accept' | 'Reject' | 'Waitlist' }) =>
            facultyAdmissionsApi.approveApplication(id, decision),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chairpersonQueue'] })
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="Academic Evaluation"
                subtitle="Review applicant merit and issue departmental recommendations."
            />

            <Card className="fade-in-delay-1">
                <div className="card-accent-top" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {queue?.map((app) => (
                        <div key={app.id} className="data-row" style={{ padding: 'var(--space-4) 0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="data-value" style={{ fontSize: '1.1rem' }}>{app.applicantName}</span>
                                <span className="data-label">{app.program} • GPA: {app.gpa} • Endorsed by Secretary</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <Button variant="outline">Review Portfolio</Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => evaluateMutation.mutate({ id: app.id, decision: 'Waitlist' })}
                                    disabled={evaluateMutation.isPending}
                                >
                                    Waitlist
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => evaluateMutation.mutate({ id: app.id, decision: 'Accept' })}
                                    disabled={evaluateMutation.isPending}
                                >
                                    Recommend Admission
                                </Button>
                            </div>
                        </div>
                    ))}

                    {(!queue || queue.length === 0) && (
                        <div className="text-muted">No pending evaluations at this time.</div>
                    )}
                </div>
            </Card>
        </div>
    );
};