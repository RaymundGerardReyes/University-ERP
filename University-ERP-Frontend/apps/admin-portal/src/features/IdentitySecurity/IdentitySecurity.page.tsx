import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const IdentitySecurityPage: React.FC = () => {
    return (
        <div className="fade-in">
            <PageHeader
                title="Identity & Security"
                subtitle="Manage authentication policies, MFA, and SSO integrations."
            />
            <div className="grid-2 fade-in-delay-1">
                <Card>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Authentication Policies</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Require MFA for Faculty</span>
                        <input type="checkbox" defaultChecked style={{ transform: 'scale(1.2)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Session Timeout (minutes)</span>
                        <input type="number" defaultValue={60} style={{ width: '60px', padding: '0.25rem', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Max Login Attempts</span>
                        <input type="number" defaultValue={5} style={{ width: '60px', padding: '0.25rem', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
                    </div>
                    <Button variant="primary" style={{ marginTop: '1rem', width: '100%' }}>Save Policies</Button>
                </Card>
                <Card>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Identity Providers (SSO)</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Azure Active Directory</span>
                            <span style={{ color: 'var(--success-text)', fontSize: '0.8rem', fontWeight: 600 }}>Active</span>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Google Workspace</span>
                            <Button variant="outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Configure</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};