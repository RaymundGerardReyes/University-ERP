import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';
import { Badge, Button, Card } from '@university-erp/ui-kit';
import React from 'react';

export const RegistrarEnrollmentView: React.FC = () => {
    const queryClient = useQueryClient();
    const { data: queue, isLoading } = useQuery({
        queryKey: ['admissionsQueue', 'RegistrarQueue'],
        queryFn: () => admissionsApi.getApplicationsByStage('RegistrarQueue')
    });

    const enrollMutation = useMutation({
        mutationFn: (id: string) => admissionsApi.generateStudentIdentityAndEnroll(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admissionsQueue'] })
    });

    if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;

    return (
        <div className="fade-in-delay-1">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Enrollment & Identity Generation Queue</h3>
            <Card>
                <div className="card-accent-top" />
                <p className="text-muted" style={{ marginBottom: 'var(--space-4)' }}>
                    These applicants have been accepted by the Department Chairperson. Generate their official university identities to finalize enrollment.
                </p>
                {queue?.map((app: any) => (
                    <div key={app.id} className="data-row" style={{ padding: 'var(--space-4) 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="data-value" style={{ fontSize: '1.1rem' }}>{app.applicantName}</span>
                            <span className="data-label">{app.program} • Accepted by Chairperson</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <Badge colorScheme="success">Ready for Enrollment</Badge>
                            <Button
                                variant="primary"
                                onClick={() => enrollMutation.mutate(app.id)}
                                disabled={enrollMutation.isPending}
                            >
                                Generate ID & Enroll
                            </Button>
                        </div>
                    </div>
                ))}
            </Card>
        </div>
    );
};