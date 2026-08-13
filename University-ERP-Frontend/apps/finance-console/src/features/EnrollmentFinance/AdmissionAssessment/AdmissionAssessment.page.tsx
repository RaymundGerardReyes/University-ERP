import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '@university-erp/api-clients';
import { Badge, Button, Card, Modal, PageHeader, Table } from '@university-erp/ui-kit';
import React, { useState } from 'react';

// Represents the Finance module's localized Read Model for incoming students
interface PendingAssessmentDto {
    studentId: string; // The ID passed over from the ApplicantAcceptedIntegrationEvent
    applicantName: string;
    programCode: string;
    academicYear: string;
    status: 'AssessmentPending';
    dateAccepted: string;
}

export const AdmissionAssessmentPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedApplicant, setSelectedApplicant] = useState<PendingAssessmentDto | null>(null);

    // Assessment Form State
    const [totalTuition, setTotalTuition] = useState<number | ''>('');
    const [downpaymentAmount, setDownpaymentAmount] = useState<number | ''>('');
    const [formError, setFormError] = useState<string | null>(null);

    // 1. Fetch pending assessments (Mocking the Finance Read Model endpoint)
    const { data: pendingAssessments, isLoading, isError } = useQuery({
        queryKey: ['pendingAssessments'],
        queryFn: async (): Promise<PendingAssessmentDto[]> => {
            // In a fully wired backend, this would be a real fetch to a Finance Read Model endpoint.
            // Simulating network delay and returning mock data representing the intercepted events.
            return new Promise((resolve) => setTimeout(() => resolve([
                {
                    studentId: 'APP-2026-001',
                    applicantName: 'Sarah Jenkins',
                    programCode: 'BSCS',
                    academicYear: '2026-2027',
                    status: 'AssessmentPending',
                    dateAccepted: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    studentId: 'APP-2026-042',
                    applicantName: 'David Miller',
                    programCode: 'BBA',
                    academicYear: '2026-2027',
                    status: 'AssessmentPending',
                    dateAccepted: new Date(Date.now() - 43200000).toISOString()
                }
            ]), 500));
        }
    });

    // 2. Mutation to issue the invoice using the shared Finance API
    const assessMutation = useMutation({
        mutationFn: async (payload: { studentId: string, tuition: number, downpayment: number }) => {
            // Hitting the real financeApi to generate the downpayment invoice
            return await financeApi.issueInvoice({
                studentId: payload.studentId,
                amount: payload.downpayment,
                description: `Enrollment Downpayment - ${payload.tuition} Total Tuition Assessed`
            });
        },
        onSuccess: () => {
            // Clear the cache to remove the processed applicant from the list
            queryClient.invalidateQueries({ queryKey: ['pendingAssessments'] });
            handleCloseModal();
        },
        onError: (error) => {
            console.error("Failed to issue invoice", error);
            setFormError("Failed to issue the invoice. Please verify the backend connection.");
        }
    });

    const handleOpenModal = (applicant: PendingAssessmentDto) => {
        setSelectedApplicant(applicant);
        setTotalTuition('');
        setDownpaymentAmount('');
        setFormError(null);
    };

    const handleCloseModal = () => {
        setSelectedApplicant(null);
        setTotalTuition('');
        setDownpaymentAmount('');
        setFormError(null);
    };

    const handleSubmitAssessment = () => {
        setFormError(null);

        const tuition = Number(totalTuition);
        const downpayment = Number(downpaymentAmount);

        if (!tuition || tuition <= 0) {
            setFormError("Total tuition must be greater than zero.");
            return;
        }
        if (!downpayment || downpayment <= 0 || downpayment > tuition) {
            setFormError("Downpayment must be greater than zero and cannot exceed total tuition.");
            return;
        }

        assessMutation.mutate({
            studentId: selectedApplicant!.studentId,
            tuition,
            downpayment
        });
    };

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    if (isError) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Finance System Error</div>
                <div className="stub-subtitle">Unable to retrieve pending assessments. The event stream may be delayed.</div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <PageHeader
                title="Tuition Assessment"
                subtitle="Evaluate accepted applicants and issue their required enrollment downpayment."
            />

            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Applicant Reference</th>
                            <th>Name</th>
                            <th>Program</th>
                            <th>Academic Year</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingAssessments?.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                                    No pending assessments in the queue.
                                </td>
                            </tr>
                        ) : (
                            pendingAssessments?.map(assessment => (
                                <tr key={assessment.studentId}>
                                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem' }}>
                                        {assessment.studentId}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{assessment.applicantName}</td>
                                    <td>{assessment.programCode}</td>
                                    <td>{assessment.academicYear}</td>
                                    <td>
                                        <Badge colorScheme="warning">Pending Assessment</Badge>
                                    </td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            size="small"
                                            onClick={() => handleOpenModal(assessment)}
                                        >
                                            Assess Tuition
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>

            {/* Tuition Assessment Modal */}
            <Modal isOpen={!!selectedApplicant} onClose={handleCloseModal}>
                <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                    Assess Tuition & Generate Invoice
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: '0.9rem' }}>
                    Applicant: <strong style={{ color: 'var(--text-primary)' }}>{selectedApplicant?.applicantName}</strong> ({selectedApplicant?.programCode})
                </p>

                {formError && (
                    <div style={{ padding: 'var(--space-3)', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)' }}>
                        {formError}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                            Total Assessed Tuition ($)
                        </label>
                        <input
                            type="number"
                            value={totalTuition}
                            onChange={(e) => setTotalTuition(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="e.g. 5000"
                            style={{
                                width: '100%',
                                padding: 'var(--space-3)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-base)',
                                color: 'var(--text-primary)',
                                fontFamily: "'JetBrains Mono', monospace"
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                            Required Downpayment Amount ($)
                        </label>
                        <input
                            type="number"
                            value={downpaymentAmount}
                            onChange={(e) => setDownpaymentAmount(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="e.g. 500"
                            style={{
                                width: '100%',
                                padding: 'var(--space-3)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-base)',
                                color: 'var(--text-primary)',
                                fontFamily: "'JetBrains Mono', monospace"
                            }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            This will issue an invoice to the applicant's portal to unlock enrollment.
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                    <Button
                        variant="outline"
                        onClick={handleCloseModal}
                        disabled={assessMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleSubmitAssessment}
                        disabled={assessMutation.isPending}
                    >
                        {assessMutation.isPending ? 'Issuing Invoice...' : 'Issue Downpayment Invoice'}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};