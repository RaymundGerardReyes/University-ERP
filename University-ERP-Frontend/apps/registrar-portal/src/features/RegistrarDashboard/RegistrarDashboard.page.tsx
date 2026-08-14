import React from 'react';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useRegistrarDashboard, useApproveClearance } from './RegistrarDashboard.hooks';

const ClearanceApproveButton = ({ studentId }: { studentId: string }) => {
    const approveClearance = useApproveClearance();

    const handleApprove = () => {
        if (window.confirm(`Approve graduation for ${studentId}?`)) {
            approveClearance.mutate(studentId);
        }
    };

    return (
        <Button 
            variant="primary" 
            size="small" 
            onClick={handleApprove}
            disabled={approveClearance.isPending}
        >
            {approveClearance.isPending ? 'Approving...' : 'Approve'}
        </Button>
    );
};

export const RegistrarDashboardPage: React.FC = () => {
    // 1. Hook up the dynamic backend data
    const { validations, clearances, isLoading, isError } = useRegistrarDashboard();

    if (isLoading) return <div className="skeleton" style={{ height: '600px' }} />;
    if (isError) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Registry Unavailable</div>
                <div className="stub-subtitle">Failed to load live registrar queues.</div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <PageHeader 
                title="Registrar Command Center" 
                subtitle="Live overview of pending enrollments and academic clearances." 
            />

            <div className="grid-2 fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <span className="stat-label">Pending Enrollments</span>
                    <span className="stat-value">{validations?.length || 0}</span>
                </Card>
                <Card className="stat-card">
                    <span className="stat-label">Pending Clearances</span>
                    <span className="stat-value" style={{ color: 'var(--warning-text)' }}>
                        {clearances?.length || 0}
                    </span>
                </Card>
            </div>

            <Card className="fade-in-delay-2">
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Enrollment Validation Queue</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Target Program</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!validations || validations.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No pending enrollments.
                                </td>
                            </tr>
                        ) : (
                            validations.map((item: any) => (
                                <tr key={item.id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{item.studentId}</td>
                                    <td style={{ fontWeight: 'bold' }}>{item.applicantName}</td>
                                    <td>{item.program}</td>
                                    <td><Badge colorScheme="warning">Awaiting Validation</Badge></td>
                                    <td>
                                        <Button variant="outline" size="small">Review</Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>

            <Card className="fade-in-delay-3" style={{ marginTop: 'var(--space-6)' }}>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Graduation Clearance Queue</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Cumulative GPA</th>
                            <th>Total Credits</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!clearances || clearances.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No pending graduation clearances.
                                </td>
                            </tr>
                        ) : (
                            clearances.map((item: any) => (
                                <tr key={item.studentId}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{item.studentId}</td>
                                    <td style={{ fontWeight: 'bold' }}>{item.gpa}</td>
                                    <td>{item.credits}</td>
                                    <td><Badge colorScheme="info">{item.status}</Badge></td>
                                    <td>
                                        <ClearanceApproveButton studentId={item.studentId} />
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
