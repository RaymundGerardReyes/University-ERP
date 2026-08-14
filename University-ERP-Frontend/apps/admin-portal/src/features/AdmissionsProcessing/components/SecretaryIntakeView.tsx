import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissionsApi, PendingApplicationDto } from '@university-erp/api-clients';
import { Card, Badge, Button, Table } from '@university-erp/ui-kit';
import { useAuth } from '@university-erp/auth-sdk';

export const SecretaryIntakeView: React.FC = () => {
    const { identity } = useAuth();
    const queryClient = useQueryClient();

    // Fetch pending applications using the API client
    const { data: applications, isLoading } = useQuery<PendingApplicationDto[]>({
        queryKey: ['pendingApplications', 'SecretaryQueue'],
        queryFn: () => admissionsApi.getPendingApplications('All')
    });

    // Mutation to verify documents and forward to the Faculty
    const verifyMutation = useMutation({
        mutationFn: (applicationId: string) => admissionsApi.verifyDocumentsAndForward(applicationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
        }
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;
    if (!applications || applications.length === 0) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Inbox Zero</div>
                <div className="stub-subtitle">No new applications require verification at this time.</div>
            </div>
        );
    }

    return (
        <Card className="fade-in">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Applicant Intake Queue</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Applicant</th>
                        <th>Program</th>
                        <th>Fee Status</th>
                        <th>Docs Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((app) => {
                        const isPaid = app.applicationFeeStatus === 'Paid';
                        
                        return (
                            <tr key={app.id}>
                                <td>
                                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                        {app.applicantName}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {new Date(app.submittedDate).toLocaleDateString()}
                                    </div>
                                </td>
                                <td>{app.program}</td>
                                <td>
                                    <Badge colorScheme={isPaid ? 'success' : 'warning'}>
                                        {app.applicationFeeStatus}
                                    </Badge>
                                </td>
                                <td>
                                    <Badge colorScheme="info">{app.status}</Badge>
                                </td>
                                <td>
                                    <Button 
                                        variant="outline" 
                                        size="small"
                                        disabled={!isPaid || verifyMutation.isPending}
                                        onClick={() => verifyMutation.mutate(app.id)}
                                    >
                                        {!isPaid ? 'Awaiting Payment' : 'Verify & Forward'}
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </Card>
    );
};