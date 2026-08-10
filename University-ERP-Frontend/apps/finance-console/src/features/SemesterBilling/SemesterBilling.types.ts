export interface SemesterAssessmentDto {
    assessmentId: string;
    studentId: string;
    termId: string;
    totalAssessed: number;
    breakdown: { category: string; amount: number }[];
    status: 'DRAFT' | 'FINALIZED';
    assessedAtUtc: string;
}

export interface InvoiceDto {
    invoiceId: string;
    studentId: string;
    termId: string;
    amountDue: number;
    amountPaid: number;
    dueDate: string;
    status: 'UNPAID' | 'PARTIAL' | 'PAID';
}

export interface PaymentScheduleDto {
    scheduleId: string;
    invoiceId: string;
    installments: { date: string; amount: number; status: 'PENDING' | 'PAID' }[];
}