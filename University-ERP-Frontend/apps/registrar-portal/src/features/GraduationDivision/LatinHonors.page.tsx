import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const LatinHonorsPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Latin Honors Computation</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Automated calculation of Magna Cum Laude and Summa Cum Laude eligibility.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Computed GWA</th>
                            <th>Honor Designation</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>STU-2022-0491</td>
                            <td>Emma Watson</td>
                            <td style={{ fontWeight: 700, color: 'hsl(45, 90%, 45%)' }}>1.25</td>
                            <td><Badge variant="warning">Magna Cum Laude</Badge></td>
                            <td><Badge variant="info">Pending Final Audit</Badge></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
