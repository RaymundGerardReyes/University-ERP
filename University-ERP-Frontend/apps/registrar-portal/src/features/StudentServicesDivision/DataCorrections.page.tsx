import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const DataCorrectionsPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Data Corrections</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Process student requests for name changes or civil status updates.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Target Student</th>
                            <th>Field to Change</th>
                            <th>Submitted Documents</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>COR-9192</td>
                            <td>Maria Garcia</td>
                            <td>Civil Status (Married)</td>
                            <td><Badge variant="info">Marriage Cert</Badge></td>
                            <td><Badge variant="warning">Awaiting Review</Badge></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
