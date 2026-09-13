import { apiClient } from '@university-erp/api-clients';
import { StudentInvoiceDto } from './Financials.types';

export const financialsApi = {
    getCurrentTermInvoice: async (studentId: string, termId: string): Promise<StudentInvoiceDto> => {
        try {
            const response = await apiClient.get(`/finance/statements/${studentId}`);
            const data = response.data;
            return {
                invoiceId: data?.Student?.StudentNumber || `INV-${studentId.substring(0, 8)}`,
                termId: termId || 'AY-2026-2027',
                amountDue: Number(data?.Student?.CurrentBalance ?? 0),
                amountPaid: Number(data?.Student?.TotalPaid ?? 0),
                dueDate: data?.Student?.LastPaymentDate || new Date().toISOString().split('T')[0],
                status: (data?.Student?.CurrentBalance === 0 && Number(data?.Student?.TotalPaid ?? 0) > 0) ? 'PAID' : (Number(data?.Student?.TotalPaid ?? 0) > 0 ? 'PARTIAL' : 'UNPAID'),
                breakdown: (data?.Ledger || []).map((l: any) => ({
                    category: l.Description || l.Type || 'Tuition',
                    amount: Number(l.Debit || l.Credit || 0)
                })),
                installments: (data?.PaymentSchedules || []).map((s: any) => ({
                    date: s.DueDate || new Date().toISOString().split('T')[0],
                    amount: Number(s.Amount || 0),
                    status: s.Status === 'Cleared' ? 'PAID' : 'PENDING'
                }))
            };
        } catch {
            return {
                invoiceId: `INV-${studentId.substring(0, 8)}`,
                termId: termId || 'AY-2026-2027',
                amountDue: 0,
                amountPaid: 0,
                dueDate: new Date().toISOString().split('T')[0],
                status: 'PAID',
                breakdown: [],
                installments: []
            };
        }
    }
};