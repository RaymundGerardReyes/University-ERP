import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { hrApi } from '@university-erp/api-clients';
export const useOnboardEmployee = () => {
    return useMutation({
        mutationFn: (payload) => hrApi.onboardEmployee(payload),
    });
};
export const EmployeeManagementPage = () => {
    const { mutateAsync: onboard, isPending, error } = useOnboardEmployee();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', role: '', departmentId: '' });
    const [successMsg, setSuccessMsg] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        try {
            const result = await onboard(formData);
            setSuccessMsg(`Employee onboarded successfully! ID: ${result.employeeId}`);
            setFormData({ firstName: '', lastName: '', role: '', departmentId: '' });
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Human Resources: Employee Management" }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Onboard New Employee" }), error && _jsx("div", { className: "p-4 mb-4 text-red-700 bg-red-100 rounded", children: error.message }), successMsg && _jsx("div", { className: "p-4 mb-4 text-green-700 bg-green-100 rounded", children: successMsg }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("input", { type: "text", required: true, placeholder: "First Name", value: formData.firstName, onChange: (e) => setFormData({ ...formData, firstName: e.target.value }), className: "p-2 border rounded-md" }), _jsx("input", { type: "text", required: true, placeholder: "Last Name", value: formData.lastName, onChange: (e) => setFormData({ ...formData, lastName: e.target.value }), className: "p-2 border rounded-md" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("input", { type: "text", required: true, placeholder: "Role (e.g., Professor)", value: formData.role, onChange: (e) => setFormData({ ...formData, role: e.target.value }), className: "p-2 border rounded-md" }), _jsx("input", { type: "text", required: true, placeholder: "Department ID", value: formData.departmentId, onChange: (e) => setFormData({ ...formData, departmentId: e.target.value }), className: "p-2 border rounded-md" })] }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700", children: isPending ? 'Processing...' : 'Onboard Employee' })] })] })] }));
};
