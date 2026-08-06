import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const CollegeApprovalPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>College Approval Board</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Review all program capacity limits and departmental endorsements.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Program Code</th>
                            <th>Total Endorsed</th>
                            <th>Available Slots</th>
                            <th>Approval Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>BS-ARCH</td>
                            <td>45</td>
                            <td>50</td>
                            <td><Badge variant="success">Under Capacity</Badge></td>
                            <td><Button size="small" variant="primary">Approve Batch</Button></td>
                        </tr>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>BS-CS</td>
                            <td style={{ color: 'hsl(0, 100%, 70%)', fontWeight: 700 }}>120</td>
                            <td>100</td>
                            <td><Badge variant="danger">Over Capacity</Badge></td>
                            <td><Button size="small" variant="warning">Review Waitlist</Button></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
