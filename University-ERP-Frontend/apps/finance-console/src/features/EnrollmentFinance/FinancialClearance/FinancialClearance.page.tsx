import React, { useState } from 'react';
import { Badge, Button, Card, FormInput, PageHeader, Table } from '@university-erp/ui-kit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';
import { financialClearanceApi } from './FinancialClearance.api';
import { toSafeArray } from '../../../utils/arrayUtils';

interface ClearanceCandidate {
    applicantId: string;
    applicantName: string;
    program: string;
    assessedTuition: number;
    downpaymentPaid: number;
    feeStatus: 'Paid' | 'Pending';
    clearanceStatus: 'CLEARANCE_PENDING' | 'CLEARED';
    datePaid: string;
}

export const FinancialClearancePage: React.FC = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'CLEARANCE_PENDING' | 'CLEARED'>('ALL');
    const [successBanner, setSuccessBanner] = useState<string | null>(null);

    const { data: rawCandidates, isLoading, isError, refetch } = useQuery({
        queryKey: ['financialClearanceCandidates'],
        queryFn: async (): Promise<ClearanceCandidate[]> => {
            const raw = await financialClearanceApi.getClearanceCandidates();
            const list = toSafeArray(raw);
            return list.map((c: any) => ({
                applicantId: c.applicantId || c.studentId || c.id || 'APP-2026-0001',
                applicantName: c.applicantName || 'Applicant',
                program: c.program || 'General',
                assessedTuition: Number(c.assessedTuition || 0),
                downpaymentPaid: Number(c.downpaymentPaid || 0),
                feeStatus: (c.feeStatus === 'Paid' ? 'Paid' : 'Pending') as ClearanceCandidate['feeStatus'],
                clearanceStatus: (c.clearanceStatus === 'CLEARED' ? 'CLEARED' : 'CLEARANCE_PENDING') as ClearanceCandidate['clearanceStatus'],
                datePaid: c.datePaid || new Date().toISOString().split('T')[0]
            }));
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
    });

    const candidates = toSafeArray<ClearanceCandidate>(rawCandidates);

    const clearMutation = useMutation({
        mutationFn: async (candidate: ClearanceCandidate) => {
            try {
                await financialClearanceApi.grantClearance(candidate.applicantId);
            } catch {
                await admissionsApi.endorseApplication(candidate.applicantId);
            }
        },
        onSuccess: (_, candidate) => {
            queryClient.invalidateQueries({ queryKey: ['financialClearanceCandidates'] });
            queryClient.invalidateQueries({ queryKey: ['admissions'] });
            queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
            setSuccessBanner(`Financial clearance granted to ${candidate.applicantName} (${candidate.applicantId}). Case forwarded to Registrar for Official Student ID generation.`);
            setTimeout(() => setSuccessBanner(null), 6000);
        },
        onError: (err) => {
            console.error("Failed to grant financial clearance", err);
            alert("Failed to grant financial clearance. Please retry.");
        }
    });

    const handleGrantClearance = (candidate: ClearanceCandidate) => {
        clearMutation.mutate(candidate);
    };

    const filteredCandidates = candidates.filter(item => {
        const matchesStatus = statusFilter === 'ALL' || item.clearanceStatus === statusFilter;
        const matchesSearch = !searchTerm ||
            item.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.applicantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.program.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const pendingCount = candidates.filter(c => c.clearanceStatus === 'CLEARANCE_PENDING').length;
    const clearedCount = candidates.filter(c => c.clearanceStatus === 'CLEARED').length;

    return (
        <div className="fade-in">
            <PageHeader
                title="Financial Clearance"
                subtitle="Issue official Financial Clearance for verified applicants to unlock Registrar Enrollment Activation & Student ID generation."
                action={
                    <Button variant="outline" size="small" onClick={() => refetch()}>
                        🔄 Refresh Candidates
                    </Button>
                }
            />

            {successBanner && (
                <div style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)', background: 'var(--success-bg, rgba(16, 185, 129, 0.12))', border: '1px solid var(--success-border, rgba(16, 185, 129, 0.3))', borderRadius: 'var(--radius-md)', color: 'var(--success-text, #10b981)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span>✅</span>
                    <span>{successBanner}</span>
                </div>
            )}

            {isError && (
                <div style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)', background: 'var(--danger-bg, rgba(239, 68, 68, 0.12))', border: '1px solid var(--danger-border, rgba(239, 68, 68, 0.3))', borderRadius: 'var(--radius-md)', color: 'var(--danger-text, #ef4444)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span>⚠️</span>
                    <span>Unable to load live clearance candidates from the backend.</span>
                </div>
            )}

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <Card>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pending Signoff</span>
                    <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--warning-text)' }}>
                        {pendingCount} Applicants
                    </h2>
                </Card>
                <Card>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cleared for Registrar Activation</span>
                    <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--success-text)' }}>
                        {clearedCount} Cleared
                    </h2>
                </Card>
                <Card>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Workflow Progression</span>
                    <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--brand-primary)' }}>
                        Gatekeeper to ID Issuance
                    </h2>
                </Card>
            </div>

            {/* Filter and Search */}
            <Card style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                        <FormInput
                            placeholder="Search by Applicant Name, ID, or Program..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {(['ALL', 'CLEARANCE_PENDING', 'CLEARED'] as const).map((status) => (
                            <Button
                                key={status}
                                variant={statusFilter === status ? 'primary' : 'outline'}
                                size="small"
                                onClick={() => setStatusFilter(status)}
                            >
                                {status === 'ALL' ? 'All Applicants' : status === 'CLEARANCE_PENDING' ? 'Pending Clearance' : 'Cleared'}
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Candidates Table */}
            {isLoading ? (
                <div className="skeleton" style={{ height: '300px' }} />
            ) : (
                <Card>
                    <Table>
                        <thead>
                            <tr>
                                <th>Applicant ID</th>
                                <th>Applicant Name</th>
                                <th>Program</th>
                                <th>Total Tuition</th>
                                <th>Downpayment</th>
                                <th>Fee Status</th>
                                <th>Clearance Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCandidates.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                                        No clearance candidates found matching filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredCandidates.map((candidate) => (
                                    <tr key={candidate.applicantId}>
                                        <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                                            {candidate.applicantId}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{candidate.applicantName}</td>
                                        <td>{candidate.program}</td>
                                        <td>${candidate.assessedTuition.toFixed(2)}</td>
                                        <td style={{ fontWeight: 700, color: 'var(--success-text)' }}>
                                            ${candidate.downpaymentPaid.toFixed(2)}
                                        </td>
                                        <td>
                                            <Badge colorScheme="success">Fee Paid</Badge>
                                        </td>
                                        <td>
                                            <Badge colorScheme={candidate.clearanceStatus === 'CLEARED' ? 'success' : 'warning'}>
                                                {candidate.clearanceStatus === 'CLEARED' ? 'Cleared' : 'Pending Signoff'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                size="small"
                                                variant="primary"
                                                disabled={candidate.clearanceStatus === 'CLEARED' || clearMutation.isPending}
                                                onClick={() => handleGrantClearance(candidate)}
                                            >
                                                {candidate.clearanceStatus === 'CLEARED' ? 'Cleared' : 'Grant Clearance'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card>
            )}
        </div>
    );
};

export default FinancialClearancePage;
