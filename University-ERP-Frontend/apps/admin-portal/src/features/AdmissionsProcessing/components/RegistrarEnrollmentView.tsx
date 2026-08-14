import React from 'react';
import { Badge, Button, Card, Table } from '@university-erp/ui-kit';
import { useRegistrarQueue, useActivateEnrollment } from '../AdmissionsProcessing.hooks';

export const RegistrarEnrollmentView: React.FC = () => {
    const { data: applications, isLoading, isError } = useRegistrarQueue();
    const activateMutation = useActivateEnrollment();

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;
    if (!applications || applications.length === 0) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Registry Unavailable</div>
                <div className="stub-subtitle">Failed to load the final enrollment queue.</div>
            </div>
        );
    }

    // Filter to strictly show applications endorsed by the College Dean or ready for final activation
    const queue = applications.filter(app => app.status === 'Endorsed_For_Enrollment' || app.status === 'Endorsed');

    const handleActivate = (applicationId: string, applicantName: string) => {
        if (window.confirm(`Are you ready to finalize admission and generate an official Student ID for ${applicantName}?`)) {
            activateMutation.mutate(applicationId);
        }
    };

    return (
        <div className="fade-in">
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <div>
                        <h3 style={{ margin: 0 }}>University Registry</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                            Final Enrollment & ID Generation Queue
                        </p>
                    </div>
                    <Badge colorScheme="success">{queue.length} Ready for Activation</Badge>
                </div>

                <Table>
                    <thead>
                        <tr>
                            <th>Applicant Name</th>
                            <th>Confirmed Program</th>
                            <th>College</th>
                            <th>Academic Clearance</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queue.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No applications are currently awaiting ID generation.
                                </td>
                            </tr>
                        ) : (
                            queue.map(app => (
                                <tr key={app.id}>
                                    <td>
                                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                            {app.applicantName}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            App ID: {app.id.substring(0, 8)}...
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{app.program}</td>
                                    <td>{app.department}</td>
                                    <td>
                                        <Badge colorScheme="info">Dean Endorsed</Badge>
                                    </td>
                                    <td>
                                        <Button 
                                            variant="primary" 
                                            size="small"
                                            disabled={activateMutation.isPending}
                                            onClick={() => handleActivate(app.id, app.applicantName)}
                                        >
                                            {activateMutation.isPending ? 'Generating ID...' : 'Activate Enrollment'}
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