import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { governanceApi } from '@university-erp/api-clients';
export const useCreateTicket = () => {
    return useMutation({
        mutationFn: (payload) => governanceApi.createTicket(payload),
    });
};
export const HelpdeskPage = () => {
    const { mutateAsync: createTicket, isPending, error } = useCreateTicket();
    const [requesterId, setRequesterId] = useState('');
    const [category, setCategory] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const [priority, setPriority] = useState('Low');
    const [successMsg, setSuccessMsg] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        try {
            const result = await createTicket({ requesterId, category, issueDescription, priority });
            setSuccessMsg(`Service Ticket Created! ID: ${result.ticketId}`);
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Institutional Helpdesk" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Operational IT, Maintenance, and Administrative Service Requests." }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [error && _jsx("div", { className: "text-red-600 bg-red-50 p-2 rounded", children: error.message }), successMsg && _jsx("div", { className: "text-green-600 bg-green-50 p-2 rounded", children: successMsg }), _jsx("input", { type: "text", required: true, placeholder: "Requester ID", value: requesterId, onChange: e => setRequesterId(e.target.value), className: "w-full p-2 border rounded" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("select", { required: true, value: category, onChange: e => setCategory(e.target.value), className: "w-full p-2 border rounded", children: [_jsx("option", { value: "", disabled: true, children: "Select Issue Category" }), _jsx("option", { value: "IT", children: "IT & Network" }), _jsx("option", { value: "LMS", children: "LMS Support" }), _jsx("option", { value: "Maintenance", children: "Maintenance" }), _jsx("option", { value: "Accounts", children: "Accounts & Passwords" })] }), _jsxs("select", { value: priority, onChange: e => setPriority(e.target.value), className: "w-full p-2 border rounded", children: [_jsx("option", { value: "Low", children: "Low Priority" }), _jsx("option", { value: "Medium", children: "Medium Priority" }), _jsx("option", { value: "High", children: "High Priority" }), _jsx("option", { value: "Critical", children: "Critical Priority" })] })] }), _jsx("textarea", { required: true, placeholder: "Describe the issue...", value: issueDescription, onChange: e => setIssueDescription(e.target.value), className: "w-full p-2 border rounded h-32" }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700", children: isPending ? 'Submitting...' : 'Create Support Ticket' })] }) })] }));
};
