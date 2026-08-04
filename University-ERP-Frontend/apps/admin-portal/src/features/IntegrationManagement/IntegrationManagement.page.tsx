import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const IntegrationManagementPage: React.FC = () => {
    return (
        <div className="fade-in">
            <PageHeader
                title="Integration Management"
                subtitle="Monitor the Event Bus, Webhooks, and external API connections."
            />
            <div className="grid-2 fade-in-delay-1">
                <Card>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Event Bus Health (RabbitMQ)</h2>
                    <div className="data-row">
                        <span className="data-label">Status</span>
                        <span className="data-value" style={{ color: 'var(--success-text)' }}>Connected</span>
                    </div>
                    <div className="data-row">
                        <span className="data-label">Messages Processed (24h)</span>
                        <span className="data-value">142,059</span>
                    </div>
                    <div className="data-row">
                        <span className="data-label">Dead Letter Queue</span>
                        <span className="data-value" style={{ color: 'var(--warning-text)' }}>3 messages pending review</span>
                    </div>
                    <Button variant="outline" style={{ marginTop: '1rem', width: '100%' }}>View Event Logs</Button>
                </Card>
                <Card>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>External API Clients</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-primary)' }}>Payment Gateway (Stripe)</span>
                            <span style={{ color: 'var(--success-text)', fontSize: '0.85rem' }}>OK</span>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-primary)' }}>SMS Provider (Twilio)</span>
                            <span style={{ color: 'var(--success-text)', fontSize: '0.85rem' }}>OK</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};