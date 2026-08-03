import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { procurementApi } from '@university-erp/api-clients';
import { CreatePurchaseOrderPayload } from '@university-erp/domain-viewmodels';

export const useCreatePurchaseOrder = () => {
    return useMutation({
        mutationFn: (payload: CreatePurchaseOrderPayload) => procurementApi.createPurchaseOrder(payload),
    });
};

export const PurchaseOrdersPage: React.FC = () => {
    const { mutateAsync: createOrder, isPending, error } = useCreatePurchaseOrder();
    const [vendorId, setVendorId] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await createOrder({ vendorId, totalAmount: Number(amount) });
            setSuccessMsg(`Purchase Order created! ID: ${result.orderId}`);
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Procurement: Purchase Orders</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="text-red-600">{error.message}</div>}
                    {successMsg && <div className="text-green-600">{successMsg}</div>}
                    <input type="text" required placeholder="Vendor ID" value={vendorId} onChange={e => setVendorId(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="number" required placeholder="Total Amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 border rounded" />
                    <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded">{isPending ? 'Saving...' : 'Create Order'}</button>
                </form>
            </div>
        </div>
    );
};
