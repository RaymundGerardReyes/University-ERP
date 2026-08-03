import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { governanceApi } from '@university-erp/api-clients';
export const useSubmitComplaint = () => {
    return useMutation({
        mutationFn: (payload) => governanceApi.submitGrievance(payload),
    });
};
export const GrievancesPage = () => {
    const { mutateAsync: submit, isPending, error } = useSubmitComplaint();
    const [complainantId, setComplainantId] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        try {
            const result = await submit({ complainantId, category, description });
            setSuccessMsg(`Grievance submitted successfully! Case ID: ${result.complaintId}`);
            setComplainantId('');
            setCategory('');
            setDescription('');
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Grievance Management" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Formal institutional complaints requiring investigation, escalation, and compliance auditing." }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "File a Formal Complaint" }), error && _jsx("div", { className: "p-4 mb-4 text-red-700 bg-red-100 rounded", children: error.message }), successMsg && _jsx("div", { className: "p-4 mb-4 text-green-700 bg-green-100 rounded", children: successMsg }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", required: true, placeholder: "Complainant ID (Anonymous allowed if empty string)", value: complainantId, onChange: e => setComplainantId(e.target.value), className: "w-full p-2 border rounded" }), _jsxs("select", { required: true, value: category, onChange: e => setCategory(e.target.value), className: "w-full p-2 border rounded", children: [_jsx("option", { value: "", disabled: true, children: "Select Category" }), _jsx("option", { value: "Academic", children: "Academic" }), _jsx("option", { value: "Conduct", children: "Student/Faculty Conduct" }), _jsx("option", { value: "Harassment", children: "Harassment/Discrimination" }), _jsx("option", { value: "Facilities", children: "Facilities/Health" })] }), _jsx("textarea", { required: true, placeholder: "Detailed Description of the Grievance (Attach evidence via separate upload module)", value: description, onChange: e => setDescription(e.target.value), className: "w-full p-2 border rounded h-32" }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-red-600 text-white py-2 rounded hover:bg-red-700", children: isPending ? 'Submitting...' : 'Submit Grievance' })] })] })] }));
};
