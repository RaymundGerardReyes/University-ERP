import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';
import { Badge, Button, Card } from '@university-erp/ui-kit';
import React from 'react';

export const ChairpersonEvaluationView: React.FC = () => {
    const queryClient = useQueryClient();
    const { data: queue, isLoading } = useQuery({
        queryKey: ['admissionsQueue', 'ChairpersonQueue'],
        queryFn: () => admissionsApi.getApplicationsByStage('ChairpersonQueue')
    });

    const evaluateMutation = useMutation({
        mutationFn: ({ id, decision }: { id: string, decision: 'Accept' | 'Waitlist' | 'Reject' }) =>
            admissionsApi.submitAcademicEvaluation(id, decision, 'Approved for major.'),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admissionsQueue'] })
    });

    if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;

    return (
        <div className="fade-in-delay-1">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Academic Evaluation Queue</h3>
            <Card>
                <div className="card-accent-top" />
                {queue?.map((app: any) => (
                    <div key={app.id} className="data-row" style={{ padding: 'var(--space-4) 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="data-value" style={{ fontSize: '1.1rem' }}>{app.applicantName}</span>
                            <span className="data-label">{app.program} • GPA: {app.gpa} • Portfolio: Exceptional</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <Badge colorScheme="info">Secretary Endorsed</Badge>
                            <Button variant="secondary" onClick={() => evaluateMutation.mutate({ id: app.id, decision: 'Waitlist' })}>
                                Waitlist
                            </Button>
                            <Button variant="primary" onClick={() => evaluateMutation.mutate({ id: app.id, decision: 'Accept' })}>
                                Accept Applicant
                            </Button>
                        </div>
                    </div>
                ))}
            </Card>
        </div>
    );
};