import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { libraryCatalogApi } from '@university-erp/api-clients';
export const useCheckoutItem = () => {
    return useMutation({
        mutationFn: (payload) => libraryCatalogApi.checkoutItem(payload.itemId, { borrowerId: payload.borrowerId }),
    });
};
export const CirculationPage = () => {
    const { mutateAsync: checkout, isPending } = useCheckoutItem();
    const [itemId, setItemId] = useState('');
    const [borrowerId, setBorrowerId] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await checkout({ itemId, borrowerId });
            alert('Item checked out successfully');
        }
        catch (err) {
            alert('Error checking out item');
        }
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Library Circulation" }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", required: true, placeholder: "Catalog Item ID", value: itemId, onChange: e => setItemId(e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { type: "text", required: true, placeholder: "Borrower ID (Student/Staff)", value: borrowerId, onChange: e => setBorrowerId(e.target.value), className: "w-full p-2 border rounded" }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-blue-600 text-white py-2 rounded", children: "Checkout Item" })] }) })] }));
};
