import { useMutation } from '@tanstack/react-query';
import { hrApi } from '@university-erp/api-clients';
import { OnboardEmployeePayload } from '@university-erp/domain-viewmodels';
import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';

export const useOnboardEmployee = () => {
    return useMutation({
        mutationFn: (payload: OnboardEmployeePayload) => hrApi.onboardEmployee(payload),
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

    const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' };

    return (
        <div className="fade-in">
            <PageHeader title="Human Resources" subtitle="Onboard new university faculty and staff." />

            <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>Onboard Employee</h2>

                {error && <div style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-text)', borderRadius: '4px' }}>{error.message}</div>}
                {successMsg && <div style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-text)', borderRadius: '4px' }}>{successMsg}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="grid-2">
                        <input type="text" required placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} style={inputStyle} />
                        <input type="text" required placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} style={inputStyle} />
                    </div>
                    <div className="grid-2">
                        <input type="text" required placeholder="Role (e.g., Professor)" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={inputStyle} />
                        <input type="text" required placeholder="Department ID" value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} style={inputStyle} />
                    </div>
                    <Button type="submit" variant="primary" disabled={isPending} style={{ marginTop: '1rem' }}>
                        {isPending ? 'Processing...' : 'Onboard Employee'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};