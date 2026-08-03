import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { assetManagementApi } from '@university-erp/api-clients';
export const useRegisterAsset = () => {
    return useMutation({
        mutationFn: (payload) => assetManagementApi.registerAsset(payload),
    });
};
export const AssetRegistryPage = () => {
    const { mutateAsync: registerAsset, isPending } = useRegisterAsset();
    const [formData, setFormData] = useState({ assetName: '', category: '', serialNumber: '', purchaseValue: '' });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await registerAsset({ ...formData, purchaseValue: Number(formData.purchaseValue) });
        alert(`Asset Registered: ${result.assetId}`);
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Asset Management: Registry" }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", required: true, placeholder: "Asset Name", value: formData.assetName, onChange: e => setFormData({ ...formData, assetName: e.target.value }), className: "w-full p-2 border rounded" }), _jsx("input", { type: "text", required: true, placeholder: "Category", value: formData.category, onChange: e => setFormData({ ...formData, category: e.target.value }), className: "w-full p-2 border rounded" }), _jsx("input", { type: "text", required: true, placeholder: "Serial Number", value: formData.serialNumber, onChange: e => setFormData({ ...formData, serialNumber: e.target.value }), className: "w-full p-2 border rounded" }), _jsx("input", { type: "number", required: true, placeholder: "Purchase Value", value: formData.purchaseValue, onChange: e => setFormData({ ...formData, purchaseValue: e.target.value }), className: "w-full p-2 border rounded" }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-blue-600 text-white py-2 rounded", children: "Register Asset" })] }) })] }));
};
