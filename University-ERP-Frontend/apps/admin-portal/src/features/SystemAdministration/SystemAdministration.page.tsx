import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useSystemConfig, useToggleConfig } from './SystemAdministration.hooks';

export const SystemAdministrationPage: React.FC = () => {
    const { data: config, isLoading } = useSystemConfig();
    const { mutateAsync: toggleConfig, isPending } = useToggleConfig();

    if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="System Administration"
                subtitle="Manage global platform configurations, background jobs, and system states."
                action={<Button variant="outline">Trigger Manual Backup</Button>}
            />

            <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                    <span className="stat-label">Platform Version</span>
                    <span className="stat-value" style={{ fontSize: '1.5rem', marginTop: 'var(--space-2)' }}>{config?.version}</span>
                    <span className="stat-trend">Latest Stable</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--info-text)' }} />
                    <span className="stat-label">Active Nodes</span>
                    <span className="stat-value" style={{ color: 'var(--info-text)' }}>{config?.activeNodes}</span>
                    <span className="stat-trend">Load Balanced</span>
                </Card>
            </div>

            <div className="grid-2 fade-in-delay-2">
                <Card>
                    <div className="card-accent-top" style={{ background: 'var(--danger-text)' }} />
                    <h2 className="data-value" style={{ textAlign: 'left', marginBottom: 'var(--space-4)' }}>Global Toggles</h2>

                    <div className="data-row">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="data-value" style={{ textAlign: 'left' }}>Maintenance Mode</span>
                            <span className="data-label">Locks out all non-admin users</span>
                        </div>
                        <Button
                            variant={config?.maintenanceMode ? 'primary' : 'outline'}
                            disabled={isPending}
                            onClick={() => toggleConfig({ key: 'maintenanceMode', value: !config?.maintenanceMode })}
                        >
                            {config?.maintenanceMode ? 'Active' : 'Disabled'}
                        </Button>
                    </div>

                    <div className="data-row" style={{ borderBottom: 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="data-value" style={{ textAlign: 'left' }}>New Registrations</span>
                            <span className="data-label">Allow public account creation</span>
                        </div>
                        <Button
                            variant={config?.registrationEnabled ? 'primary' : 'outline'}
                            disabled={isPending}
                            onClick={() => toggleConfig({ key: 'registrationEnabled', value: !config?.registrationEnabled })}
                        >
                            {config?.registrationEnabled ? 'Enabled' : 'Disabled'}
                        </Button>
                    </div>
                </Card>

                <Card>
                    <div className="card-accent-top" style={{ background: 'var(--success-text)' }} />
                    <h2 className="data-value" style={{ textAlign: 'left', marginBottom: 'var(--space-4)' }}>Infrastructure Health</h2>

                    <div className="data-row">
                        <span className="data-label">Last Database Backup</span>
                        <span className="data-value">{config?.lastBackup ? new Date(config.lastBackup).toLocaleString() : 'N/A'}</span>
                    </div>

                    <div className="data-row">
                        <span className="data-label">Redis Cache Cluster</span>
                        <Badge colorScheme="success">{config?.cacheStatus}</Badge>
                    </div>

                    <div className="data-row" style={{ borderBottom: 'none' }}>
                        <span className="data-label">Identity Provider</span>
                        <Badge colorScheme="success">Healthy</Badge>
                    </div>
                </Card>
            </div>
        </div>
    );
};