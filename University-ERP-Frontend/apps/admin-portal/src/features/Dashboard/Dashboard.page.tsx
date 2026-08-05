import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useAdminDashboard } from './Dashboard.hooks';

export const DashboardPage: React.FC = () => {
    const { data: metrics, isLoading, isError } = useAdminDashboard();

    if (isLoading) return <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }} />;
    if (isError || !metrics) return <div className="stub-page fade-in"><div className="stub-title">System Error</div></div>;

    return (
        <div className="fade-in">
            <PageHeader
                title="Admin Control Center"
                subtitle="Global overview of ERP system health, operations, and pending administrative tasks."
            />

            <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--success-text)' }} />
                    <span className="stat-label">System Health</span>
                    <span className="stat-value" style={{ color: 'var(--success-text)' }}>{metrics.systemUptime}</span>
                    <span className="stat-trend">All Services Operational</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                    <span className="stat-label">Active Users</span>
                    <span className="stat-value">{metrics.activeSessions}</span>
                    <span className="stat-trend" style={{ color: 'var(--text-muted)' }}>Currently authenticated</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: metrics.activeAlerts > 0 ? 'var(--danger-text)' : 'var(--success-text)' }} />
                    <span className="stat-label">System Alerts</span>
                    <span className="stat-value" style={{ color: metrics.activeAlerts > 0 ? 'var(--danger-text)' : 'var(--text-bright)' }}>
                        {metrics.activeAlerts}
                    </span>
                    <span className="stat-trend">Infrastructure warnings</span>
                </Card>
            </div>

            <div className="grid-2 fade-in-delay-2">
                <Card>
                    <div className="card-accent-top" style={{ background: 'var(--warning-text)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <h2 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>Pending Approvals</h2>
                        <Badge colorScheme="warning">{metrics.pendingApprovals} Pending</Badge>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                            <div className="data-row" style={{ padding: 0, borderBottom: 'none' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="data-value" style={{ textAlign: 'left' }}>Purchase Order: PO-99022</span>
                                    <span className="data-label">Requires Finance Sign-off</span>
                                </div>
                                <Button variant="secondary" style={{ padding: 'var(--space-1) var(--space-3)', fontSize: '0.75rem' }}>Review</Button>
                            </div>
                        </div>
                        <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                            <div className="data-row" style={{ padding: 0, borderBottom: 'none' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="data-value" style={{ textAlign: 'left' }}>Facility Request: Auditorium</span>
                                    <span className="data-label">Requires Admin Override</span>
                                </div>
                                <Button variant="secondary" style={{ padding: 'var(--space-1) var(--space-3)', fontSize: '0.75rem' }}>Review</Button>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h2 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Quick Navigation</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <Button variant="outline" style={{ justifyContent: 'flex-start' }}>User Administration</Button>
                        <Button variant="outline" style={{ justifyContent: 'flex-start' }}>Role & Access Policies</Button>
                        <Button variant="outline" style={{ justifyContent: 'flex-start' }}>System Infrastructure Logs</Button>
                        <Button variant="outline" style={{ justifyContent: 'flex-start' }}>Canteen & Operations</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};