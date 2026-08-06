import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const FacultyEndorsementsPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Faculty Endorsements</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Review applicants that have been endorsed by academic departments.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Applicant ID</th>
                            <th>Applicant Name</th>
                            <th>Target Program</th>
                            <th>Endorsing Faculty</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>APP-2026-088</td>
                            <td>James Wilson</td>
                            <td>BS Architecture</td>
                            <td>Arch. Sarah Jenkins</td>
                            <td><Badge variant="success">Endorsed</Badge></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
