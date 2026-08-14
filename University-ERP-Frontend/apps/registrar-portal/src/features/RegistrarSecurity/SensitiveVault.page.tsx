import React, { useState } from 'react';
import { Card, Table, Badge, Button, PageHeader, FormInput } from '@university-erp/ui-kit';

export const SensitiveVaultPage: React.FC = () => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [accessReason, setAccessReason] = useState('');
    const [authKey, setAuthKey] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const handleUnlock = () => {
        setIsAuthenticating(true);
        // Simulate secure server-side decryption and audit logging
        setTimeout(() => {
            setIsUnlocked(true);
            setIsAuthenticating(false);
        }, 1200);
    };

    const handleLock = () => {
        setIsUnlocked(false);
        setAccessReason('');
        setAuthKey('');
    };

    return (
        <div className="fade-in">
            <PageHeader 
                title="Sensitive Document Vault" 
                subtitle="Securely access encrypted disciplinary records, psychological evaluations, and sealed files." 
                action={isUnlocked && <Button variant="danger" onClick={handleLock}>🔒 Lock Vault</Button>}
            />

            {!isUnlocked ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-8)' }}>
                    <Card style={{ maxWidth: '500px', width: '100%', borderTop: '4px solid var(--danger-text, #ef4444)', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔐</div>
                        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-bright, var(--text-primary))' }}>Protected Access Required</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                            You are requesting access to highly sensitive, encrypted university records. 
                            <strong> All access events are permanently logged in the Immutable Access Audit ledger.</strong>
                        </p>

                        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                Official Reason for Access (Required for Audit)
                            </label>
                            <FormInput 
                                value={accessReason}
                                onChange={(e) => setAccessReason(e.target.value)}
                                placeholder="e.g., Subpoena Review, Disciplinary Committee..."
                                style={{ background: 'var(--bg-base)', marginBottom: '1rem' }}
                            />
                            
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                Authorization / Decryption Key
                            </label>
                            <FormInput 
                                type="password"
                                value={authKey}
                                onChange={(e) => setAuthKey(e.target.value)}
                                placeholder="••••••••••••"
                                style={{ background: 'var(--bg-base)' }}
                            />
                        </div>

                        <Button 
                            variant="primary" 
                            style={{ width: '100%' }} 
                            disabled={!accessReason || !authKey || isAuthenticating}
                            onClick={handleUnlock}
                        >
                            {isAuthenticating ? 'Decrypting & Auditing Access...' : 'Authorize & Unlock Vault'}
                        </Button>
                    </Card>
                </div>
            ) : (
                <Card className="fade-in" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--danger-border, #ef4444)' }}>
                    <div style={{ padding: 'var(--space-4)', background: 'var(--danger-bg, rgba(239, 68, 68, 0.1))', borderBottom: '1px solid var(--danger-border, #ef4444)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: 'var(--danger-text, #ef4444)', fontWeight: 600 }}>⚠️ Vault Unlocked - Audit Logging Active</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Reason: <em>{accessReason}</em></div>
                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <th>Document ID</th>
                                <th>Student ID</th>
                                <th>Record Classification</th>
                                <th>Date Sealed</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ fontFamily: 'monospace' }}>SEC-8821-A</td>
                                <td>STU-2021-0091</td>
                                <td><Badge colorScheme="danger">Disciplinary Action (Level 3)</Badge></td>
                                <td>Nov 14, 2023</td>
                                <td><Button variant="outline" size="small">View Decrypted File</Button></td>
                            </tr>
                            <tr>
                                <td style={{ fontFamily: 'monospace' }}>SEC-8845-B</td>
                                <td>STU-2022-0414</td>
                                <td><Badge colorScheme="warning">Medical Clearance (Confidential)</Badge></td>
                                <td>Jan 05, 2024</td>
                                <td><Button variant="outline" size="small">View Decrypted File</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                </Card>
            )}
        </div>
    );
};
