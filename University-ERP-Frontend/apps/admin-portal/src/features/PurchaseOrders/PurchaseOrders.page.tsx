import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useCreatePurchaseOrder, useRecentOrders } from './PurchaseOrders.hooks';
import { CreatePurchaseOrderPayload } from './PurchaseOrders.types';

export const PurchaseOrdersPage: React.FC = () => {
    const { data: orders, isLoading } = useRecentOrders();
    const { mutateAsync: createOrder, isPending } = useCreatePurchaseOrder();

    const [formData, setFormData] = useState<CreatePurchaseOrderPayload>({
        vendorId: 'VND-DELL',
        totalAmount: 0
    });

    const handleCreate = async () => {
        if (formData.totalAmount <= 0) return;
        try {
            await createOrder(formData);
            setFormData({ vendorId: 'VND-DELL', totalAmount: 0 });
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="Procurement & Purchase Orders"
                subtitle="Manage university expenditures, vendor orders, and financial approvals."
            />

            <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                    <span className="stat-label">Monthly Spend</span>
                    <span className="stat-value">$142,500</span>
                    <span className="stat-trend">August 2026</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--warning-text)' }} />
                    <span className="stat-label">Pending Approvals</span>
                    <span className="stat-value" style={{ color: 'var(--warning-text)' }}>12</span>
                    <span className="stat-trend">Awaiting Finance Sign-off</span>
                </Card>
            </div>

            <div className="grid-2 fade-in-delay-2">
                <Card>
                    <div className="card-accent-top" style={{ background: 'var(--info-text)' }} />
                    <h2 className="data-value" style={{ textAlign: 'left', marginBottom: 'var(--space-4)' }}>Recent Orders</h2>

                    <div>
                        {orders?.map((order) => (
                            <div key={order.id} className="data-row">
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="data-value" style={{ textAlign: 'left' }}>{order.vendor}</span>
                                    <span className="data-label">{order.id} &bull; {order.date}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-1)' }}>
                                    <Badge colorScheme={order.status === 'Approved' ? 'success' : 'warning'}>{order.status}</Badge>
                                    <span className="data-value">${order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <div className="card-accent-top" style={{ background: 'var(--success-text)' }} />
                    <h2 className="data-value" style={{ textAlign: 'left', marginBottom: 'var(--space-4)' }}>Draft New Order</h2>

                    <div className="data-row" style={{ borderBottom: 'none' }}>
                        <label className="data-label">Select Vendor</label>
                        <select
                            className="data-value"
                            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)' }}
                            value={formData.vendorId}
                            onChange={e => setFormData({ ...formData, vendorId: e.target.value })}
                        >
                            <option value="VND-DELL">Dell Technologies</option>
                            <option value="VND-CISCO">Cisco Systems</option>
                            <option value="VND-LAB">LabCorp</option>
                        </select>
                    </div>

                    <div className="data-row">
                        <label className="data-label">Total Amount ($)</label>
                        <input
                            type="number"
                            className="data-value"
                            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', width: '120px' }}
                            value={formData.totalAmount || ''}
                            onChange={e => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })}
                        />
                    </div>

                    <Button variant="primary" onClick={handleCreate} disabled={isPending || formData.totalAmount <= 0} style={{ width: '100%', marginTop: 'var(--space-4)' }}>
                        {isPending ? 'Submitting...' : 'Submit to Finance'}
                    </Button>
                </Card>
            </div>
        </div>
    );
};