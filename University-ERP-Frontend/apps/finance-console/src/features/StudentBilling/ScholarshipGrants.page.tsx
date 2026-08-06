import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { FinanceWorkflow } from '@university-erp/workflow-sdk';

export const ScholarshipGrantsPage: React.FC = () => {
    const handleApply = async (studentId: string) => {
        await FinanceWorkflow.process(studentId, 'ApplyScholarship');
        alert('Dean’s Lister Scholarship successfully applied to ledger.');
    };

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Scholarship & Grants</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Apply approved academic scholarships and financial aid to student ledgers.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Grant Type</th>
                            <th>Deduction</th>
                            <th>Verification</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>STU-2026-8812</td>
                            <td>Dean's Lister (Full)</td>
                            <td style={{ color: 'var(--success-color)' }}>- $4,500.00</td>
                            <td><Badge variant="success">Registrar Verified</Badge></td>
                            <td>
                                <Button size="small" variant="primary" onClick={() => handleApply('STU-2026-8812')}>
                                    Apply Grant
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
