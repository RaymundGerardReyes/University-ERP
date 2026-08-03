import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { governanceApi } from '@university-erp/api-clients';
export const useRegisterVisitor = () => {
    return useMutation({
        mutationFn: (payload) => governanceApi.logVisitor(payload),
    });
};
export const VisitorsPage = () => {
    const { mutateAsync: registerVisitor, isPending } = useRegisterVisitor();
    const [visitorName, setVisitorName] = useState('');
    const [purpose, setPurpose] = useState('');
    const [hostId, setHostId] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await registerVisitor({ visitorName, purpose, hostId });
            alert(`Visitor Registered! Log ID: ${result.logId}`);
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Visitor Management" }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", required: true, placeholder: "Visitor Name", value: visitorName, onChange: e => setVisitorName(e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { type: "text", required: true, placeholder: "Purpose of Visit", value: purpose, onChange: e => setPurpose(e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { type: "text", required: true, placeholder: "Host/Employee ID", value: hostId, onChange: e => setHostId(e.target.value), className: "w-full p-2 border rounded" }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-emerald-600 text-white py-2 rounded", children: "Register Visitor Access" })] }) })] }));
};
