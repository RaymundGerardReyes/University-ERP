import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React from 'react';
import { useCurrentTermInvoice } from './Financials.hooks';

export const FinancialsPage: React.FC = () => {
    const { identity } = useAuth();
    const currentTermId = "TERM-FALL-2026";

    const { data: invoice, isLoading, isError } = useCurrentTermInvoice(identity?.id || 'demo', currentTermId);

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
                    {outstandingBalance > 0 && (
                        <Button variant="primary" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
                            Make a Payment
                        </Button>
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