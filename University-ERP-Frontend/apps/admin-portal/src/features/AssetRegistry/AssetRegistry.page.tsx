import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { assetManagementApi } from '@university-erp/api-clients';
import { RegisterAssetPayload } from '@university-erp/domain-viewmodels';

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
        alert(`Asset Registered: ${result.assetId}`);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Asset Management: Registry</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" required placeholder="Asset Name" value={formData.assetName} onChange={e => setFormData({...formData, assetName: e.target.value})} className="w-full p-2 border rounded" />
                    <input type="text" required placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded" />
                    <input type="text" required placeholder="Serial Number" value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} className="w-full p-2 border rounded" />
                    <input type="number" required placeholder="Purchase Value" value={formData.purchaseValue} onChange={e => setFormData({...formData, purchaseValue: e.target.value})} className="w-full p-2 border rounded" />
                    <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded">Register Asset</button>
                </form>
            </div>
        </div>
    );
};
