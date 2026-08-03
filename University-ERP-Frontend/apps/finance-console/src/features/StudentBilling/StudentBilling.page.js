import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useIssueInvoice } from './StudentBilling.hooks';
export const StudentBillingPage = () => {
    const { mutateAsync: issueInvoice, isPending, error } = useIssueInvoice();
    const [studentId, setStudentId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        try {
            const result = await issueInvoice({
                studentId,
                amount: Number(amount),
                description
            });
            setSuccessMsg(`Invoice generated successfully! ID: ${result.invoiceId}`);
            setStudentId('');
            setAmount('');
            setDescription('');
        }
        catch (err) {
            console.error('Error generating invoice', err);
        }
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Student Billing & Accounts Receivable" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Manage student invoices, tuition fees, and auxiliary charges." }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Issue New Invoice" }), error && _jsx("div", { className: "p-4 mb-4 text-red-700 bg-red-100 rounded", children: error.message }), successMsg && _jsx("div", { className: "p-4 mb-4 text-green-700 bg-green-100 rounded", children: successMsg }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Student ID (GUID)" }), _jsx("input", { type: "text", required: true, value: studentId, onChange: (e) => setStudentId(e.target.value), className: "mt-1 block w-full p-2 border border-gray-300 rounded-md", placeholder: "00000000-0000-0000-0000-000000000000" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Amount ($)" }), _jsx("input", { type: "number", required: true, min: "1", step: "0.01", value: amount, onChange: (e) => setAmount(Number(e.target.value)), className: "mt-1 block w-full p-2 border border-gray-300 rounded-md" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Description" }), _jsx("input", { type: "text", required: true, value: description, onChange: (e) => setDescription(e.target.value), className: "mt-1 block w-full p-2 border border-gray-300 rounded-md", placeholder: "e.g., Fall 2026 Tuition Fee" })] }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50", children: isPending ? 'Processing...' : 'Issue Invoice' })] })] })] }));
};
