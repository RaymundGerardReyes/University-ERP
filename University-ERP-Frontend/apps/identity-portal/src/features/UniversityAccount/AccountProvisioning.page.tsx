import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { IdentityWorkflow } from '@university-erp/workflow-sdk';

export const AccountProvisioningPage: React.FC = () => {
    const handleProvision = async (userId: string) => {
        await IdentityWorkflow.process(userId, 'ProvisionSSO');
        await IdentityWorkflow.process(userId, 'GenerateUniversityID');
        alert('SSO Account and University ID generated successfully.');
    };

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Account Provisioning</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Provision Single Sign-On (SSO) and Directory Accounts for newly enrolled students.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Clearance Status</th>
                            <th>SSO Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>STU-2026-8812</td>
                            <td>James Wilson</td>
                            <td><Badge variant="success">Registrar Cleared</Badge></td>
                            <td><Badge variant="warning">Pending</Badge></td>
                            <td>
                                <Button size="small" variant="primary" onClick={() => handleProvision('STU-2026-8812')}>
                                    Provision Account
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
