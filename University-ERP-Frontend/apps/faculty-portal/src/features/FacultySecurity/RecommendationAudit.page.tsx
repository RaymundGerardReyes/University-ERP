import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const RecommendationAuditPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Faculty Recommendation Audit Log</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Immutable record of all academic evaluations, endorsements, and data access.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Actor Role</th>
                            <th>Actor Name</th>
                            <th>Admission Target</th>
                            <th>Action Taken</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>2026-08-05 10:14 AM</td>
                            <td><Badge variant="info">CHAIRPERSON</Badge></td>
                            <td>Dr. Robert Mendez</td>
                            <td style={{ fontFamily: 'monospace' }}>ADM-2026-901</td>
                            <td style={{ fontWeight: 600 }}>Submitted Academic Recommendation</td>
                        </tr>
                        <tr>
                            <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>2026-08-05 09:30 AM</td>
                            <td><Badge variant="warning">SECRETARY</Badge></td>
                            <td>Maria Garcia</td>
                            <td style={{ fontFamily: 'monospace' }}>ADM-2026-901</td>
                            <td style={{ fontWeight: 600 }}>Logged Interview Result</td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
