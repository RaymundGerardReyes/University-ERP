import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const PlatformMonitoringPage: React.FC = () => {
    return (
        <div className="fade-in">
            <PageHeader title="Platform Monitoring" subtitle="Real-time infrastructure health and telemetry." />

            <div className="grid-3 fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>API Gateway CPU</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>24%</div>
                    <div style={{ color: 'var(--success-text)', fontSize: '0.85rem' }}>Stable</div>
                </Card>
                <Card>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Database Memory</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>68%</div>
                    <div style={{ color: 'var(--warning-text)', fontSize: '0.85rem' }}>Approaching Threshold</div>
                </Card>
                <Card>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Event Bus Queue</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>12ms</div>
                    <div style={{ color: 'var(--success-text)', fontSize: '0.85rem' }}>Optimal Latency</div>
                </Card>
            </div>

            <Card className="fade-in-delay-2">
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Cluster Status</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                        { service: 'IdentityAccess.API', status: 'Healthy', uptime: '99.99%' },
                        { service: 'StudentInformation.API', status: 'Healthy', uptime: '99.98%' },
                        { service: 'Finance.Worker', status: 'Degraded', uptime: '98.50%' },
                        { service: 'LearningManagement.API', status: 'Healthy', uptime: '100%' },
                    ].map(node => (
                        <div key={node.service} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                            <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{node.service}</span>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Uptime: {node.uptime}</span>
                                <Badge colorScheme={node.status === 'Healthy' ? 'success' : 'warning'}>{node.status}</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};