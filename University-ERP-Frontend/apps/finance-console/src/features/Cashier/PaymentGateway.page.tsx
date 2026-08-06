import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const PaymentGatewayPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Payment Gateway</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Process inbound payments from physical cashier checks, wire transfers, and online portals.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)', padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', maxWidth: '400px' }}>
                    <input type="text" placeholder="Student ID" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-light)', background: 'var(--surface-base)', color: 'var(--text-primary)' }} />
                    <input type="number" placeholder="Amount ($)" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-light)', background: 'var(--surface-base)', color: 'var(--text-primary)' }} />
                    <select style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-light)', background: 'var(--surface-base)', color: 'var(--text-primary)' }}>
                        <option>Credit Card (Stripe)</option>
                        <option>Bank Transfer</option>
                        <option>Cashier Check</option>
                    </select>
                    <Button size="large" variant="success">Post Payment</Button>
                </div>
            </Card>
        </div>
    );
};
