export interface InvoiceSummaryViewModel {
  invoiceId: string;
  studentId: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL';
  dueDate: string;
}
