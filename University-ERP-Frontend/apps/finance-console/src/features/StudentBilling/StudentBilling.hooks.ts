import { useMutation } from '@tanstack/react-query';

interface IssueInvoicePayload {
    studentId: string;
    amount: number;
    description: string;
}

export const useIssueInvoice = () => {
    return useMutation({
        mutationFn: async (payload: IssueInvoicePayload) => {
            const response = await fetch('/api/v1/finance/invoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to issue invoice');
            }

            return response.json();
        },
    });
};
