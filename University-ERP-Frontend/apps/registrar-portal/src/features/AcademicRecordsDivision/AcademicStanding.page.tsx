import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const AcademicStandingPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Academic Standing</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Monitor scholastic delinquencies and dean's lister statuses.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Term GWA</th>
                            <th>Standing</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>STU-2022-8412</td>
                            <td>Olivia Roberts</td>
                            <td>3.25</td>
                            <td><Badge variant="danger">Probationary</Badge></td>
                            <td><Button variant="ghost" size="small">Notify</Button></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
