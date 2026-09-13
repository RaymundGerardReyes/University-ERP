export type GatewayStatusFilter = 'ALL' | 'PENDING' | 'SUCCESS' | 'FAILED';

export interface PaymentSessionRecord {
  sessionId: string;
  invoiceId: string;
  applicantId: string;
  amount: number;
  currency: string;
  status: string;
  bankReference?: string;
  createdAtUtc: string;
  consumedAtUtc?: string;
}

export interface GatewayTransaction {
  id: string;
  studentId: string;
  referenceNo: string;
  amount: number;
  method: 'CreditCard' | 'OnlineBanking' | 'EWallet' | 'CashierOTC';
  status: 'Settled' | 'Processing' | 'Failed';
  settledAt: string;
}
