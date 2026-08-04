import { useMutation } from '@tanstack/react-query';
import { assetManagementApi } from '@university-erp/api-clients';
import { RegisterAssetPayload } from '@university-erp/domain-viewmodels';
import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';

export const useRegisterAsset = () => {
    return useMutation({
        mutationFn: (payload: RegisterAssetPayload) => assetManagementApi.registerAsset(payload),
    });
};

export const AssetRegistryPage: React.FC = () => {
    const { mutateAsync: registerAsset, isPending } = useRegisterAsset();
    const [formData, setFormData] = useState({ assetName: '', category: '', serialNumber: '', purchaseValue: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await registerAsset({ ...formData, purchaseValue: Number(formData.purchaseValue) });
        alert(`Asset Registered Successfully. ID: ${result.assetId}`);
        setFormData({ assetName: '', category: '', serialNumber: '', purchaseValue: '' });
    };

    const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginBottom: '1rem' };

    return (
        <div className="fade-in">
            <PageHeader title="Asset Management" subtitle="Register new high-value university assets." />

            <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit}>
                    <input type="text" required placeholder="Asset Name" value={formData.assetName} onChange={e => setFormData({ ...formData, assetName: e.target.value })} style={inputStyle} />
                    <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                        <input type="text" required placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ ...inputStyle, marginBottom: 0 }} />
                        <input type="text" required placeholder="Serial Number" value={formData.serialNumber} onChange={e => setFormData({ ...formData, serialNumber: e.target.value })} style={{ ...inputStyle, marginBottom: 0 }} />
                    </div>
                    <input type="number" required placeholder="Purchase Value ($)" value={formData.purchaseValue} onChange={e => setFormData({ ...formData, purchaseValue: e.target.value })} style={inputStyle} />

                    <Button type="submit" variant="primary" disabled={isPending} style={{ width: '100%' }}>
                        Register Asset
                    </Button>
                </form>
            </Card>
        </div>
    );
};