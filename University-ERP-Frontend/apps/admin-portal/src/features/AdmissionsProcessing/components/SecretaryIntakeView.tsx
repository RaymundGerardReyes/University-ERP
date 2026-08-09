import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge, Button, Card } from '@university-erp/ui-kit';
import axios from 'axios'; // 1. Import Axios
import React from 'react';

export const SecretaryIntakeView: React.FC = () => {
    const queryClient = useQueryClient();

    // 2. Update the query to hit your actual backend endpoint
    const { data: queue, isLoading } = useQuery({
        queryKey: ['admissionsQueue', 'SecretaryQueue'],
        queryFn: async () => {
            // Hit the GetPendingApplications endpoint
            const response = await axios.get('/api/v1/admissions/faculty/pending');
            // Filter down to only applications that need verification
            return response.data.filter((app: any) => app.status === 'Submitted');
        }
    });

    const forwardMutation = useMutation({
        // 3. Ensure the mutation hits your live endpoint
        mutationFn: async (id: string) => {
            const response = await axios.post(`/api/v1/admissions/${id}/verify-and-forward`);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admissionsQueue'] })
    });

    if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;

    return (
        <div className="fade-in-delay-1">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Intake & Document Verification Queue</h3>

            {(!queue || queue.length === 0) && (
                <div className="text-muted">No applications pending verification in the database.</div>
            )}

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
                                {forwardMutation.isPending ? 'Processing...' : 'Forward to Chair'}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};