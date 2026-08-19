import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentTermInvoice, useCreatePaymentSession, usePaymentSessionStatus } from './Financials.hooks';
import { financePaymentSessionApi } from '@university-erp/api-clients';

export const FinancialsPage: React.FC = () => {
    const { identity } = useAuth();
    const queryClient = useQueryClient();
    const currentTermId = "TERM-FALL-2026";

    const { data: invoice, isLoading, isError } = useCurrentTermInvoice(identity?.id || 'demo', currentTermId);
    const createSessionMutation = useCreatePaymentSession();

    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [bankQrPayload, setBankQrPayload] = useState<string | null>(null);

    const { data: sessionStatus } = usePaymentSessionStatus(activeSessionId);

    useEffect(() => {
        if (sessionStatus?.status === 'Paid') {
            queryClient.invalidateQueries({ queryKey: ['student', identity?.id || 'demo', 'invoice'] });
            setActiveSessionId(null);
        }
    }, [sessionStatus?.status, queryClient, identity?.id]);

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    if (isError || !invoice) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">No Active Invoices</div>
                <div className="stub-subtitle">Your assessments for the current term have not been finalized yet.</div>
            </div>
        );
    }

    const outstandingBalance = invoice.amountDue - invoice.amountPaid;

    const handleMakePayment = () => {
        createSessionMutation.mutate({
            invoiceId: invoice.invoiceId,
            applicantId: identity?.id || 'unknown',
            amount: outstandingBalance,
            purpose: `Tuition Payment - ${currentTermId}`,
            currency: 'PHP'
        }, {
            onSuccess: (data) => {
                if (data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                } else {
                    alert("Failed to retrieve checkout URL from the payment gateway.");
                }
            }
        });
    };

    return (
        <div className="fade-in">
            <PageHeader title="My Financials" subtitle="View your account balance, term assessments, and payment schedules." />

            <div className="grid-2 fade-in-delay-1">
                <Card>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Current Term Balance</h3>
                    <div className="data-row">
                        <span className="data-label">Total Assessed</span>
                        <span className="data-value">${invoice.amountDue.toFixed(2)}</span>
                    </div>
                    <div className="data-row">
                        <span className="data-label">Amount Paid</span>
                        <span className="data-value text-success">${invoice.amountPaid.toFixed(2)}</span>
                    </div>
                    <div className="data-row" style={{ borderBottom: 'none', marginTop: 'var(--space-2)' }}>
                        <span className="data-label" style={{ fontWeight: 'bold' }}>Outstanding Balance</span>
                        <span className="data-value" style={{ fontSize: '1.5rem', color: outstandingBalance > 0 ? 'var(--danger-text)' : 'var(--success-text)' }}>
                            ${outstandingBalance.toFixed(2)}
                        </span>
                    </div>

                    {outstandingBalance > 0 && !activeSessionId && (
                        <Button 
                            variant="primary" 
                            style={{ width: '100%', marginTop: 'var(--space-4)' }}
                            onClick={handleMakePayment}
                            disabled={createSessionMutation.isPending}
                        >
                            {createSessionMutation.isPending ? 'Connecting to Bank...' : 'Make a Payment'}
                        </Button>
                    )}


                    {createSessionMutation.isError && (
                        <div style={{ color: 'var(--danger-text)', fontSize: '0.85rem', marginTop: 'var(--space-2)' }}>
                            Failed to initialize payment session. Please try again.
                        </div>
                    )}
                </Card>

                <Card>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Fee Breakdown</h3>
                    {invoice.breakdown.map((item, idx) => (
                        <div className="data-row" key={idx} style={{ borderBottom: idx === invoice.breakdown.length - 1 ? 'none' : undefined }}>
                            <span className="data-label">{item.category}</span>
                            <span className="data-value">${item.amount.toFixed(2)}</span>
                        </div>
                    ))}
                </Card>
            </div>

            <h3 style={{ marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)' }}>Payment Schedule</h3>
            <Card className="fade-in-delay-2">
                <Table>
                    <thead>
                        <tr>
                            <th>Installment Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.installments.map((inst, idx) => (
                            <tr key={idx}>
                                <td>{new Date(inst.date).toLocaleDateString()}</td>
                                <td>${inst.amount.toFixed(2)}</td>
                                <td>
                                    <Badge colorScheme={inst.status === 'PAID' ? 'success' : 'warning'}>
                                        {inst.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};