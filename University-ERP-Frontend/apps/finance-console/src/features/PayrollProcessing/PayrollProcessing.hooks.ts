import { useMutation } from '@tanstack/react-query';

interface GeneratePayslipPayload {
    employeeId: string;
    basicSalary: number;
    allowances: number;
    deductions: number;
    payPeriod: string;
}

export const useGeneratePayslip = () => {
    return useMutation({
        mutationFn: async (payload: GeneratePayslipPayload) => {
            const response = await fetch('/api/v1/payroll/payslips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate payslip');
            }

            return response.json();
        },
    });
};
