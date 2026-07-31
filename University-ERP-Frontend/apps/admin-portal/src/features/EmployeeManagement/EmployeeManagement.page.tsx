import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

interface OnboardEmployeePayload {
    firstName: string;
    lastName: string;
    role: string;
    departmentId: string;
}

export const useOnboardEmployee = () => {
    return useMutation({
        mutationFn: async (payload: OnboardEmployeePayload) => {
            const response = await fetch('/api/v1/hr/employees/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to onboard employee');
            }
            return response.json();
        },
    });
};

export const EmployeeManagementPage: React.FC = () => {
    const { mutateAsync: onboard, isPending, error } = useOnboardEmployee();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', role: '', departmentId: '' });
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        try {
            const result = await onboard(formData);
            setSuccessMsg(`Employee onboarded successfully! ID: ${result.employeeId}`);
            setFormData({ firstName: '', lastName: '', role: '', departmentId: '' });
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Human Resources: Employee Management</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Onboard New Employee</h2>
                {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">{error.message}</div>}
                {successMsg && <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">{successMsg}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" required placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="p-2 border rounded-md" />
                        <input type="text" required placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="p-2 border rounded-md" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" required placeholder="Role (e.g., Professor)" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="p-2 border rounded-md" />
                        <input type="text" required placeholder="Department ID" value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} className="p-2 border rounded-md" />
                    </div>
                    <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        {isPending ? 'Processing...' : 'Onboard Employee'}
                    </button>
                </form>
            </div>
        </div>
    );
};
