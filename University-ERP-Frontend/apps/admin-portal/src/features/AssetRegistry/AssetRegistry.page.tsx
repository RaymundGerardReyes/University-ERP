import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useAssetInventory, useRegisterAsset } from './AssetRegistry.hooks';
import { RegisterAssetPayload } from './AssetRegistry.types';

export const AssetRegistryPage: React.FC = () => {
    const { data: assets, isLoading } = useAssetInventory();
    const { mutateAsync: registerAsset, isPending } = useRegisterAsset();

    const [formData, setFormData] = useState<RegisterAssetPayload>({
        assetName: '',
        category: 'IT Equipment',
        serialNumber: '',
        purchaseValue: 0
    });

    const handleRegister = async () => {
        if (!formData.assetName || formData.purchaseValue <= 0) return;
        try {
            await registerAsset(formData);
            setFormData({ assetName: '', category: 'IT Equipment', serialNumber: '', purchaseValue: 0 });
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;

    const totalValue = assets?.reduce((sum, asset) => sum + asset.value, 0) || 0;

    return (
        <div className="fade-in">
            <PageHeader
                title="Asset Registry"
                subtitle="Track, assign, and value university property and infrastructure."
            />

            <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--info-text)' }} />
                    <span className="stat-label">Total Assets</span>
                    <span className="stat-value">{assets?.length || 0}</span>
                    <span className="stat-trend">Registered Items</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--success-text)' }} />
                    <span className="stat-label">Total Portfolio Value</span>
                    <span className="stat-value" style={{ color: 'var(--success-text)' }}>${totalValue.toLocaleString()}</span>
                    <span className="stat-trend">Depreciation Applied</span>
                </Card>
            </div>

            <div className="grid-2 fade-in-delay-2">
                <Card>
                    <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                    <h2 className="data-value" style={{ textAlign: 'left', marginBottom: 'var(--space-4)' }}>Active Inventory</h2>

                    <div>
                        {assets?.map((asset, idx) => (
                            <div key={asset.id} className="data-row" style={{ borderBottom: idx === assets.length - 1 ? 'none' : undefined }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="data-value" style={{ textAlign: 'left' }}>{asset.name}</span>
                                    <span className="data-label">{asset.id} &bull; {asset.category}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                    <Badge colorScheme={asset.status === 'Available' ? 'success' : asset.status === 'Maintenance' ? 'danger' : 'info'}>
                                        {asset.status}
                                    </Badge>
                                    <span className="data-label" style={{ color: 'var(--text-bright)' }}>${asset.value.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <div className="card-accent-top" style={{ background: 'var(--warning-text)' }} />
                    <h2 className="data-value" style={{ textAlign: 'left', marginBottom: 'var(--space-4)' }}>Register New Asset</h2>

                    <div className="data-row">
                        <span className="data-label">Asset Name</span>
                        <input
                            type="text"
                            className="data-value"
                            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)' }}
                            value={formData.assetName}
                            onChange={e => setFormData({ ...formData, assetName: e.target.value })}
                        />
                    </div>

                    <div className="data-row">
                        <span className="data-label">Category</span>
                        <select
                            className="data-value"
                            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)' }}
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="IT Equipment">IT Equipment</option>
                            <option value="Lab Equipment">Lab Equipment</option>
                            <option value="Network Infrastructure">Network Infrastructure</option>
                        </select>
                    </div>

                    <div className="data-row">
                        <span className="data-label">Serial Number</span>
                        <input
                            type="text"
                            className="data-value"
                            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)' }}
                            value={formData.serialNumber}
                            onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                        />
                    </div>

                    <div className="data-row" style={{ borderBottom: 'none' }}>
                        <span className="data-label">Purchase Value ($)</span>
                        <input
                            type="number"
                            className="data-value"
                            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', width: '120px' }}
                            value={formData.purchaseValue || ''}
                            onChange={e => setFormData({ ...formData, purchaseValue: parseFloat(e.target.value) })}
                        />
                    </div>

                    <Button variant="primary" onClick={handleRegister} disabled={isPending || !formData.assetName} style={{ width: '100%', marginTop: 'var(--space-4)' }}>
                        {isPending ? 'Registering...' : 'Add to Registry'}
                    </Button>
                </Card>
            </div>
        </div>
    );
};