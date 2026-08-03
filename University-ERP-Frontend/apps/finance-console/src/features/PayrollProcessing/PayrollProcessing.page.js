import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useGeneratePayslip } from './PayrollProcessing.hooks';
export const PayrollProcessingPage = () => {
    const { mutateAsync: generatePayslip, isPending, error } = useGeneratePayslip();
    const [employeeId, setEmployeeId] = useState('');
    const [basicSalary, setBasicSalary] = useState('');
    const [allowances, setAllowances] = useState(0);
    const [deductions, setDeductions] = useState(0);
    const [payPeriod, setPayPeriod] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        try {
            const result = await generatePayslip({
                employeeId,
                basicSalary: Number(basicSalary),
                allowances: Number(allowances),
                deductions: Number(deductions),
                payPeriod
            });
            setSuccessMsg(`Payslip generated successfully! ID: ${result.payslipId}`);
            setEmployeeId('');
            setBasicSalary('');
            setAllowances(0);
            setDeductions(0);
            setPayPeriod('');
        }
        catch (err) {
            console.error('Error generating payslip', err);
        }
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Payroll Processing" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Manage faculty and staff salaries independently from HR records." }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Generate Employee Payslip" }), error && _jsx("div", { className: "p-4 mb-4 text-red-700 bg-red-100 rounded", children: error.message }), successMsg && _jsx("div", { className: "p-4 mb-4 text-green-700 bg-green-100 rounded", children: successMsg }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Employee ID (GUID)" }), _jsx("input", { type: "text", required: true, value: employeeId, onChange: (e) => setEmployeeId(e.target.value), className: "mt-1 block w-full p-2 border border-gray-300 rounded-md" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Basic Salary ($)" }), _jsx("input", { type: "number", required: true, min: "1", step: "0.01", value: basicSalary, onChange: (e) => setBasicSalary(Number(e.target.value)), className: "mt-1 block w-full p-2 border border-gray-300 rounded-md" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Pay Period" }), _jsx("input", { type: "text", required: true, value: payPeriod, onChange: (e) => setPayPeriod(e.target.value), className: "mt-1 block w-full p-2 border border-gray-300 rounded-md", placeholder: "e.g., Aug 2026" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Total Allowances ($)" }), _jsx("input", { type: "number", required: true, min: "0", step: "0.01", value: allowances, onChange: (e) => setAllowances(Number(e.target.value)), className: "mt-1 block w-full p-2 border border-gray-300 rounded-md" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Total Deductions ($)" }), _jsx("input", { type: "number", required: true, min: "0", step: "0.01", value: deductions, onChange: (e) => setDeductions(Number(e.target.value)), className: "mt-1 block w-full p-2 border border-gray-300 rounded-md" })] })] }), _jsx("div", { className: "pt-4 border-t border-gray-200", children: _jsxs("div", { className: "flex justify-between items-center text-lg font-bold", children: [_jsx("span", { children: "Estimated Net Pay:" }), _jsxs("span", { className: "text-green-600", children: ["$", (Number(basicSalary) + Number(allowances) - Number(deductions)).toFixed(2)] })] }) }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-emerald-600 text-white font-medium py-2 px-4 rounded-md hover:bg-emerald-700 mt-4 disabled:opacity-50", children: isPending ? 'Processing...' : 'Generate Payslip' })] })] })] }));
};
