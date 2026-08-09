import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useSystemHealth } from './IntegrationManagement.hooks';

export const IntegrationManagementPage: React.FC = () => {
    const { data: healthChecks, isLoading } = useSystemHealth();

    if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;

    const eventBus = healthChecks?.find(h => h.component.includes('Event Bus'));
    const apis = healthChecks?.filter(h => !h.component.includes('Event Bus')) || [];

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
                        <span className="data-value" style={{ color: eventBus?.status === 'OK' ? 'var(--success-text)' : 'var(--danger-text)' }}>
                            {eventBus ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                    <div className="data-row">
                        <span className="data-label">Details</span>
                        <span className="data-value">{eventBus?.detail || 'N/A'}</span>
                    </div>
                    <Button variant="outline" style={{ marginTop: '1rem', width: '100%' }}>View Event Logs</Button>
                </Card>
                <Card>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>External API Clients</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {apis.map((api, idx) => (
                            <div key={idx} style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-primary)' }}>{api.component}</span>
                                <span style={{ color: api.status === 'OK' ? 'var(--success-text)' : 'var(--warning-text)', fontSize: '0.85rem' }}>{api.status}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};