import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { FinanceWorkflow } from '@university-erp/workflow-sdk';

export const ClearanceApprovalPage: React.FC = () => {
    const handleClear = async (studentId: string) => {
        await FinanceWorkflow.process(studentId, 'ClearBalance');
        alert('Balance Cleared. Financial hold has been lifted for Graduation Clearance.');
    };

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Financial Clearance (Graduation)</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Review ledgers and lift financial holds for graduating students.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Remaining Balance</th>
                            <th>Ledger Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>STU-2022-1044</td>
                            <td style={{ fontWeight: 700, color: 'var(--success-color)' }}>$0.00</td>
                            <td><Badge variant="success">Fully Paid</Badge></td>
                            <td>
                                <Button size="small" variant="primary" onClick={() => handleClear('STU-2022-1044')}>
                                    Approve Financial Clearance
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
