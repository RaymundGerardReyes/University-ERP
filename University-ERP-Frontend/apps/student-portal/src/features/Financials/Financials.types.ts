// Mirroring the necessary types for the frontend consumption
export interface StudentInvoiceDto {
    invoiceId: string;
    termId: string;
    amountDue: number;
    amountPaid: number;
    dueDate: string;
    status: 'UNPAID' | 'PARTIAL' | 'PAID';
    breakdown: { category: string; amount: number }[];
    installments: { date: string; amount: number; status: 'PENDING' | 'PAID' }[];
}