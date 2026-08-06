import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { FinanceWorkflow } from '@university-erp/workflow-sdk';

export const StatementOfAccountPage: React.FC = () => {
    const handleGenerate = async (studentId: string) => {
        await FinanceWorkflow.process(studentId, 'GenerateBilling');
        alert('Official Statement of Account generated and sent to student email.');
    };

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Statement of Account (SOA)</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Generate and distribute official billing statements.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Assessment Status</th>
                            <th>Total Due</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>STU-2026-8812</td>
                            <td><Badge variant="success">Assessed</Badge></td>
                            <td style={{ fontWeight: 700 }}>$4,500.00</td>
                            <td>
                                <Button size="small" variant="primary" onClick={() => handleGenerate('STU-2026-8812')}>
                                    Generate SOA
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
