import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admissionsApi, financeApi } from '@university-erp/api-clients';
import { Badge, Button, Card, FormInput, Modal, PageHeader, Table } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { toSafeArray } from '../../../utils/arrayUtils';
import { admissionAssessmentApi } from './AdmissionAssessment.api';

// Represents the Finance module's localized Read Model for incoming students
interface PendingAssessmentDto {
    studentId: string; // The ID passed over from the ApplicantAcceptedIntegrationEvent
    applicantName: string;
    programCode: string;
    academicYear: string;
    status: 'AssessmentPending' | 'Assessed';
    dateAccepted: string;
    totalUnits?: number;
}

export const AdmissionAssessmentPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedApplicant, setSelectedApplicant] = useState<PendingAssessmentDto | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'AssessmentPending' | 'Assessed'>('ALL');
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Assessment Form State
    const [totalTuition, setTotalTuition] = useState<number | ''>('');
    const [downpaymentAmount, setDownpaymentAmount] = useState<number | ''>('');
    const [formError, setFormError] = useState<string | null>(null);

    // 1. Fetch pending assessments from Admissions / Enrollment Finance API
    const { data: rawAssessments, isLoading, isError, refetch } = useQuery({
        queryKey: ['pendingAssessments'],
        queryFn: async (): Promise<PendingAssessmentDto[]> => {
            const [financeResult, admissionsResult] = await Promise.allSettled([
                admissionAssessmentApi.getPendingAssessments(),
                admissionsApi.getPendingApplications()
            ]);

            const map = new Map<string, PendingAssessmentDto>();

            // 1. Ingest admissions applicants
            if (admissionsResult.status === 'fulfilled') {
                const apps = toSafeArray(admissionsResult.value);
                for (const a of apps) {
                    const id = a.id || a.applicantId || a.studentId || 'APP-2026-001';
                    map.set(id, {
                        studentId: id,
                        applicantName: a.fullName || a.applicantName || `${a.firstName || 'Candidate'} ${a.lastName || ''}`.trim() || 'Applicant',
                        programCode: a.program || a.programId || a.programCode || 'BSCS',
                        academicYear: a.academicYear || 'AY 2026-2027',
                        status: (a.status === 'Assessed' ? 'Assessed' : 'AssessmentPending') as PendingAssessmentDto['status'],
                        dateAccepted: a.submittedDate || a.submittedAt || new Date().toISOString().split('T')[0],
                        totalUnits: 18,
                    });
                }
            }

            // 2. Ingest / merge finance assessments (takes precedence on assessed status)
            if (financeResult.status === 'fulfilled') {
                const fin = toSafeArray(financeResult.value);
                for (const f of fin) {
                    const id = f.studentId || f.id || 'APP-2026-001';
                    const existing = map.get(id);
                    map.set(id, {
                        studentId: id,
                        applicantName: f.applicantName || existing?.applicantName || 'Applicant',
                        programCode: f.programCode || existing?.programCode || 'BSCS',
                        academicYear: f.academicYear || existing?.academicYear || 'AY 2026-2027',
                        status: (f.status === 'Assessed' ? 'Assessed' : existing?.status || 'AssessmentPending') as PendingAssessmentDto['status'],
                        dateAccepted: f.dateAccepted || existing?.dateAccepted || new Date().toISOString().split('T')[0],
                        totalUnits: f.totalUnits || existing?.totalUnits || 18,
                    });
                }
            }

            return Array.from(map.values());
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
    });

    const pendingAssessments = toSafeArray<PendingAssessmentDto>(rawAssessments);

    // 2. Mutation to issue the invoice using the shared Finance API
    const assessMutation = useMutation({
        mutationFn: async (payload: { studentId: string, tuition: number, downpayment: number }) => {
            return await financeApi.issueInvoice({
                studentId: payload.studentId,
                amount: payload.downpayment,
                description: `Enrollment Downpayment - $${payload.tuition} Total Tuition Assessed`
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingAssessments'] });
            queryClient.invalidateQueries({ queryKey: ['finance'] });
            setSuccessMsg(`Tuition assessment confirmed! Downpayment invoice of $${downpaymentAmount} issued to ${selectedApplicant?.applicantName}.`);
            handleCloseModal();
            setTimeout(() => setSuccessMsg(null), 6000);
        },
        onError: (error) => {
            console.error("Failed to issue invoice", error);
            setFormError("Failed to issue the invoice. Please verify the backend connection.");
        }
    });

    const handleOpenModal = (applicant: PendingAssessmentDto) => {
        setSelectedApplicant(applicant);
        const defaultTuition = (applicant.totalUnits || 18) * 150 + 400; // $150/unit + $400 misc
        const defaultDownpayment = Math.round(defaultTuition * 0.25); // 25% downpayment
        setTotalTuition(defaultTuition);
        setDownpaymentAmount(defaultDownpayment);
        setFormError(null);
    };

    const handleCloseModal = () => {
        setSelectedApplicant(null);
        setTotalTuition('');
        setDownpaymentAmount('');
        setFormError(null);
    };

    const handleDownpaymentPreset = (percentage: number) => {
        if (totalTuition && typeof totalTuition === 'number') {
            setDownpaymentAmount(Math.round(totalTuition * percentage));
        }
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

    const filteredAssessments = pendingAssessments.filter(a => {
        const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
        const matchesSearch = !searchTerm ||
            a.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.programCode.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const pendingCount = pendingAssessments.filter(a => a.status === 'AssessmentPending').length;
    const assessedCount = pendingAssessments.filter(a => a.status === 'Assessed').length;

    return (
        <div className="fade-in">
            <PageHeader
                title="Applicant Tuition Assessment"
                subtitle="Evaluate newly accepted applicants, assess academic unit fees, and issue mandatory enrollment downpayment invoices."
                action={
                    <Button variant="outline" size="small" onClick={() => refetch()}>
                        🔄 Sync Queue
                    </Button>
                }
            />

            {successMsg && (
                <div style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)', background: 'var(--success-bg, rgba(16, 185, 129, 0.12))', border: '1px solid var(--success-border, rgba(16, 185, 129, 0.3))', borderRadius: 'var(--radius-md)', color: 'var(--success-text, #10b981)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span>✅</span>
                    <span>{successMsg}</span>
                </div>
            )}

            {isError && (
                <div style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)', background: 'var(--danger-bg, rgba(239, 68, 68, 0.12))', border: '1px solid var(--danger-border, rgba(239, 68, 68, 0.3))', borderRadius: 'var(--radius-md)', color: 'var(--danger-text, #ef4444)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span>⚠️</span>
                    <span>Unable to load live applicant assessments from the backend.</span>
                </div>
            )}

            {/* KPI Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <Card>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pending In-Queue</span>
                    <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--warning-text)' }}>
                        {pendingCount} Candidates
                    </h2>
                </Card>
                <Card>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Assessed Invoices</span>
                    <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--brand-primary)' }}>
                        {assessedCount} Issued
                    </h2>
                </Card>
                <Card>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Standard Downpayment Rate</span>
                    <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--text-primary)' }}>
                        25% Required
                    </h2>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                        <FormInput
                            placeholder="Search by Applicant Name, Reference ID, or Program..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {(['ALL', 'AssessmentPending', 'Assessed'] as const).map((tab) => (
                            <Button
                                key={tab}
                                variant={statusFilter === tab ? 'primary' : 'outline'}
                                size="small"
                                onClick={() => setStatusFilter(tab)}
                            >
                                {tab === 'ALL' ? 'All Applicants' : tab === 'AssessmentPending' ? 'Pending Assessment' : 'Assessed'}
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>

            {isLoading ? (
                <div className="skeleton" style={{ height: '350px' }} />
            ) : (
                <Card>
                    <Table>
                        <thead>
                            <tr>
                                <th>Applicant Reference</th>
                                <th>Applicant Name</th>
                                <th>Program</th>
                                <th>Academic Year</th>
                                <th>Date Submitted</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssessments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                                        No applicants matching criteria in the assessment queue.
                                    </td>
                                </tr>
                            ) : (
                                filteredAssessments.map(assessment => (
                                    <tr key={assessment.studentId}>
                                        <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                                            {assessment.studentId}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{assessment.applicantName}</td>
                                        <td>
                                            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{assessment.programCode}</span>
                                        </td>
                                        <td>{assessment.academicYear}</td>
                                        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{assessment.dateAccepted}</td>
                                        <td>
                                            <Badge colorScheme={assessment.status === 'Assessed' ? 'success' : 'warning'}>
                                                {assessment.status === 'Assessed' ? 'Assessed' : 'Pending Assessment'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                variant="primary"
                                                size="small"
                                                disabled={assessment.status === 'Assessed'}
                                                onClick={() => handleOpenModal(assessment)}
                                            >
                                                {assessment.status === 'Assessed' ? 'Assessed' : 'Assess Tuition'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card>
            )}

            {/* Tuition Assessment Modal */}
            {selectedApplicant && (
                <Modal isOpen={!!selectedApplicant} onClose={handleCloseModal}>
                    <h2 style={{ marginTop: 0, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                        Assess Tuition & Issue Downpayment
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: '0.9rem' }}>
                        Applicant: <strong style={{ color: 'var(--text-primary)' }}>{selectedApplicant.applicantName}</strong> ({selectedApplicant.programCode} • {selectedApplicant.studentId})
                    </p>

                    {formError && (
                        <div style={{ padding: 'var(--space-3)', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)' }}>
                            {formError}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 'var(--space-2)', color: 'var(--text-primary)', fontWeight: 600 }}>
                                Total Assessed Tuition ($)
                            </label>
                            <FormInput
                                type="number"
                                value={totalTuition === '' ? '' : String(totalTuition)}
                                onChange={(e) => setTotalTuition(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="e.g. 3100"
                                required
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                                Based on ~18 enrolled units @ $150/unit + $400 miscellaneous fees.
                            </span>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                                    Required Downpayment Amount ($)
                                </label>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <Button size="small" variant="outline" type="button" onClick={() => handleDownpaymentPreset(0.20)}>20%</Button>
                                    <Button size="small" variant="outline" type="button" onClick={() => handleDownpaymentPreset(0.25)}>25%</Button>
                                    <Button size="small" variant="outline" type="button" onClick={() => handleDownpaymentPreset(0.50)}>50%</Button>
                                </div>
                            </div>
                            <FormInput
                                type="number"
                                value={downpaymentAmount === '' ? '' : String(downpaymentAmount)}
                                onChange={(e) => setDownpaymentAmount(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="e.g. 775"
                                required
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                                Generates an official payment invoice on the applicant portal to unlock enrollment confirmation.
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
                            variant="primary"
                            onClick={handleSubmitAssessment}
                            disabled={assessMutation.isPending}
                        >
                            {assessMutation.isPending ? 'Issuing Invoice...' : 'Issue Downpayment Invoice'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AdmissionAssessmentPage;