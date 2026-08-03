import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { procurementApi } from '@university-erp/api-clients';
export const useCreatePurchaseOrder = () => {
    return useMutation({
        mutationFn: (payload) => procurementApi.createPurchaseOrder(payload),
    });
};
export const PurchaseOrdersPage = () => {
    const { mutateAsync: createOrder, isPending, error } = useCreatePurchaseOrder();
    const [vendorId, setVendorId] = useState('');
    const [amount, setAmount] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await createOrder({ vendorId, totalAmount: Number(amount) });
            setSuccessMsg(`Purchase Order created! ID: ${result.orderId}`);
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Procurement: Purchase Orders" }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [error && _jsx("div", { className: "text-red-600", children: error.message }), successMsg && _jsx("div", { className: "text-green-600", children: successMsg }), _jsx("input", { type: "text", required: true, placeholder: "Vendor ID", value: vendorId, onChange: e => setVendorId(e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { type: "number", required: true, placeholder: "Total Amount", value: amount, onChange: e => setAmount(Number(e.target.value)), className: "w-full p-2 border rounded" }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-blue-600 text-white py-2 rounded", children: isPending ? 'Saving...' : 'Create Order' })] }) })] }));
};
