import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React from 'react';
import { useFinalizeAssessment, usePendingAssessments } from './SemesterBilling.hooks';

export const SemesterBillingPage: React.FC = () => {
    const currentTermId = "TERM-FALL-2026";
    const { data: assessments, isLoading } = usePendingAssessments(currentTermId);
    const finalizeMutation = useFinalizeAssessment();

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="Semester Billing & Assessment"
                subtitle="Review and finalize tuition assessments for enrolled students to generate invoices."
            />

            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Assessment ID</th>
                            <th>Student ID</th>
                            <th>Total Assessed</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assessments?.length ? assessments.map((assessment) => (
                            <tr key={assessment.assessmentId}>
                                <td><span style={{ fontFamily: 'monospace' }}>{assessment.assessmentId.substring(0, 8)}</span></td>
                                <td><strong>{assessment.studentId}</strong></td>
                                <td>${assessment.totalAssessed.toFixed(2)}</td>
                                <td>
                                    <Badge colorScheme={assessment.status === 'FINALIZED' ? 'success' : 'warning'}>
                                        {assessment.status}
                                    </Badge>
                                </td>
                                <td>
                                    <Button
                                        variant="primary"
                                        size="small"
                                        disabled={assessment.status === 'FINALIZED' || finalizeMutation.isPending}
                                        onClick={() => finalizeMutation.mutate(assessment.assessmentId)}
                                    >
                                        {finalizeMutation.isPending ? 'Processing...' : 'Finalize & Invoice'}
                                    </Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--text-muted)' }}>
                                    No pending assessments for this term.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};