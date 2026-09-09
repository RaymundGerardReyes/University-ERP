export type InvoiceStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'CANCELLED';

export interface InvoiceDto {
  invoiceId: string;
  studentId: string;
  termId: string;
  amountDue: number;
  amountPaid: number;
  dueDate: string;
  status: InvoiceStatus;
  description?: string;
  issuedAt?: string;
}

export interface IssueInvoicePayload {
  studentId: string;
  termId: string;
  amount: number;
  description: string;
  dueDate: string;
}

export interface IssueInvoiceResponse {
  invoiceId: string;
  status: string;
}
