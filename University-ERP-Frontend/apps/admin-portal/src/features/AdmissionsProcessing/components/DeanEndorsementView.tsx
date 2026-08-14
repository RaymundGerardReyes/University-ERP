import React from 'react';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, Table } from '@university-erp/ui-kit';
import { useDeanQueue, useEndorseApplication } from '../AdmissionsProcessing.hooks';

export const DeanEndorsementView: React.FC = () => {
    const { identity } = useAuth();
    
    // In a production environment, this is derived from the Dean's Identity claims
    const college = "College of Computer Studies"; 
    
    const { data: applications, isLoading, isError } = useDeanQueue(college);
    const endorseMutation = useEndorseApplication();

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;
    if (isError || !applications) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Queue Unavailable</div>
                <div className="stub-subtitle">Failed to load the endorsement queue.</div>
            </div>
        );
    }

    // Filter to show applications that have been recommended by the Chairperson
    const queue = applications.filter(app => app.status === 'Recommended');

    const handleEndorse = (applicationId: string, applicantName: string) => {
        if (window.confirm(`Are you sure you want to officially endorse ${applicantName} for enrollment?`)) {
            endorseMutation.mutate(applicationId);
        }
    };

    return (
        <div className="fade-in">
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <div>
                        <h3 style={{ margin: 0 }}>{college}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                            Dean's Final Endorsement Queue
                        </p>
                    </div>
                    <Badge colorScheme="info">{queue.length} Awaiting Endorsement</Badge>
                </div>

                <Table>
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>Target Program</th>
                            <th>GPA</th>
                            <th>Chairperson Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queue.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No applications currently require your endorsement.
                                </td>
                            </tr>
                        ) : (
                            queue.map(app => (
                                <tr key={app.id}>
                                    <td>
                                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                            {app.applicantName}
                                        </div>
                                    </td>
                                    <td>{app.program}</td>
                                    <td style={{ color: 'var(--success-text)', fontWeight: 600 }}>
                                        {app.gpa ? app.gpa.toFixed(2) : '3.50'}
                                    </td>
                                    <td><Badge colorScheme="success">Recommended</Badge></td>
                                    <td>
                                        <Button 
                                            variant="primary" 
                                            size="small"
                                            disabled={endorseMutation.isPending}
                                            onClick={() => handleEndorse(app.id, app.applicantName)}
                                        >
                                            {endorseMutation.isPending ? 'Processing...' : 'Endorse for Enrollment'}
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
