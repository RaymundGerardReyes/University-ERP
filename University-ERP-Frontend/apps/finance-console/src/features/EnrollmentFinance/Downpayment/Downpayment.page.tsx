import React, { useState } from 'react';
import { Badge, Button, Card, FormInput, PageHeader, Table } from '@university-erp/ui-kit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { financeBillingApi } from '@university-erp/api-clients';
import { downpaymentApi } from './Downpayment.api';
import { toSafeArray } from '../../../utils/arrayUtils';

interface DownpaymentRecord {
    referenceId: string;
    applicantName: string;
    program: string;
    amountDue: number;
    amountPaid: number;
    paymentMethod: 'ONLINE_GATEWAY' | 'OVER_THE_COUNTER' | 'BANK_TRANSFER';
    status: 'PAYMENT_PENDING' | 'PAYMENT_VERIFIED' | 'RECONCILED';
    transactionRef: string;
    date: string;
}

export const DownpaymentPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'PAYMENT_PENDING' | 'PAYMENT_VERIFIED'>('ALL');
    const [notification, setNotification] = useState<string | null>(null);

    const { data: rawDownpayments, isLoading, isError, refetch } = useQuery({
        queryKey: ['downpayments'],
        queryFn: async (): Promise<DownpaymentRecord[]> => {
            const raw = await downpaymentApi.getPendingPayments();
            const list = toSafeArray(raw);
            return list.map((d: any) => ({
                referenceId: d.referenceId || d.applicantId || d.id || 'APP-2026-0001',
                applicantName: d.applicantName || 'Applicant',
                program: d.program || 'General',
                amountDue: Number(d.amountDue || d.amountPaid || 0),
                amountPaid: Number(d.amountPaid || 0),
                paymentMethod: (d.paymentMethod || 'ONLINE_GATEWAY') as DownpaymentRecord['paymentMethod'],
                status: (d.status === 'PAYMENT_VERIFIED' ? 'PAYMENT_VERIFIED' : 'PAYMENT_PENDING') as DownpaymentRecord['status'],
                transactionRef: d.transactionRef || `TXN-${d.referenceId || '001'}`,
                date: d.date || new Date().toISOString().split('T')[0]
            }));
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
    });

    const downpayments = toSafeArray<DownpaymentRecord>(rawDownpayments);

    const verifyMutation = useMutation({
        mutationFn: async (record: DownpaymentRecord) => {
            try {
                await downpaymentApi.verifyPayment({ paymentId: record.referenceId });
            } catch {
                await financeBillingApi.payApplicationFee(record.referenceId, {
                    amount: record.amountPaid,
                    transactionId: record.transactionRef
                });
            }
        },
        onSuccess: (_, record) => {
            queryClient.invalidateQueries({ queryKey: ['downpayments'] });
            queryClient.invalidateQueries({ queryKey: ['pendingAssessments'] });
            queryClient.invalidateQueries({ queryKey: ['admissions'] });
            setNotification(`Downpayment of $${record.amountPaid.toFixed(2)} for ${record.applicantName} (${record.referenceId}) verified and recorded.`);
            setTimeout(() => setNotification(null), 5000);
        },
        onError: (err) => {
            console.error("Failed to verify downpayment", err);
            alert("Verification failed. Please retry.");
        }
    });

    const handleVerify = (record: DownpaymentRecord) => {
        verifyMutation.mutate(record);
    };

    const filteredRecords = downpayments.filter(item => {
        const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
        const matchesSearch = !searchTerm ||
            item.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.transactionRef.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const pendingCount = downpayments.filter(d => d.status === 'PAYMENT_PENDING').length;
    const verifiedTotal = downpayments.filter(d => d.status === 'PAYMENT_VERIFIED').reduce((acc, d) => acc + d.amountPaid, 0);

    return (
        <div className="fade-in">
            <PageHeader
                title="Enrollment Downpayment Verification"
                subtitle="Verify incoming applicant downpayments from the payment gateway and cashier desks to unlock official enrollment."
                action={
                    <Button variant="outline" size="small" onClick={() => refetch()}>
                        🔄 Refresh Payments
                    </Button>
                }
            />

            {notification && (
                <div style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)', background: 'var(--success-bg, rgba(16, 185, 129, 0.12))', border: '1px solid var(--success-border, rgba(16, 185, 129, 0.3))', borderRadius: 'var(--radius-md)', color: 'var(--success-text, #10b981)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span>✅</span>
                    <span>{notification}</span>
                </div>
            )}

            {isError && (
                <div style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)', background: 'var(--danger-bg, rgba(239, 68, 68, 0.12))', border: '1px solid var(--danger-border, rgba(239, 68, 68, 0.3))', borderRadius: 'var(--radius-md)', color: 'var(--danger-text, #ef4444)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span>⚠️</span>
                    <span>Unable to load live downpayment records from the backend.</span>
                </div>
            )}

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <Card>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Awaiting Verification</span>
                    <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--warning-text)' }}>
                        {pendingCount} Transactions
                    </h2>
                </Card>
                <Card>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Verified Downpayments (YTD)</span>
                    <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--success-text)' }}>
                        ${verifiedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h2>
                </Card>
                <Card>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Auto-Settlement Channel</span>
                    <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--brand-primary)' }}>
                        QR Ph & Gateway
                    </h2>
                </Card>
            </div>

            {/* Search & Filter Bar */}
            <Card style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                        <FormInput
                            placeholder="Search by Applicant Name, Reference ID, or Transaction Code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {(['ALL', 'PAYMENT_PENDING', 'PAYMENT_VERIFIED'] as const).map((status) => (
                            <Button
                                key={status}
                                variant={filterStatus === status ? 'primary' : 'outline'}
                                size="small"
                                onClick={() => setFilterStatus(status)}
                            >
                                {status === 'ALL' ? 'All Records' : status === 'PAYMENT_PENDING' ? 'Pending Review' : 'Verified'}
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Downpayments Table */}
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
                                <th>Amount Paid</th>
                                <th>Payment Channel</th>
                                <th>Transaction Ref</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                                        No downpayment records found matching filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record) => (
                                    <tr key={record.referenceId}>
                                        <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                                            {record.referenceId}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{record.applicantName}</td>
                                        <td>{record.program}</td>
                                        <td style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                                            ${record.amountPaid.toFixed(2)}
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {record.paymentMethod.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem' }}>
                                            {record.transactionRef}
                                        </td>
                                        <td>
                                            <Badge colorScheme={record.status === 'PAYMENT_VERIFIED' ? 'success' : 'warning'}>
                                                {record.status === 'PAYMENT_VERIFIED' ? 'Verified' : 'Pending Review'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                size="small"
                                                variant="primary"
                                                disabled={record.status === 'PAYMENT_VERIFIED' || verifyMutation.isPending}
                                                onClick={() => handleVerify(record)}
                                            >
                                                {record.status === 'PAYMENT_VERIFIED' ? 'Verified' : 'Confirm Payment'}
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

export default DownpaymentPage;
