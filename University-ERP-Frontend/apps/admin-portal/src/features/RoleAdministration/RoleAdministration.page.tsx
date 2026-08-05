import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useSystemRoles } from './RoleAdministration.hooks';

export const RoleAdministrationPage: React.FC = () => {
    const { data: roles, isLoading, isError } = useSystemRoles();

    if (isLoading) return <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }} />;
    if (isError || !roles) return <div className="stub-page fade-in"><div className="stub-title">System Error</div></div>;

    return (
        <div className="fade-in">
            <PageHeader
                title="Role & Access Management"
                subtitle="Govern security permissions, roles, and bounded context access across the ERP."
                action={<Button variant="primary">Create New Role</Button>}
            />

            <div className="grid-auto fade-in-delay-1">
                {roles.map((role) => {
                    let riskColor: 'danger' | 'warning' | 'info' = 'info';
                    if (role.riskLevel === 'High') riskColor = 'danger';
                    if (role.riskLevel === 'Medium') riskColor = 'warning';

                    return (
                        <Card key={role.id} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="card-accent-top" style={{ background: `var(--${riskColor}-text)` }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{role.id}</span>
                                <Badge colorScheme={riskColor}>{role.riskLevel} Risk</Badge>
                            </div>

                            <h3 style={{ color: 'var(--text-bright)', margin: '0 0 var(--space-1) 0', fontSize: '1.25rem' }}>{role.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', margin: '0 0 var(--space-5) 0', fontSize: '0.85rem' }}>{role.users} Active Users</p>

                            <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-6)', flex: 1 }}>
                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>Allowed Contexts</span>
                                <p style={{ margin: 0, color: 'var(--brand-primary)', fontSize: '0.85rem', fontWeight: 500 }}>{role.access}</p>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                <Button variant="outline" style={{ flex: 1 }}>Audit Logs</Button>
                                <Button variant="secondary" style={{ flex: 1 }}>Edit Access</Button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};