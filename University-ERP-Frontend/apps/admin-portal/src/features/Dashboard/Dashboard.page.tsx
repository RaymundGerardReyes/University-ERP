import { Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const DashboardPage: React.FC = () => {
    const metrics = [
        { label: 'Active Users', value: '14,205', status: 'Healthy', color: 'var(--success-text)' },
        { label: 'Pending Approvals', value: '42', status: 'Requires Attention', color: 'var(--warning-text)' },
        { label: 'Failed Integrations', value: '3', status: 'Critical', color: 'var(--danger-text)' },
        { label: 'Database Health', value: '99.9%', status: 'Optimal', color: 'var(--info-text)' },
    ];

    return (
        <div className="fade-in">
            <PageHeader title="Executive Dashboard" subtitle="Enterprise orchestration and global system overview." />

            <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-8)' }}>
                {metrics.map(metric => (
                    <Card key={metric.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{metric.label}</span>
                        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-bright)', letterSpacing: '-0.03em' }}>{metric.value}</span>
                        <span style={{ fontSize: '0.85rem', color: metric.color, fontWeight: 500 }}>{metric.status}</span>
                    </Card>
                ))}
            </div>

            <div className="grid-2 fade-in-delay-2">
                <Card>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>System Alerts</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'var(--danger-bg)', borderLeft: '4px solid var(--danger-text)', borderRadius: '4px' }}>
                            <strong style={{ color: 'var(--danger-text)', display: 'block' }}>Payment Gateway Latency</strong>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Finance module reporting 400ms latency on stripe integrations.</span>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--warning-bg)', borderLeft: '4px solid var(--warning-text)', borderRadius: '4px' }}>
                            <strong style={{ color: 'var(--warning-text)', display: 'block' }}>Email Queue Build-up</strong>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>1,200 admission decision emails pending dispatch.</span>
                        </div>
                    </div>
                </Card>
                <Card>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Active Background Jobs</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {['SIS Synchronization', 'LMS Nightly Backup', 'Audit Log Archival'].map(job => (
                            <div key={job} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{job}</span>
                                <span style={{ color: 'var(--success-text)', fontSize: '0.85rem', fontWeight: 600 }}>Running</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};