import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useCanteenMetrics } from './CanteenOrders.hooks';

export const CanteenOrdersPage: React.FC = () => {
    const { data, isLoading, isError } = useCanteenMetrics();

    if (isLoading) return <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }} />;
    if (isError || !data) return <div className="stub-page fade-in"><div className="stub-title">System Error</div></div>;

    return (
        <div className="fade-in">
            <PageHeader
                title="Canteen & Meal Plans"
                subtitle="Live oversight of campus dining operations and student meal redemptions."
                action={<Button variant="outline">Export Daily Ledger</Button>}
            />

            <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                    <span className="stat-label">Active Meal Plans</span>
                    <span className="stat-value">{data.activePlans}</span>
                    <span className="stat-trend" style={{ color: 'var(--text-muted)' }}>Registered students</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--info-text)' }} />
                    <span className="stat-label">Meals Served Today</span>
                    <span className="stat-value" style={{ color: 'var(--info-text)' }}>{data.mealsServedToday}</span>
                    <span className="stat-trend">Across all dining halls</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--success-text)' }} />
                    <span className="stat-label">Gross Value (Today)</span>
                    <span className="stat-value" style={{ color: 'var(--success-text)' }}>${data.revenueToday.toFixed(2)}</span>
                    <span className="stat-trend">Point-of-sale total</span>
                </Card>
            </div>

            <Card className="fade-in-delay-2" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="card-accent-top" style={{ background: 'var(--warning-text)' }} />
                <div style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <h2 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Live Order Feed</h2>
                </div>

                <div style={{ padding: '0 var(--space-6)' }}>
                    {data.recentOrders.map((order: any, idx: number) => (
                        <div key={order.id} className="data-row" style={{ borderBottom: idx === data.recentOrders.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="data-value" style={{ textAlign: 'left', color: 'var(--text-bright)' }}>{order.student}</span>
                                <span className="data-label">{order.plan} &bull; {order.id}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{order.time}</span>
                                <Badge colorScheme={order.status === 'Served' ? 'success' : 'warning'}>{order.status}</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};