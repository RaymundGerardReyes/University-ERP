import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const SystemAdministrationPage: React.FC = () => {
    return (
        <div className="fade-in">
            <PageHeader title="System Administration" subtitle="Manage feature flags, maintenance windows, and cache states." />

            <div className="grid-auto fade-in-delay-1">
                <Card>
                    <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Feature Flags</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>New Admissions UI (v2)</span>
                        <input type="checkbox" defaultChecked style={{ transform: 'scale(1.2)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>AI Auto-Grading Beta</span>
                        <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                    </div>
                </Card>

                <Card>
                    <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Cache Management</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Clear Redis instances globally or by specific bounded context.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Button variant="outline" style={{ justifyContent: 'center' }}>Clear Academic Cache</Button>
                        <Button variant="secondary" style={{ justifyContent: 'center', color: 'var(--danger-text)', borderColor: 'var(--danger-border)' }}>Purge Global Cache (Hard)</Button>
                    </div>
                </Card>

                <Card style={{ background: 'var(--danger-bg)', borderColor: 'var(--danger-border)' }}>
                    <h2 style={{ fontSize: '1.1rem', color: 'var(--danger-text)', marginBottom: '1rem' }}>Maintenance Mode</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                        Activating maintenance mode will immediately terminate all active user sessions and lock out all public portals.
                    </p>
                    <Button variant="primary" style={{ background: '#dc2626', width: '100%' }}>Enable Maintenance Lock</Button>
                </Card>
            </div>
        </div>
    );
};