import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const MFASetupPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>MFA Configuration</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage Multi-Factor Authentication requirements across the University ERP.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)', padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Global Security Policies</h3>
                <ul style={{ lineHeight: '2' }}>
                    <li><Badge variant="success">Enforced</Badge> Faculty / Staff Authenticator App Requirement</li>
                    <li><Badge variant="warning">Optional</Badge> Student Authenticator App</li>
                    <li><Badge variant="success">Enforced</Badge> Finance & Registrar 30-day Token Expiry</li>
                </ul>
            </Card>
        </div>
    );
};
