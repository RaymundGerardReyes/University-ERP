import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const SubjectLoadingPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Subject Loading</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Override and manage manual subject loading for special cases.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Requested Subject</th>
                            <th>Override Reason</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>STU-2024-9182</td>
                            <td>Emily Clark</td>
                            <td>CS301</td>
                            <td>Prerequisite Waiver</td>
                            <td><Badge variant="warning">Pending Override</Badge></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
