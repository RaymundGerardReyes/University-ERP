import { useMutation } from '@tanstack/react-query';
import { procurementApi } from '@university-erp/api-clients';
import { CreatePurchaseOrderPayload } from '@university-erp/domain-viewmodels';
import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';

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
            setVendorId('');
            setAmount('');
        } catch (err: any) {
            console.error(err);
        }
    };

    const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginBottom: '1rem' };

    return (
        <div className="fade-in">
            <PageHeader title="Procurement" subtitle="Manage vendor purchase orders." />

            <Card style={{ maxWidth: '500px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit}>
                    {error && <div style={{ color: 'var(--danger-text)', marginBottom: '1rem' }}>{error.message}</div>}
                    {successMsg && <div style={{ color: 'var(--success-text)', marginBottom: '1rem' }}>{successMsg}</div>}

                    <input type="text" required placeholder="Vendor ID" value={vendorId} onChange={e => setVendorId(e.target.value)} style={inputStyle} />
                    <input type="number" required placeholder="Total Amount" value={amount} onChange={e => setAmount(Number(e.target.value))} style={inputStyle} />

                    <Button type="submit" variant="primary" disabled={isPending} style={{ width: '100%' }}>
                        {isPending ? 'Saving...' : 'Create Order'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};