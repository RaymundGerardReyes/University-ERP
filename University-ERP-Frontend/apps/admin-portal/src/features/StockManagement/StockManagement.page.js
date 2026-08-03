import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { inventoryApi } from '@university-erp/api-clients';
export const useAdjustStock = () => {
    return useMutation({
        mutationFn: (payload) => inventoryApi.adjustStock(payload),
    });
};
export const StockManagementPage = () => {
    const { mutateAsync: adjustStock, isPending } = useAdjustStock();
    const [itemId, setItemId] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        await adjustStock({ stockItemId: itemId, amount: Number(amount), reason });
        alert('Stock adjusted successfully');
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Inventory: Stock Management" }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", required: true, placeholder: "Stock Item ID", value: itemId, onChange: e => setItemId(e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { type: "number", required: true, placeholder: "Adjustment Amount (+/-)", value: amount, onChange: e => setAmount(Number(e.target.value)), className: "w-full p-2 border rounded" }), _jsx("input", { type: "text", required: true, placeholder: "Reason", value: reason, onChange: e => setReason(e.target.value), className: "w-full p-2 border rounded" }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-blue-600 text-white py-2 rounded", children: "Adjust Stock" })] }) })] }));
};
