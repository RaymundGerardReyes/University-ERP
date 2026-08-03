import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { libraryCatalogApi } from '@university-erp/api-clients';

export const useCheckoutItem = () => {
    return useMutation({
        mutationFn: (payload: { itemId: string, borrowerId: string }) => 
            libraryCatalogApi.checkoutItem(payload.itemId, { borrowerId: payload.borrowerId }),
    });
};

export const CirculationPage: React.FC = () => {
    const { mutateAsync: checkout, isPending } = useCheckoutItem();
    const [itemId, setItemId] = useState('');
    const [borrowerId, setBorrowerId] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await checkout({ itemId, borrowerId });
            alert('Item checked out successfully');
        } catch(err) {
            alert('Error checking out item');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Library Circulation</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" required placeholder="Catalog Item ID" value={itemId} onChange={e => setItemId(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="text" required placeholder="Borrower ID (Student/Staff)" value={borrowerId} onChange={e => setBorrowerId(e.target.value)} className="w-full p-2 border rounded" />
                    <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded">Checkout Item</button>
                </form>
            </div>
        </div>
    );
};
