import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { IdentityWorkflow } from '@university-erp/workflow-sdk';

export const AccessRevocationPage: React.FC = () => {
    const handleRevoke = async (userId: string) => {
        await IdentityWorkflow.process(userId, 'RevokeAccess');
        alert('EMERGENCY: Account access revoked globally.');
    };

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Emergency Access Revocation</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Immediately suspend all ERP and physical access for a compromised or suspended account.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Directory ID</th>
                            <th>Name</th>
                            <th>Risk Level</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>mgarcia</td>
                            <td>Maria Garcia</td>
                            <td><Badge variant="danger">High (Compromised Credential)</Badge></td>
                            <td>
                                <Button size="small" variant="danger" onClick={() => handleRevoke('mgarcia')}>
                                    REVOKE ALL ACCESS
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
