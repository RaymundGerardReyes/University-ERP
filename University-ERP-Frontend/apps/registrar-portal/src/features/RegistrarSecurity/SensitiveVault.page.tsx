import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const SensitiveVaultPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Sensitive Document Vault</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Securely access encrypted disciplinary records, psychological evaluations, and sealed files.</p>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input type="password" placeholder="Enter Registrar Decryption Key..." style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)' }} />
                <Button variant="danger">Unlock Vault</Button>
            </div>

            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)', filter: 'blur(8px)', transition: 'filter 0.3s', cursor: 'not-allowed' }}>
                <div style={{ padding: '3rem', textAlign: 'center', fontSize: '1.2rem' }}>
                    Vault is currently Locked. Decryption Key Required.
                </div>
            </Card>
        </div>
    );
};
