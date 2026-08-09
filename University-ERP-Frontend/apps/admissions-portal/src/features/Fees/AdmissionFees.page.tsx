import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { useQuery } from '@tanstack/react-query';
import { financeApi } from '@university-erp/api-clients/administration/financeApi';
import React from 'react';

export const AdmissionFeesPage: React.FC = () => {
    const { data: invoices, isLoading } = useQuery({
        queryKey: ['invoices'],
        queryFn: () => financeApi.getInvoices()
    });
    return (
        <div className="fade-in">
            <PageHeader
                title="Admission Fees"
                subtitle="Track application fee payments and financial clearances."
            />

            <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
                <Card style={{ flex: 1, padding: '1.5rem', borderLeft: '4px solid var(--info-text)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>TOTAL INVOICES</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{isLoading ? '...' : invoices?.length || 0}</div>
                </Card>
                <Card style={{ flex: 1, padding: '1.5rem', borderLeft: '4px solid var(--warning-text)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>PENDING PAYMENT</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{isLoading ? '...' : invoices?.filter((i: any) => i.status === 'Pending').length || 0}</div>
                </Card>
                <Card style={{ flex: 1, padding: '1.5rem', borderLeft: '4px solid var(--success-text)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>PAID TODAY</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{isLoading ? '...' : invoices?.filter((i: any) => i.status === 'Paid').length || 0}</div>
                </Card>
            </div>

            <Card style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-elevated)' }}>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Invoice ID</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Applicant Name</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Amount</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading invoices...</td></tr>
                        )}
                        {invoices?.map((item: any, idx: number) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{item.id}</td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{item.studentName || item.applicantName || 'Applicant'}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>${item.amount || '50.00'}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{new Date(item.dueDate || Date.now()).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem' }}><Badge colorScheme={item.status === 'Paid' ? 'success' : 'warning'}>{item.status || 'Pending'}</Badge></td>
                                <td style={{ padding: '1rem' }}>
                                    <Button variant="secondary" size="small" onClick={() => alert(`Viewing details for invoice ID: ${item.id}`)}>View</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};
