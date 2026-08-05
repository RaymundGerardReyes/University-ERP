import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useAdjustStock } from './StockManagement.hooks';

export const StockManagementPage: React.FC = () => {
    const { mutateAsync: adjustStock, isPending } = useAdjustStock();
    const [status, setStatus] = useState<string | null>(null);

    const handleRestock = async () => {
        try {
            const response = await adjustStock({
                stockItemId: 'ITEM-CHEM-402',
                amount: 50,
                reason: 'Restocking for Fall 2026 Semester'
            });
            setStatus(`Successfully updated! New Quantity: ${response.newQuantity}`);
        } catch (err) {
            setStatus('Failed to adjust stock levels.');
        }
    };

    return (
        <div className="fade-in">
            <PageHeader
                title="Stock & Inventory"
                subtitle="Monitor warehouse levels, lab supplies, and trigger automated purchase orders."
            />

            <div className="grid-2 fade-in-delay-1">
                {/* Inventory Actions Card */}
                <Card style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="card-accent-top" />
                    <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-4)' }}>
                        Inventory Adjustments
                    </h2>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-6)' }}>
                        Trigger a simulated <strong>AdjustStockCommand</strong> to the Administration backend to test the inventory domain logic.
                    </p>

                    <div style={{ marginTop: 'auto' }}>
                        <Button variant="primary" style={{ width: '100%' }} onClick={handleRestock} disabled={isPending}>
                            {isPending ? 'Processing...' : 'Simulate +50 Restock'}
                        </Button>
                        {status && (
                            <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                                <Badge colorScheme={status.includes('Success') ? 'success' : 'danger'}>
                                    {status}
                                </Badge>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Low Stock Alerts Card */}
                <Card>
                    <div className="card-accent-top" style={{ background: 'var(--warning-bg)' }} />
                    <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--warning-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-4)' }}>
                        Low Stock Alerts
                    </h2>

                    <div className="data-row">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="data-label" style={{ color: 'var(--text-primary)' }}>Printer Toner (Cyan)</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ITEM-OFFICE-09</span>
                        </div>
                        <span className="data-value" style={{ color: 'var(--danger-text)' }}>2 Units</span>
                    </div>

                    <div className="data-row">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="data-label" style={{ color: 'var(--text-primary)' }}>Nitrile Gloves (Box)</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ITEM-MED-112</span>
                        </div>
                        <span className="data-value" style={{ color: 'var(--warning-text)' }}>14 Units</span>
                    </div>

                    <Button variant="outline" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
                        Generate Purchase Order
                    </Button>
                </Card>
            </div>
        </div>
    );
};