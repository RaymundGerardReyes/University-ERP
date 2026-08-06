import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const ResidencyRulesPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Residency Rule Validation</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Enforce Maximum Residency Rules (MRR) for students exceeding normal program durations.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Program</th>
                            <th>Years Active</th>
                            <th>MRR Limit</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>STU-2018-0012</td>
                            <td>John Smith</td>
                            <td>BS Engineering</td>
                            <td style={{ color: 'hsl(0, 100%, 70%)', fontWeight: 700 }}>8 Years</td>
                            <td>7 Years</td>
                            <td><Badge variant="danger">MRR Exceeded</Badge></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
