import React, { useState } from 'react';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useAllPaymentSessions, useReconcilePayment } from './PaymentGateway.hooks';

export const PaymentGatewayPage: React.FC = () => {
    const { data: sessions, isLoading, isError } = useAllPaymentSessions();
    const reconcileMutation = useReconcilePayment();
    const [searchQuery, setSearchQuery] = useState('');

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;
    if (isError || !sessions) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Gateway Unavailable</div>
                <div className="stub-subtitle">Failed to load the payment sessions queue.</div>
            </div>
        );
    }

    // Filter to show active/pending sessions, allowing search by Student ID or Session ID
    const activeSessions = sessions.filter((s: any) => 
        (s.status === 'Active' || s.status === 'AwaitingPayment' || s.status === 'PendingBankConfirmation') && 
        (s.sessionId.toLowerCase().includes(searchQuery.toLowerCase()) || s.applicantId.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleReconcile = (sessionId: string, amount: number) => {
        if (window.confirm(`Confirm receipt of cash payment for $${amount.toFixed(2)}? This action will mark the student's tuition invoice as paid.`)) {
            reconcileMutation.mutate({ 
                sessionId, 
                remarks: 'Over-the-counter cash payment received.' 
            });
        }
    };

    return (
        <div className="fade-in">
            <PageHeader 
                title="Cashier Dashboard" 
                subtitle="Process over-the-counter payments and reconcile active student payment sessions." 
            />

            <Card style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                            Search Active Sessions
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter Session ID or Student ID..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ 
                                width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', 
                                border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' 
                            }}
                        />
                    </div>
                    <Badge colorScheme="warning" style={{ marginTop: '1.5rem' }}>
                        {activeSessions.length} Pending Payments
                    </Badge>
                </div>
            </Card>
            
            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Session ID</th>
                            <th>Student / Applicant ID</th>
                            <th>Purpose</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeSessions.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No pending payment sessions match your search.
                                </td>
                            </tr>
                        ) : (
                            activeSessions.map((session: any) => (
                                <tr key={session.id || session.sessionId}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{session.sessionId}</td>
                                    <td style={{ fontWeight: 600 }}>{session.applicantId}</td>
                                    <td>{session.purpose || 'Tuition Fee Payment'}</td>
                                    <td style={{ color: 'var(--success-text)', fontWeight: 'bold' }}>
                                        ${session.amount.toFixed(2)} {session.currency || 'PHP'}
                                    </td>
                                    <td><Badge colorScheme="warning">Awaiting Funds</Badge></td>
                                    <td>
                                        <Button 
                                            variant="primary" 
                                            size="small"
                                            disabled={reconcileMutation.isPending}
                                            onClick={() => handleReconcile(session.sessionId, session.amount)}
                                        >
                                            {reconcileMutation.isPending ? 'Processing...' : 'Receive Cash & Reconcile'}
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