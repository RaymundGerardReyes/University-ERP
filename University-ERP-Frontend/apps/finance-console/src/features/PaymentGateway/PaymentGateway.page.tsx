import React, { useState } from 'react';
import { Badge, Button, Card, FormInput, PageHeader, Table } from '@university-erp/ui-kit';
import { useAllPaymentSessions, useReconcilePayment } from './PaymentGateway.hooks';
import { GatewayStatusFilter, PaymentSessionRecord } from './PaymentGateway.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const PaymentGatewayPage: React.FC = () => {
    const { data: rawSessions, isLoading, isError } = useAllPaymentSessions();
    const reconcileMutation = useReconcilePayment();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<GatewayStatusFilter>('ALL');

    const sessions: PaymentSessionRecord[] = toSafeArray<PaymentSessionRecord>(rawSessions);

    // Filter sessions by status category and search query
    const filteredSessions = sessions.filter((s) => {
        const matchesSearch =
            !searchQuery ||
            (s.sessionId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.applicantId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.invoiceId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.bankReference || '').toLowerCase().includes(searchQuery.toLowerCase());

        const isSuccess = s.status === 'Paid' || s.status === 'Completed';
        const isPending = s.status === 'Active' || s.status === 'AwaitingPayment' || s.status === 'PendingBankConfirmation';
        const isFailed = s.status === 'Failed' || s.status === 'Cancelled' || s.status === 'Expired';

        if (statusFilter === 'SUCCESS') return matchesSearch && isSuccess;
        if (statusFilter === 'PENDING') return matchesSearch && isPending;
        if (statusFilter === 'FAILED') return matchesSearch && isFailed;
        return matchesSearch;
    });

    // KPI Metrics
    const settledTotal = sessions
        .filter((s) => s.status === 'Paid' || s.status === 'Completed')
        .reduce((sum, s) => sum + Number(s.amount || 0), 0);

    const settledCount = sessions.filter((s) => s.status === 'Paid' || s.status === 'Completed').length;
    const pendingCount = sessions.filter((s) => s.status === 'Active' || s.status === 'AwaitingPayment' || s.status === 'PendingBankConfirmation').length;
    const failedCount = sessions.filter((s) => s.status === 'Failed' || s.status === 'Cancelled' || s.status === 'Expired').length;

    const handleReconcile = (sessionId: string, amount: number) => {
        if (window.confirm(`Confirm manual receipt of payment for $${Number(amount ?? 0).toFixed(2)}? This action will mark the student's invoice as paid and notify downstream systems.`)) {
            reconcileMutation.mutate({ 
                sessionId, 
                remarks: 'Manual reconciliation via Payment Gateway monitor.' 
            });
        }
    };

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case 'Paid':
            case 'Completed':
                return <Badge colorScheme="success">Settled</Badge>;
            case 'PendingBankConfirmation':
                return <Badge colorScheme="warning">Pending Confirmation</Badge>;
            case 'AwaitingPayment':
            case 'Active':
                return <Badge colorScheme="info">Awaiting Payment</Badge>;
            case 'Failed':
                return <Badge colorScheme="danger">Failed</Badge>;
            case 'Cancelled':
            case 'Expired':
                return <Badge colorScheme="default">{status}</Badge>;
            default:
                return <Badge colorScheme="default">{status}</Badge>;
        }
    };

    return (
        <div className="fade-in">
            <PageHeader 
                title="Payment Gateway Monitor" 
                subtitle="Monitor real-time online payment gateway transactions, settlement statuses, and reconciliations." 
            />

            {/* KPI Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <Card>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Settled Volume
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success-text)', marginTop: 'var(--space-1)' }}>
                        ${settledTotal.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                        {settledCount} successful transactions
                    </div>
                </Card>

                <Card>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Pending Transactions
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--warning-text, #f59e0b)', marginTop: 'var(--space-1)' }}>
                        {pendingCount}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                        Awaiting payment or bank callback
                    </div>
                </Card>

                <Card>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Failed / Expired
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--danger-text)', marginTop: 'var(--space-1)' }}>
                        {failedCount}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                        Declined, cancelled, or timed out
                    </div>
                </Card>

                <Card>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Sessions
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--brand-primary)', marginTop: 'var(--space-1)' }}>
                        {sessions.length}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                        Lifetime gateway sessions tracked
                    </div>
                </Card>
            </div>

            {isLoading ? (
              <div className="skeleton" style={{ height: '400px' }} data-testid="loading-skeleton" />
            ) : isError ? (
              <div className="stub-page fade-in">
                <div className="stub-title">Gateway Unavailable</div>
                <div className="stub-subtitle">Failed to load the payment sessions queue from the server.</div>
              </div>
            ) : (
              <>
                <Card style={{ marginBottom: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '260px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                                Search Transactions
                            </label>
                            <FormInput 
                                placeholder="Enter Session ID, Student ID, or Reference..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                                Filter by Status
                            </label>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                {(['ALL', 'PENDING', 'SUCCESS', 'FAILED'] as const).map((tab) => (
                                    <Button
                                        key={tab}
                                        variant={statusFilter === tab ? 'primary' : 'outline'}
                                        size="small"
                                        onClick={() => setStatusFilter(tab)}
                                    >
                                        {tab}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
                
                <Card>
                    <Table>
                        <thead>
                            <tr>
                                <th>Session ID</th>
                                <th>Student / Applicant ID</th>
                                <th>Amount</th>
                                <th>Channel / Reference</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSessions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-6)' }}>
                                        No gateway payment sessions match your search or filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredSessions.map((session) => {
                                    const isPending = session.status === 'Active' || session.status === 'AwaitingPayment' || session.status === 'PendingBankConfirmation';
                                    const isPaid = session.status === 'Paid' || session.status === 'Completed';

                                    return (
                                        <tr key={session.sessionId}>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600 }}>
                                                {session.sessionId}
                                            </td>
                                            <td style={{ fontWeight: 600 }}>
                                                <div>{session.applicantId}</div>
                                                {session.invoiceId && (
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                        {session.invoiceId}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ color: isPaid ? 'var(--success-text)' : 'var(--text-primary)', fontWeight: 'bold' }}>
                                                ${Number(session.amount ?? 0).toFixed(2)} {session.currency || 'PHP'}
                                            </td>
                                            <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {session.bankReference || 'Online Banking'}
                                            </td>
                                            <td>
                                                {renderStatusBadge(session.status)}
                                            </td>
                                            <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {session.createdAtUtc ? new Date(session.createdAtUtc).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td>
                                                {isPending ? (
                                                    <Button 
                                                        variant="primary" 
                                                        size="small"
                                                        disabled={reconcileMutation.isPending}
                                                        onClick={() => handleReconcile(session.sessionId, session.amount)}
                                                    >
                                                        {reconcileMutation.isPending ? 'Processing...' : 'Reconcile'}
                                                    </Button>
                                                ) : isPaid ? (
                                                    <Badge colorScheme="success">Reconciled</Badge>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Closed</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </Table>
                </Card>
              </>
            )}
        </div>
    );
};
