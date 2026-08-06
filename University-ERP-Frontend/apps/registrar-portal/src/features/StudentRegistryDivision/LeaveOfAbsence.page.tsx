import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const LeaveOfAbsencePage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Leave of Absence (LOA)</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Process LOA applications and monitor returning students.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Duration</th>
                            <th>Reason</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>STU-2023-1102</td>
                            <td>Michael Chang</td>
                            <td>1 Semester</td>
                            <td>Medical</td>
                            <td><Badge variant="info">Under Review</Badge></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
