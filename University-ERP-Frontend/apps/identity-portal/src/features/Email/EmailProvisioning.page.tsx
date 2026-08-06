import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const EmailProvisioningPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Email Provisioning</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Provision @university.edu email inboxes for verified users.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Directory ID</th>
                            <th>Target Address</th>
                            <th>Account Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>jwilson</td>
                            <td>james.wilson@university.edu</td>
                            <td>Student</td>
                            <td><Button size="small" variant="primary">Create Mailbox</Button></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
