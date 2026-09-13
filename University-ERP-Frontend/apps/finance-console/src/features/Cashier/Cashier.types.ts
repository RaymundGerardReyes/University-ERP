export type CashierTransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface CashierTransactionDto {
  transactionToken: string;
  referenceId: string;
  payerName: string;
  purpose: string;
  amount: number;
  status: CashierTransactionStatus;
  issuedAt: string;
  completedAt?: string;
  cashierId?: string;
}

export interface ProcessCashPaymentPayload {
  transactionToken: string;
  referenceId: string;
  amount: number;
}
