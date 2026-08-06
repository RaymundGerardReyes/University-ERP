import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const RecommendationQueuePage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Dean Recommendation Queue</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Review applicants endorsed by department chairpersons.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Admission ID</th>
                            <th>Applicant</th>
                            <th>Endorsing Chair</th>
                            <th>Program</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>ADM-2026-901</td>
                            <td>James Wilson</td>
                            <td>Dr. Robert Mendez</td>
                            <td>BS Architecture</td>
                            <td><Badge variant="info">Pending Dean Approval</Badge></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
