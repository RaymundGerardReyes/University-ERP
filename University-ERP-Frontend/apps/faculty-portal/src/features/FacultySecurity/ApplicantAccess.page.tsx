import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const ApplicantAccessPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Applicant Access Control</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage and audit which faculty members have access to sensitive applicant records.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Faculty Name</th>
                            <th>Role</th>
                            <th>Active Cases Accessed</th>
                            <th>Clearance Level</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Dr. Robert Mendez</td>
                            <td><Badge variant="info">CHAIRPERSON</Badge></td>
                            <td>14</td>
                            <td><Badge variant="success">Level 3 (Academic)</Badge></td>
                            <td><Button size="small" variant="secondary">Revoke Access</Button></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
