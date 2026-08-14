import React from 'react';
import { Badge, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useStudentBillings } from './StudentBilling.hooks';

export const StudentBillingPage: React.FC = () => {
    const { data: billings, isLoading, isError } = useStudentBillings();

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;
    if (isError) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Data Unavailable</div>
                <div className="stub-subtitle">Failed to load dynamic student billings from the server.</div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <PageHeader 
                title="Student Billing Administration" 
                subtitle="Manage and view dynamically generated student tuition invoices and balances." 
            />
            
            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Description</th>
                            <th>Total Assessed</th>
                            <th>Paid Amount</th>
                            <th>Outstanding</th>
                            <th>Status</th>
                            <th>Issued On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!billings || billings.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No student billings found. Process an admission enrollment to auto-generate a bill.
                                </td>
                            </tr>
                        ) : (
                            billings.map(billing => (
                                <tr key={billing.id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                        {billing.studentId.substring(0, 8)}...
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{billing.description}</td>
                                    <td>${billing.totalAmount.toFixed(2)}</td>
                                    <td style={{ color: billing.paidAmount > 0 ? 'var(--success-text)' : 'inherit' }}>
                                        ${billing.paidAmount.toFixed(2)}
                                    </td>
                                    <td style={{ 
                                        color: billing.outstandingBalance > 0 ? 'var(--warning-text)' : 'var(--success-text)', 
                                        fontWeight: 'bold' 
                                    }}>
                                        ${billing.outstandingBalance.toFixed(2)}
                                    </td>
                                    <td>
                                        <Badge colorScheme={
                                            billing.status === 'PAID' ? 'success' : 
                                            (billing.status === 'PARTIAL' ? 'warning' : 'danger')
                                        }>
                                            {billing.status}
                                        </Badge>
                                    </td>
                                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {new Date(billing.issuedOnUtc).toLocaleDateString()}
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
