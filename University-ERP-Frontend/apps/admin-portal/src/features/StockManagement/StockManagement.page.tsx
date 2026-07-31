import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

interface AdjustStockPayload {
    stockItemId: string;
    amount: number;
    reason: string;
}

export const useAdjustStock = () => {
    return useMutation({
        mutationFn: async (payload: AdjustStockPayload) => {
            const response = await fetch(`/api/v1/inventory/stock/${payload.stockItemId}/adjust`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: payload.amount, reason: payload.reason }),
            });
            if (!response.ok) throw new Error('Failed to adjust stock');
            return response.json();
        },
    });
};

export const StockManagementPage: React.FC = () => {
    const { mutateAsync: adjustStock, isPending } = useAdjustStock();
    const [itemId, setItemId] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [reason, setReason] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await adjustStock({ stockItemId: itemId, amount: Number(amount), reason });
        alert('Stock adjusted successfully');
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Inventory: Stock Management</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" required placeholder="Stock Item ID" value={itemId} onChange={e => setItemId(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="number" required placeholder="Adjustment Amount (+/-)" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 border rounded" />
                    <input type="text" required placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} className="w-full p-2 border rounded" />
                    <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded">Adjust Stock</button>
                </form>
            </div>
        </div>
    );
};
